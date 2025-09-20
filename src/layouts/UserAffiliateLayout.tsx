import { Outlet } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar";
import UserAffiliateSidebar from "@/components/UserAffiliateSidebar";

const UserAffiliateLayout = () => {
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-amber-50">
      <UserAffiliateSidebar />
      <SidebarInset className="flex-1">
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  );
};

export default UserAffiliateLayout;