import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1">
        <header className="h-16 flex items-center border-b bg-background px-6">
          <SidebarTrigger className="mr-4" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VistaMart Admin</h1>
              <p className="text-sm text-muted-foreground">Manage your marketplace</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;