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
  LogOut,
  Sparkles
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { signOut } = useAuth();
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
    <div className={cn("pb-12 w-64 border-r bg-background/50 backdrop-blur-xl relative z-20", className)}>
      <div className="space-y-4 py-4">
        <div className="px-6 py-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
             <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              EKOS
            </h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Enterprise OS
            </p>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => cn(
                  "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                  isActive 
                    ? "bg-secondary/50 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={cn(
                      "mr-3 h-4 w-4 transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} />
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative background blob */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-secondary/20 to-transparent pointer-events-none" />

      <div className="absolute bottom-4 px-6 w-full">
         <Button 
           variant="ghost" 
           className="w-full justify-start pl-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
           onClick={() => signOut()}
         >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
         </Button>
      </div>
    </div>
  );
}
