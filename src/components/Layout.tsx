
import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/services/api";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { BookOpen, PlusCircle, FileText, FilePlus } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, teacher } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      title: "Question Bank",
      icon: BookOpen,
      path: "/questions",
      disabled: false
    },
    {
      title: "Create Question",
      icon: PlusCircle,
      path: "/create-question",
      disabled: false
    },
    {
      title: "Question Paper Bank",
      icon: FileText,
      path: "/question-papers",
      disabled: true
    },
    {
      title: "Create Question Paper",
      icon: FilePlus,
      path: "/create-question-paper",
      disabled: true
    }
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col bg-[#f9f9f9] w-full">
        <header className="bg-white border-b shadow-sm z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              {isAuthenticated && (
                <SidebarTrigger className="mr-3 text-[#58cc02]" />
              )}
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

        <div className="flex flex-1">
          {isAuthenticated && (
            <Sidebar variant="sidebar" className="sidebar-shadow">
              <SidebarRail />
              <SidebarHeader>
                <div className="flex items-center justify-center h-14 border-b border-sidebar-border">
                  <h2 className="text-lg font-bold text-white">Menu</h2>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === item.path}
                            tooltip={item.title}
                            aria-disabled={item.disabled}
                            className={item.disabled ? "opacity-60 cursor-not-allowed" : ""}
                          >
                            <Link to={item.disabled ? "#" : item.path} 
                              onClick={(e) => item.disabled && e.preventDefault()}>
                              <item.icon />
                              <span>{item.title}</span>
                              {item.disabled && <span className="ml-2 text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-0.5 rounded-full">Soon</span>}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          )}
          
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
