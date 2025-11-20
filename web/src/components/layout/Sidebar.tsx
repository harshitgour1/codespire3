import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Search, 
  Image as ImageIcon, 
  Clock, 
  Network, 
  Video, 
  Settings,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const links = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Search", href: "/search", icon: Search },
    { name: "Screenshots", href: "/screenshot", icon: ImageIcon },
    { name: "Timeline", href: "/timeline", icon: Clock },
    { name: "Knowledge Graph", href: "/graph", icon: Network },
    { name: "Meetings", href: "/meetings", icon: Video },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  return (
    <div className={cn("pb-12 w-64 border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            EKOS
          </h2>
          <p className="px-2 text-xs text-muted-foreground">
            Enterprise Knowledge OS
          </p>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 px-7 w-full">
         <Button variant="ghost" className="w-full justify-start pl-0 text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
         </Button>
      </div>
    </div>
  );
}
