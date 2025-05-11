
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Teacher, isAuthenticated, getLoggedInTeacher } from "@/services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  teacher: { id: string; name: string } | null;
  setAuthStatus: (status: boolean) => void;
  setTeacher: (teacher: { id: string; name: string } | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  teacher: null,
  setAuthStatus: () => {},
  setTeacher: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [teacher, setTeacher] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
      
      if (authStatus) {
        const teacherInfo = getLoggedInTeacher();
        setTeacher(teacherInfo);
      }
    };

    checkAuthStatus();
  }, []);

  const value = {
    isAuthenticated: isAuth,
    teacher,
    setAuthStatus: setIsAuth,
    setTeacher,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
