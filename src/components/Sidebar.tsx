
import { Link, useLocation } from "react-router-dom";
import { Book, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return null;
  }
  
  const navItems = [
    {
      name: "Question Bank",
      path: "/questions",
      icon: <Book className="h-5 w-5" />
    },
    {
      name: "Create Question",
      path: "/create-question",
      icon: <PlusSquare className="h-5 w-5" />
    },
  ];
  
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-slate-200 bg-slate-50/80 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="flex h-14 items-center border-b border-slate-200 px-4 dark:border-slate-700/60">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold">QMS</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-slate-700 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50",
                    location.pathname === item.path && "bg-slate-200/50 font-medium dark:bg-slate-800/50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
