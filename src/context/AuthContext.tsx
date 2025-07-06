import { createContext, useContext, useEffect, useState } from "react";

// Define user roles
export type UserRole = "ADMIN" | "EMPLOYEE" | "USER";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string; // Optional token for authentication
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: User) => void;
  isAuthenticated: () => boolean;
  getDashboardRoute: () => string;
  getProfileRoute: () => string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  signup: () => {},
  isAuthenticated: () => false,
  getDashboardRoute: () => "/",
  getProfileRoute: () => "/",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function login(userData: User) {
    setUser(userData);
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function signup(userData: User) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem("user");
  }

  function isAuthenticated(): boolean {
    return user !== null;
  }

  function getDashboardRoute(): string {
    console.log("user", user);

    if (!user) return "/";
    switch (user.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "EMPLOYEE":
        return "/employee/dashboard";
      case "USER":
        return "/user/dashboard";
      default:
        return "/";
    }
  }

  function getProfileRoute(): string {
    if (!user) return "/";
    switch (user.role) {
      case "ADMIN":
        return "/admin/profile";
      case "EMPLOYEE":
        return "/employee/profile";
      case "USER":
        return "/user/profile";
      default:
        return "/";
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while checking localStorage
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        signup,
        isAuthenticated,
        getDashboardRoute,
        getProfileRoute,
      }}
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

// {"email":"b@c.com","role":"USER","token":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiQGMuY29tIiwicm9sZSI6IlVTRVIiLCJpZCI6IjY4Njc3Y2NhODlmYTFiMGVkNWM3MTcxOSIsImlhdCI6MTc1MTYyMTY2OSwiZXhwIjoxNzUxNzA4MDY5fQ.4TBzALRBuVa3OCoJ4etMQjifE1xsgRxwRyecag9Atc4","id":"68677cca89fa1b0ed5c71719","name":"ab"}
