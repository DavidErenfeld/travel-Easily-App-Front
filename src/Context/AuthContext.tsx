import React, { createContext, useContext, useState, ReactNode } from "react";
import authService, { IUser } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated");
    return savedAuthState === "true";
  });

  const [user, setUser] = useState<IUser | null>(() => {
    const savedUserId = localStorage.getItem("loggedUserId");
    const userName = localStorage.getItem("userName") || undefined;
    const imgUrl = localStorage.getItem("imgUrl") || undefined;
    return savedUserId ? { _id: savedUserId, userName, imgUrl } : null;
  });

  const login = (userData: IUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("loggedUserId", userData._id! || "");
    localStorage.setItem("userName", userData.userName || "");
    localStorage.setItem("imgUrl", userData.imgUrl || "");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("loggedUserId");
      localStorage.removeItem("userName");
      localStorage.removeItem("imgUrl");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
