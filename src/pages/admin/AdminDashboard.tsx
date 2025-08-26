import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Package,
  UserCheck,
  AlertCircle,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "Active users this month"
    },
    {
      title: "Total Orders",
      value: "3,429",
      change: "+8%",
      changeType: "positive" as const,
      icon: ShoppingBag,
      description: "Orders this month"
    },
    {
      title: "Revenue",
      value: "$84,320",
      change: "+15%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Total revenue this month"
    },
    {
      title: "Products",
      value: "2,156",
      change: "+23",
      changeType: "positive" as const,
      icon: Package,
      description: "Active products"
    }
  ];

  const recentActivities = [
    { type: "order", message: "New order #ORD-2024-001 received", time: "2 minutes ago", status: "success" },
    { type: "vendor", message: "Tech Store submitted 5 new products", time: "15 minutes ago", status: "info" },
    { type: "user", message: "User Sarah Johnson registered", time: "1 hour ago", status: "success" },
    { type: "issue", message: "Product review flagged for moderation", time: "2 hours ago", status: "warning" },
    { type: "payment", message: "Payment processed for order #ORD-2024-002", time: "3 hours ago", status: "success" }
  ];

  const topVendors = [
    { name: "Tech Store", revenue: "$12,450", orders: 156, rating: 4.8 },
    { name: "Fashion Hub", revenue: "$9,870", orders: 134, rating: 4.7 },
    { name: "Home Decor", revenue: "$8,320", orders: 98, rating: 4.9 },
    { name: "Sports Central", revenue: "$7,650", orders: 87, rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your marketplace today.
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
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest activities across your marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-success' :
                  activity.status === 'warning' ? 'bg-warning' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Top Performing Vendors
            </CardTitle>
            <CardDescription>
              Vendors with highest revenue this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topVendors.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {vendor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{vendor.orders} orders</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span>{vendor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{vendor.revenue}</p>
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;