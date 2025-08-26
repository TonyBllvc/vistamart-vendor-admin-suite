import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Plus,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const ProductManagement = () => {
  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-001",
      price: "$89.99",
      stock: 45,
      status: "Active",
      category: "Electronics",
      sales: 156,
      views: 1234,
      rating: 4.8,
      image: "📱"
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      sku: "SFW-002",
      price: "$199.99",
      stock: 23,
      status: "Active",
      category: "Electronics",
      sales: 89,
      views: 856,
      rating: 4.6,
      image: "⌚"
    },
    {
      id: 3,
      name: "Premium Phone Case",
      sku: "PPC-003",
      price: "$24.99",
      stock: 0,
      status: "Out of Stock",
      category: "Electronics",
      sales: 234,
      views: 567,
      rating: 4.9,
      image: "📱"
    },
    {
      id: 4,
      name: "Laptop Stand Adjustable",
      sku: "LSA-004",
      price: "$45.99",
      stock: 12,
      status: "Low Stock",
      category: "Electronics",
      sales: 67,
      views: 432,
      rating: 4.7,
      image: "💻"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'Out of Stock': return 'bg-destructive text-destructive-foreground';
      case 'Low Stock': return 'bg-warning text-warning-foreground';
      case 'Draft': return 'bg-muted text-muted-foreground';
      case 'Inactive': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStockAlert = (stock: number) => {
    if (stock === 0) return { color: 'text-destructive', message: 'Out of stock' };
    if (stock < 10) return { color: 'text-warning', message: 'Low stock' };
    return { color: 'text-success', message: 'In stock' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
        <p className="text-muted-foreground">
          Manage all your products, inventory, and listings.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">546</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground">Restock needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your product catalog and inventory</CardDescription>
            </div>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
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
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-8 text-center">
                  <div>
                    <p className="text-sm font-medium">{product.price}</p>
                    <p className="text-xs text-muted-foreground">Price</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${getStockAlert(product.stock).color}`}>
                      {product.stock}
                    </p>
                    <p className="text-xs text-muted-foreground">Stock</p>
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
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>Perform actions on multiple products at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">Update Prices</Button>
            <Button variant="outline">Update Stock</Button>
            <Button variant="outline">Export Products</Button>
            <Button variant="outline">Import Products</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;