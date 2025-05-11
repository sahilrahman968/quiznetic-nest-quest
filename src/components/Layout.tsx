
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/services/api";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, teacher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-extrabold text-[#58cc02]">Question Management System</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Logged in as {teacher?.name}</span>
              <Button onClick={handleLogout} variant="outline" size="sm" className="hover:bg-[#f9f9f9] border-[#58cc02] text-[#58cc02]">Logout</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="hover:bg-[#f9f9f9] border-[#58cc02] text-[#58cc02]">Login</Button>
            </Link>
          )}
        </div>
      </header>

      {isAuthenticated && (
        <nav className="bg-[#58cc02] text-white border-b">
          <div className="container mx-auto px-4">
            <ul className="flex space-x-6 py-3">
              <li>
                <Link to="/questions" className="font-bold hover:text-[#fff6cd] transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link to="/create-question" className="font-bold hover:text-[#fff6cd] transition-colors">
                  Create Question
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
