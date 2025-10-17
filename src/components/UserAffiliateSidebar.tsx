import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Heart,
  Package,
  Users,
  DollarSign,
  FileText,
  Settings,
  User,
  Gift,
  TrendingUp,
  Wallet,
  CreditCard,
  MessageCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const userItems = [
  { title: "Dashboard", url: "/user", icon: LayoutDashboard },
  { title: "Cart", url: "/user/cart", icon: ShoppingCart },
  { title: "Orders", url: "/user/orders", icon: Package },
  { title: "Wishlist", url: "/user/wishlist", icon: Heart },
  { title: "Transaction History", url: "/user/transactions", icon: Receipt },
  { title: "Wallet", url: "/user/wallet", icon: Wallet },
  { title: "Messages", url: "/user/messages", icon: MessageCircle },
  { title: "Profile", url: "/user/profile", icon: User },
];

const affiliateItems = [
  { title: "Dashboard", url: "/affiliate", icon: LayoutDashboard },
  { title: "Cart", url: "/affiliate/cart", icon: ShoppingCart },
  { title: "Orders", url: "/affiliate/orders", icon: Package },
  { title: "Wishlist", url: "/affiliate/wishlist", icon: Heart },
  { title: "Transaction History", url: "/affiliate/transactions", icon: Receipt },
  { title: "Wallet", url: "/affiliate/wallet", icon: Wallet },
  { title: "Referrals", url: "/affiliate/referrals", icon: Users },
  { title: "Earnings", url: "/affiliate/earnings", icon: DollarSign },
  { title: "Withdrawal", url: "/affiliate/withdrawal", icon: CreditCard },
  { title: "Performance", url: "/affiliate/performance", icon: TrendingUp },
  { title: "Marketing Tools", url: "/affiliate/marketing", icon: Gift },
  { title: "Reports", url: "/affiliate/reports", icon: FileText },
  { title: "Messages", url: "/affiliate/messages", icon: MessageCircle },
  { title: "Profile", url: "/affiliate/profile", icon: User },
];

const UserAffiliateSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isAffiliate = currentPath.startsWith('/affiliate');
  const items = isAffiliate ? affiliateItems : userItems;
  
  const isActive = (path: string) => currentPath === path;
  
  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-affiliate-primary/10 text-affiliate-primary border-r-2 border-affiliate-primary font-medium" 
      : "text-gray-700 hover:bg-affiliate-primary/5 hover:text-affiliate-primary";
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-gray-200 bg-white shadow-lg`}>
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-affiliate-primary to-affiliate-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {isAffiliate ? 'A' : 'U'}
            </span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-gray-900">
                {isAffiliate ? 'Affiliate' : 'User'} Panel
              </h2>
              <p className="text-xs text-gray-500">VistaMart</p>
            </div>
          )}
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium px-2 mb-2">
            {isAffiliate ? 'Affiliate Menu' : 'User Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
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
};

export default UserAffiliateSidebar;