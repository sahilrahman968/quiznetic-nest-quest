
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Book, Plus, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      title: "Question Bank",
      icon: Book,
      path: "/questions",
      comingSoon: false
    },
    {
      title: "Create Question",
      icon: Plus,
      path: "/create-question",
      comingSoon: false
    },
    {
      title: "Question Paper Bank",
      icon: LayoutList,
      path: "/question-papers",
      comingSoon: true
    },
    {
      title: "Create Question Paper",
      icon: Plus,
      path: "/create-question-paper",
      comingSoon: true
    }
  ];

  const handleNavigate = (path: string, comingSoon: boolean) => {
    if (comingSoon) {
      navigate("/coming-soon");
    } else {
      navigate(path);
    }
  };

  return (
    <Sidebar className="bg-white border-r border-chatgpt-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-chatgpt-lightText font-medium">Manage Questions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={item.comingSoon ? false : isActive(item.path)}
                    onClick={() => handleNavigate(item.path, item.comingSoon)}
                    tooltip={item.title}
                    className={cn(
                      "font-medium",
                      item.comingSoon && "text-chatgpt-lightText hover:text-chatgpt-text"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    {item.comingSoon && (
                      <span className="text-xs ml-2 bg-chatgpt-lightGray text-chatgpt-lightText px-2 py-0.5 rounded-full">Soon</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
