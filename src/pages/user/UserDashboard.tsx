import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Package, Heart, Wallet, Star, TrendingUp } from "lucide-react";

const UserDashboard = () => {
  const stats = [
    { label: "Wallet Balance", value: "$125.50", icon: Wallet, color: "text-affiliate-primary" },
    { label: "Total Orders", value: "23", icon: Package, color: "text-blue-600" },
    { label: "Wishlist Items", value: "8", icon: Heart, color: "text-red-500" },
    { label: "Cart Items", value: "3", icon: ShoppingCart, color: "text-amber-600" },
  ];

  const recentOrders = [
    { id: "#12345", product: "Wireless Headphones", status: "Delivered", amount: "$89.99" },
    { id: "#12344", product: "Smart Watch", status: "Shipped", amount: "$199.99" },
    { id: "#12343", product: "Phone Case", status: "Processing", amount: "$29.99" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your account overview.</p>
        </div>
        <Button className="bg-affiliate-primary hover:bg-affiliate-primary/90">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.product}</p>
                    <p className="text-sm text-gray-500">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <Badge 
                      variant={order.status === 'Delivered' ? 'default' : 
                              order.status === 'Shipped' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Account Status
            </CardTitle>
            <CardDescription>Your membership benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Loyalty Points</span>
                  <span className="text-sm text-gray-600">850 / 1000</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">150 points to next reward level</p>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-affiliate-primary/10 to-affiliate-secondary/10 rounded-lg">
                <h3 className="font-medium text-affiliate-primary">Silver Member</h3>
                <p className="text-sm text-gray-600">Enjoy 5% cashback on all purchases</p>
              </div>

              <Button className="w-full bg-affiliate-secondary hover:bg-affiliate-secondary/90">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade to Gold
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;