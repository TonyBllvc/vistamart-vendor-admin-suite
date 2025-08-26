import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp,
  Package,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const VendorDashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+15%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Revenue this month"
    },
    {
      title: "Orders",
      value: "156",
      change: "+8%",
      changeType: "positive" as const,
      icon: ShoppingBag,
      description: "Orders this month"
    },
    {
      title: "Products",
      value: "23",
      change: "+3",
      changeType: "positive" as const,
      icon: Package,
      description: "Active products"
    },
    {
      title: "Profile Views",
      value: "1,234",
      change: "+22%",
      changeType: "positive" as const,
      icon: Eye,
      description: "Store visits this month"
    }
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: "$89.99", status: "completed", product: "Wireless Headphones" },
    { id: "ORD-002", customer: "Sarah Wilson", amount: "$156.50", status: "processing", product: "Smart Watch" },
    { id: "ORD-003", customer: "Mike Johnson", amount: "$78.25", status: "shipped", product: "Phone Case" },
    { id: "ORD-004", customer: "Emily Davis", amount: "$234.00", status: "pending", product: "Laptop Stand" },
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: 45, revenue: "$1,350", rating: 4.8 },
    { name: "Smart Watch", sales: 32, revenue: "$2,240", rating: 4.6 },
    { name: "Phone Case", sales: 28, revenue: "$420", rating: 4.9 },
    { name: "Laptop Stand", sales: 15, revenue: "$675", rating: 4.7 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'shipped': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's how your store is performing today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">{stat.change}</span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>
              Latest orders for your products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{order.id}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.product}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{order.amount}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
            <CardDescription>
              Your best selling products this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{product.sales} sales</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{product.revenue}</p>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your store</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Add New Product</p>
              <p className="text-sm text-muted-foreground">Upload and list a new product</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <div>
              <p className="font-medium">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">3 products need restocking</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors">
            <CheckCircle className="h-8 w-8 text-success" />
            <div>
              <p className="font-medium">Process Orders</p>
              <p className="text-sm text-muted-foreground">5 orders awaiting processing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;