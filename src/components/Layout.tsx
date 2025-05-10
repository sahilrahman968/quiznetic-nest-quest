
import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/services/api";
import { Code, Brain, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, teacher } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-accent" />
            <span className="glow-text">Question Management System</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Logged in as {teacher?.name}</span>
                <Button onClick={handleLogout} variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">Login</Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {isAuthenticated && (
        <nav className="bg-secondary/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
          <div className="container mx-auto px-4">
            <ul className="flex space-x-6 py-2">
              <li>
                <Link to="/questions" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>Question Bank</span>
                </Link>
              </li>
              <li>
                <Link to="/create-question" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  <span>Create Question</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
