
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/services/api";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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
    <div className="flex min-h-screen bg-[#f9f9f9]">
      {isAuthenticated && <AppSidebar />}
      <SidebarInset className="bg-[#f9f9f9]">
        <header className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {isAuthenticated && <SidebarTrigger />}
              <Link to="/" className="text-xl font-extrabold text-[#58cc02]">Question Management System</Link>
            </div>
            
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

        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
};

export default Layout;
