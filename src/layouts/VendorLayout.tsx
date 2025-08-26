import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/VendorSidebar";

const VendorLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <VendorSidebar />
      <div className="flex-1">
        <header className="h-16 flex items-center border-b bg-background px-6">
          <SidebarTrigger className="mr-4" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-sm">VM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VistaMart Vendor</h1>
              <p className="text-sm text-muted-foreground">Manage your store</p>
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

export default VendorLayout;