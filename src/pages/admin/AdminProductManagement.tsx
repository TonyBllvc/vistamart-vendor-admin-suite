import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Flag,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  BarChart,
  ShoppingCart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const AdminProductManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const pendingProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      vendor: "TechVendor Pro",
      vendorEmail: "contact@techvendor.com",
      vendorPhone: "+1 (555) 123-4567",
      vendorAddress: "123 Tech Street, San Francisco, CA",
      vendorJoined: "2023-06-15",
      vendorRating: 4.8,
      vendorTotalProducts: 42,
      sku: "WBH-001",
      price: "$89.99",
      cost: "$45.00",
      stock: 150,
      category: "Electronics",
      description: "High-quality wireless Bluetooth headphones with noise cancellation, 40-hour battery life, and premium sound quality.",
      specifications: "Bluetooth 5.0, Active Noise Cancellation, 40mm Drivers, 40-hour battery",
      submitted: "2024-01-15",
      status: "Pending Review",
      image: "📱",
      reason: ""
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      vendor: "FitGear Store",
      vendorEmail: "support@fitgear.com",
      vendorPhone: "+1 (555) 987-6543",
      vendorAddress: "456 Fitness Ave, New York, NY",
      vendorJoined: "2023-08-20",
      vendorRating: 4.6,
      vendorTotalProducts: 28,
      sku: "SFW-002",
      price: "$199.99",
      cost: "$110.00",
      stock: 85,
      category: "Electronics",
      description: "Advanced fitness tracking watch with heart rate monitoring, GPS, and water resistance up to 50m.",
      specifications: "1.4\" AMOLED Display, GPS, Heart Rate Monitor, 7-day battery, IP68 Water Resistant",
      submitted: "2024-01-14",
      status: "Pending Review",
      image: "⌚",
      reason: ""
    }
  ];

  const approvedProducts = [
    {
      id: 3,
      name: "Premium Phone Case",
      vendor: "CaseWorld",
      sku: "PPC-003", 
      price: "$24.99",
      category: "Electronics",
      submitted: "2024-01-10",
      approved: "2024-01-12",
      status: "Approved",
      image: "📱",
      sales: 234,
      views: 1567
    },
    {
      id: 4,
      name: "Laptop Stand Adjustable",
      vendor: "OfficeSupply Co",
      sku: "LSA-004",
      price: "$45.99", 
      category: "Electronics",
      submitted: "2024-01-08",
      approved: "2024-01-10",
      status: "Approved",
      image: "💻",
      sales: 67,
      views: 432
    }
  ];

  const rejectedProducts = [
    {
      id: 5,
      name: "Counterfeit Designer Bag",
      vendor: "FastFashion Inc",
      sku: "CDB-005",
      price: "$299.99",
      category: "Fashion",
      submitted: "2024-01-12",
      rejected: "2024-01-13",
      status: "Rejected",
      image: "👜",
      reason: "Suspected counterfeit product"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      case 'Pending Review': return 'bg-warning text-warning-foreground';
      case 'Flagged': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleApprove = (productId: number) => {
    console.log('Approving product:', productId);
  };

  const handleReject = (productId: number) => {
    console.log('Rejecting product:', productId);
  };

  const handleFlag = (productId: number) => {
    console.log('Flagging product:', productId);
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
        <p className="text-muted-foreground">
          Review, approve, and manage all vendor product submissions.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingProducts.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Need investigation</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {/* Pending Products */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Products Awaiting Review</CardTitle>
                  <CardDescription>Review and approve vendor product submissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search pending products..." className="pl-10" />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Vendor: {product.vendor}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku} • Submitted: {product.submitted}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 text-center">
                      <div>
                        <p className="text-sm font-medium">{product.price}</p>
                        <p className="text-xs text-muted-foreground">Price</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.category}</p>
                        <p className="text-xs text-muted-foreground">Category</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleApprove(product.id)}
                        className="text-success hover:text-success"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReject(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Products */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Products</CardTitle>
              <CardDescription>Successfully reviewed and approved products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search approved products..." className="pl-10" />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {approvedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Vendor: {product.vendor}</p>
                        <p className="text-xs text-muted-foreground">Approved: {product.approved}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-sm font-medium">{product.price}</p>
                        <p className="text-xs text-muted-foreground">Price</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.sales}</p>
                        <p className="text-xs text-muted-foreground">Sales</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.views}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleFlag(product.id)}>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag Product
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleReject(product.id)}
                            className="text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove Approval
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Products */}
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Products</CardTitle>
              <CardDescription>Products that didn't meet approval criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search rejected products..." className="pl-10" />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {rejectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Vendor: {product.vendor}</p>
                        <p className="text-xs text-muted-foreground">Rejected: {product.rejected}</p>
                        <p className="text-xs text-destructive font-medium">Reason: {product.reason}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 text-center">
                      <div>
                        <p className="text-sm font-medium">{product.price}</p>
                        <p className="text-xs text-muted-foreground">Price</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.category}</p>
                        <p className="text-xs text-muted-foreground">Category</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information about this product and vendor
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center text-6xl mb-4">
                    {selectedProduct.image}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={getStatusColor(selectedProduct.status)}>
                        {selectedProduct.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">SKU</span>
                      <span className="text-sm font-medium">{selectedProduct.sku}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="text-sm font-medium">{selectedProduct.category}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                    <p className="text-muted-foreground text-sm">{selectedProduct.description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">Retail Price</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{selectedProduct.price}</p>
                    </div>
                    {selectedProduct.cost && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Tag className="h-4 w-4" />
                          <span className="text-xs">Cost Price</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedProduct.cost}</p>
                      </div>
                    )}
                    {selectedProduct.stock && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span className="text-xs">Stock</span>
                        </div>
                        <p className="text-lg font-semibold">{selectedProduct.stock} units</p>
                      </div>
                    )}
                    {selectedProduct.sales && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ShoppingCart className="h-4 w-4" />
                          <span className="text-xs">Total Sales</span>
                        </div>
                        <p className="text-lg font-semibold">{selectedProduct.sales}</p>
                      </div>
                    )}
                  </div>

                  {selectedProduct.specifications && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Specifications</h4>
                        <p className="text-sm text-muted-foreground">{selectedProduct.specifications}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Vendor Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Vendor Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6 bg-muted/50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Vendor Name</p>
                        <p className="font-medium">{selectedProduct.vendor}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedProduct.vendorEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedProduct.vendorPhone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedProduct.vendorAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="font-medium">{selectedProduct.vendorJoined}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BarChart className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Performance</p>
                        <p className="font-medium">
                          {selectedProduct.vendorRating} ★ • {selectedProduct.vendorTotalProducts} Products
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                {selectedProduct.status === "Pending Review" && (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleReject(selectedProduct.id);
                        setIsDetailsOpen(false);
                      }}
                      className="text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Product
                    </Button>
                    <Button 
                      onClick={() => {
                        handleApprove(selectedProduct.id);
                        setIsDetailsOpen(false);
                      }}
                      className="bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Product
                    </Button>
                  </>
                )}
                {selectedProduct.status === "Approved" && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleFlag(selectedProduct.id);
                    }}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag Product
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductManagement;