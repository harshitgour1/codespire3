import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/state/useUserStore";

export default function AppLayout() {
  const { user } = useUserStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="font-medium text-sm text-muted-foreground">
            Workspace / <span className="text-foreground">General</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
