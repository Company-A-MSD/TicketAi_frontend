import { createContext, useContext, useEffect, useState } from "react";

// Define user roles
export type UserRole = "admin" | "manager" | "agent" | "user";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  permissions?: string[];
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  hasPermission: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    // In a real app, you'd fetch this from your API or localStorage
    setTimeout(() => {
      // Example: Set a mock user - replace with actual auth logic
      setUser({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatars/john.jpg",
        role: "admin", // Change this to test different roles
        permissions: [
          "read:users",
          "write:users",
          "read:tickets",
          "write:tickets",
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  function login(userData: User) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  function hasRole(role: UserRole): boolean {
    return user?.role === role;
  }

  function hasPermission(permission: string): boolean {
    return user?.permissions?.includes(permission) || false;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, hasRole, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}