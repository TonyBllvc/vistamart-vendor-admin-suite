import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Package,
  DollarSign,
  Settings,
  BarChart3,
  MessageCircle,
  Store
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/vendor", icon: LayoutDashboard },
  { title: "Upload Product", url: "/vendor/products/upload", icon: Upload },
  { title: "Manage Products", url: "/vendor/products/manage", icon: Package },
  { title: "Revenue", url: "/vendor/revenue", icon: DollarSign },
  { title: "Analytics", url: "/vendor/analytics", icon: BarChart3 },
  { title: "Orders", url: "/vendor/orders", icon: Store },
  { title: "Messages", url: "/vendor/messages", icon: MessageCircle },
  { title: "Settings", url: "/vendor/settings", icon: Settings },
];

export function VendorSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/vendor") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";
    return isActive(path) 
      ? `${baseClass} bg-secondary/20 text-secondary font-medium border border-secondary/30`
      : `${baseClass} text-muted-foreground hover:bg-secondary/10 hover:text-secondary`;
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-background border-r">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground font-bold">VM</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-foreground">VistaMart</h2>
                <p className="text-sm text-muted-foreground">Vendor Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-4">Vendor Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
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