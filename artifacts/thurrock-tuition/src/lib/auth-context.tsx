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
