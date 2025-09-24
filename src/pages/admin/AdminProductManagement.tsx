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
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminProductManagement = () => {
  const pendingProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      vendor: "TechVendor Pro",
      sku: "WBH-001",
      price: "$89.99",
      category: "Electronics",
      submitted: "2024-01-15",
      status: "Pending Review",
      image: "📱",
      reason: ""
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      vendor: "FitGear Store", 
      sku: "SFW-002",
      price: "$199.99",
      category: "Electronics",
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
                        onClick={() => console.log('View product details')}
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
                      <Button variant="ghost" size="sm">
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
                      <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default AdminProductManagement;