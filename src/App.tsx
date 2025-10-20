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
import AddBrand from "./pages/admin/AddBrand";
import CategoryManagement from "./pages/admin/CategoryManagement";
import AddCategory from "./pages/admin/AddCategory";
import AddMainCategory from "./pages/admin/AddMainCategory";
import AddSubcategory from "./pages/admin/AddSubcategory";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminWallet from "./pages/admin/AdminWallet";
import AdminUserWallets from "./pages/admin/AdminUserWallets";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOrders from "./pages/admin/AdminOrders";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogUpload from "./pages/admin/BlogUpload";
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
import UserOrderDetails from "./pages/user/UserOrderDetails";
import UserWishlist from "./pages/user/UserWishlist";
import UserTransactions from "./pages/user/UserTransactions";
import UserTransactionDetails from "./pages/user/UserTransactionDetails";
import UserWallet from "./pages/user/UserWallet";
import UserProfile from "./pages/user/UserProfile";
import UserMessages from "./pages/user/UserMessages";
import VendorTransactionDetails from "./pages/vendor/VendorTransactionDetails";
import AffiliateEarnings from "./pages/affiliate/AffiliateEarnings";
import AffiliateMessages from "./pages/affiliate/AffiliateMessages";
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
            <Route path="brands/add" element={<AddBrand />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="categories/add-main" element={<AddMainCategory />} />
            <Route path="categories/add-sub" element={<AddSubcategory />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/upload" element={<BlogUpload />} />
            <Route path="blog/edit/:id" element={<BlogUpload />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="wallet" element={<AdminWallet />} />
            <Route path="user-wallets" element={<AdminUserWallets />} />
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
            <Route path="wallet/:transactionId" element={<VendorTransactionDetails />} />
            <Route path="messages" element={<VendorMessages />} />
            <Route path="settings" element={<VendorSettings />} />
          </Route>
          
          {/* User Routes */}
          <Route path="/user" element={<SidebarProvider><UserAffiliateLayout /></SidebarProvider>}>
            <Route index element={<UserDashboard />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="orders/:orderId" element={<UserOrderDetails />} />
            <Route path="wishlist" element={<UserWishlist />} />
            <Route path="transactions" element={<UserTransactions />} />
            <Route path="transactions/:transactionId" element={<UserTransactionDetails />} />
            <Route path="wallet" element={<UserWallet />} />
            <Route path="messages" element={<UserMessages />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          
          {/* Affiliate Routes */}
          <Route path="/affiliate" element={<SidebarProvider><UserAffiliateLayout /></SidebarProvider>}>
            <Route index element={<AffiliateDashboard />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="orders/:orderId" element={<UserOrderDetails />} />
            <Route path="wishlist" element={<UserWishlist />} />
            <Route path="transactions" element={<UserTransactions />} />
            <Route path="transactions/:transactionId" element={<UserTransactionDetails />} />
            <Route path="wallet" element={<UserWallet />} />
            <Route path="earnings" element={<AffiliateEarnings />} />
            <Route path="messages" element={<AffiliateMessages />} />
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