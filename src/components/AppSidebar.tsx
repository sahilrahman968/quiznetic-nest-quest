
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage Questions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={item.comingSoon ? false : isActive(item.path)}
                    onClick={() => handleNavigate(item.path, item.comingSoon)}
                    tooltip={item.title}
                    className={cn(
                      "font-bold",
                      item.comingSoon && "text-gray-400 hover:text-gray-500"
                    )}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    {item.comingSoon && (
                      <span className="text-xs ml-2 bg-duolingo-orange/20 text-duolingo-orange px-2 py-0.5 rounded-full">Soon</span>
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
