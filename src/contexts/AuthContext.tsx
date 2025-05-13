
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isAuthenticated as checkAuth, getTeacher } from "@/services/api";

interface Teacher {
  id: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  teacher: Teacher | null;
  setAuthStatus: (status: boolean) => void;
  setTeacher: (teacher: Teacher | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  teacher: null,
  setAuthStatus: () => {},
  setTeacher: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = checkAuth();
      setIsAuth(authStatus);
      
      if (authStatus) {
        const teacherInfo = getTeacher();
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
