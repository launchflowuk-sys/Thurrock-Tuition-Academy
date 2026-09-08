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
  // Only ask the server who we are when a session cookie actually exists.
  //
  // Every visitor to the public marketing site used to fire GET /api/auth/me,
  // get a 401, and leave a red error in the browser console — which Lighthouse
  // reports as "browser errors were logged to the console", and which is
  // simply noise for the 99% of visitors who are not signed in. It also spent
  // a request and a round trip on every public page view.
  //
  // The cookie is httpOnly, so this cannot read its value — but its presence
  // is visible, and presence is all we need to decide whether asking is worth
  // it. A stale cookie still resolves correctly: the request runs and returns
  // 401, exactly as before.
  const hasSessionCookie =
    typeof document !== "undefined" && document.cookie.includes("tta.sid=");

  const meQuery = useGetCurrentUser({
    query: {
      retry: false,
      queryKey: getGetCurrentUserQueryKey(),
      enabled: hasSessionCookie,
    },
  });

  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const value: AuthContextValue = {
    user: meQuery.data,
    isLoading: hasSessionCookie ? meQuery.isLoading : false,
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
