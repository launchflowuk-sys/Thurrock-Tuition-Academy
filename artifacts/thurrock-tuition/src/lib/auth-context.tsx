import { createContext, useContext, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCurrentUser,
  useSignup,
  useLogin,
  useLogout,
  getGetCurrentUserQueryKey,
  type AuthUser,
} from "@workspace/api-client-react";

interface AuthContextValue {
  user: AuthUser | undefined;
  isLoading: boolean;
  signup: (email: string, password: string, fullName?: string) => Promise<AuthUser>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // Always ask the server who we are.
  //
  // A previous version gated this on `document.cookie.includes("tta.sid=")` to
  // avoid a 401 in the console for signed-out visitors. That was wrong and it
  // broke sign-in completely: the session cookie is httpOnly (session.ts), and
  // httpOnly cookies are invisible to document.cookie *by definition*. The
  // check could therefore never be true, /api/auth/me was never called, the
  // app never learned it was signed in, and /auth-redirect bounced straight
  // back to /sign-in — an unbreakable loop for every admin and parent.
  //
  // The 401 it was trying to silence is correct, harmless behaviour: it is how
  // an unauthenticated caller is told they are unauthenticated. If the console
  // noise is worth removing later, the fix is for /api/auth/me to answer 200
  // with a null user, not to guess at cookie state on the client.
  const meQuery = useGetCurrentUser({
    query: { retry: false, queryKey: getGetCurrentUserQueryKey() },
  });

  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const value: AuthContextValue = {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    signup: async (email, password, fullName) => {
      const user = await signupMutation.mutateAsync({ data: { email, password, fullName } });
      queryClient.setQueryData(getGetCurrentUserQueryKey(), user);
      await queryClient.refetchQueries({ queryKey: getGetCurrentUserQueryKey() });
      return user;
    },
    login: async (email, password) => {
      const user = await loginMutation.mutateAsync({ data: { email, password } });
      queryClient.setQueryData(getGetCurrentUserQueryKey(), user);
      await queryClient.refetchQueries({ queryKey: getGetCurrentUserQueryKey() });
      return user;
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
      queryClient.clear();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
