import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, TrendingUp, Eye, ShoppingCart, Package, Heart, Wallet } from "lucide-react";

const AffiliateDashboard = () => {
  const stats = [
    { label: "Total Earnings", value: "$2,845.50", icon: DollarSign, color: "text-affiliate-primary", change: "+12.5%" },
    { label: "Active Referrals", value: "147", icon: Users, color: "text-blue-600", change: "+5.2%" },
    { label: "Conversion Rate", value: "3.8%", icon: TrendingUp, color: "text-green-600", change: "+0.3%" },
    { label: "Link Clicks", value: "1,250", icon: Eye, color: "text-purple-600", change: "+18.7%" },
  ];

  const userStats = [
    { label: "Wallet Balance", value: "$125.50", icon: Wallet, color: "text-affiliate-primary" },
    { label: "Total Orders", value: "23", icon: Package, color: "text-blue-600" },
    { label: "Wishlist Items", value: "8", icon: Heart, color: "text-red-500" },
    { label: "Cart Items", value: "3", icon: ShoppingCart, color: "text-amber-600" },
  ];

  const recentCommissions = [
    { date: "2024-01-15", customer: "John D.", product: "Wireless Headphones", commission: "$8.99" },
    { date: "2024-01-14", customer: "Sarah M.", product: "Smart Watch", commission: "$19.99" },
    { date: "2024-01-13", customer: "Mike R.", product: "Phone Case", commission: "$2.99" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your affiliate business and personal shopping</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Generate Links
          </Button>
          <Button className="bg-affiliate-primary hover:bg-affiliate-primary/90">
            View Reports
          </Button>
        </div>
      </div>

      {/* Affiliate Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Affiliate Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* User Shopping Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Shopping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStats.map((stat, index) => (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Commissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-affiliate-primary" />
              Recent Commissions
            </CardTitle>
            <CardDescription>Your latest earnings from referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCommissions.map((commission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-affiliate-primary/5 to-affiliate-secondary/5 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{commission.product}</p>
                    <p className="text-sm text-gray-500">{commission.customer} • {commission.date}</p>
                  </div>
                  <Badge className="bg-affiliate-primary hover:bg-affiliate-primary/90">
                    {commission.commission}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Commissions
            </Button>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-affiliate-primary" />
              Performance Overview
            </CardTitle>
            <CardDescription>This month's progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Goal</span>
                  <span className="text-sm text-gray-600">$2,845 / $3,000</span>
                </div>
                <Progress value={95} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">$155 to reach monthly goal</p>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-affiliate-primary/10 to-affiliate-secondary/10 rounded-lg">
                <h3 className="font-medium text-affiliate-primary">Gold Affiliate</h3>
                <p className="text-sm text-gray-600">15% commission rate on all sales</p>
              </div>

              <Button className="w-full bg-affiliate-secondary hover:bg-affiliate-secondary/90">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateDashboard;