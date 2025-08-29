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
import BrandCategories from "./pages/admin/BrandCategories";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminWallet from "./pages/admin/AdminWallet";
import AdminMessages from "./pages/admin/AdminMessages";
import ProductUpload from "./pages/vendor/ProductUpload";
import ProductManagement from "./pages/vendor/ProductManagement";
import VendorRevenue from "./pages/vendor/VendorRevenue";
import VendorSettings from "./pages/vendor/VendorSettings";
import VendorWallet from "./pages/vendor/VendorWallet";
import VendorMessages from "./pages/vendor/VendorMessages";
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
            <Route path="brands-categories" element={<BrandCategories />} />
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
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;