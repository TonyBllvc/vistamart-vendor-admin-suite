import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminLayout from "./layouts/AdminLayout";
import VendorLayout from "./layouts/VendorLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import UserManagement from "./pages/admin/UserManagement";
import BrandManagement from "./pages/admin/BrandManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminWallet from "./pages/admin/AdminWallet";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOrders from "./pages/admin/AdminOrders";
import ProductUpload from "./pages/vendor/ProductUpload";
import ProductManagement from "./pages/vendor/ProductManagement";
import VendorRevenue from "./pages/vendor/VendorRevenue";
import VendorSettings from "./pages/vendor/VendorSettings";
import VendorWallet from "./pages/vendor/VendorWallet";
import VendorMessages from "./pages/vendor/VendorMessages";
import UserAffiliateLayout from "./layouts/UserAffiliateLayout";
import UserDashboard from "./pages/user/UserDashboard";
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import UserCart from "./pages/user/UserCart";
import UserOrders from "./pages/user/UserOrders";
import UserWishlist from "./pages/user/UserWishlist";
import UserTransactions from "./pages/user/UserTransactions";
import UserWallet from "./pages/user/UserWallet";
import UserProfile from "./pages/user/UserProfile";
import AffiliateEarnings from "./pages/affiliate/AffiliateEarnings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<SidebarProvider><AdminLayout /></SidebarProvider>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="brands" element={<BrandManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="wallet" element={<AdminWallet />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Vendor Routes */}
          <Route path="/vendor" element={<SidebarProvider><VendorLayout /></SidebarProvider>}>
            <Route index element={<VendorDashboard />} />
            <Route path="products/upload" element={<ProductUpload />} />
            <Route path="products/manage" element={<ProductManagement />} />
            <Route path="revenue" element={<VendorRevenue />} />
            <Route path="wallet" element={<VendorWallet />} />
            <Route path="messages" element={<VendorMessages />} />
            <Route path="settings" element={<VendorSettings />} />
          </Route>
          
          {/* User Routes */}
          <Route path="/user" element={<SidebarProvider><UserAffiliateLayout /></SidebarProvider>}>
            <Route index element={<UserDashboard />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="wishlist" element={<UserWishlist />} />
            <Route path="transactions" element={<UserTransactions />} />
            <Route path="wallet" element={<UserWallet />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          
          {/* Affiliate Routes */}
          <Route path="/affiliate" element={<SidebarProvider><UserAffiliateLayout /></SidebarProvider>}>
            <Route index element={<AffiliateDashboard />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="wishlist" element={<UserWishlist />} />
            <Route path="transactions" element={<UserTransactions />} />
            <Route path="wallet" element={<UserWallet />} />
            <Route path="earnings" element={<AffiliateEarnings />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;