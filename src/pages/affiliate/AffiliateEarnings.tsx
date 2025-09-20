import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Users, Eye, ArrowUpRight, Calendar } from "lucide-react";

const AffiliateEarnings = () => {
  const monthlyGoal = 3000;
  const currentEarnings = 2845.50;
  const progressPercentage = (currentEarnings / monthlyGoal) * 100;

  const earningsData = [
    { month: "January", earnings: 2845.50, commissions: 47, status: "current" },
    { month: "December", earnings: 3250.75, commissions: 52, status: "completed" },
    { month: "November", earnings: 2890.25, commissions: 43, status: "completed" },
    { month: "October", earnings: 3100.00, commissions: 48, status: "completed" },
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: 23, commission: "$345.50" },
    { name: "Smart Watch", sales: 18, commission: "$567.90" },
    { name: "Gaming Keyboard", sales: 15, commission: "$234.75" },
    { name: "Phone Case", sales: 12, commission: "$89.99" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-gray-600 mt-1">Track your affiliate commission performance</p>
        </div>
        <Button className="bg-affiliate-primary hover:bg-affiliate-primary/90">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-affiliate-primary">${currentEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-affiliate-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Goal</p>
                <p className="text-2xl font-bold text-gray-900">${monthlyGoal}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                <p className="text-2xl font-bold text-gray-900">15%</p>
              </div>
              <Badge className="bg-affiliate-secondary text-black">Gold</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Referrals</p>
                <p className="text-2xl font-bold text-gray-900">147</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">January Goal Progress</span>
                  <span className="text-sm text-gray-600">
                    ${currentEarnings.toFixed(2)} / ${monthlyGoal}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-sm text-gray-600 mt-1">
                  ${(monthlyGoal - currentEarnings).toFixed(2)} to reach goal
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-affiliate-primary/10 to-affiliate-secondary/10 rounded-lg">
                <h3 className="font-semibold text-affiliate-primary">Achievement Unlocked!</h3>
                <p className="text-sm text-gray-600">You're 95% towards your monthly goal</p>
              </div>

              <Button className="w-full bg-affiliate-secondary hover:bg-affiliate-secondary/90 text-black">
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Earnings History */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningsData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{data.month}</p>
                    <p className="text-sm text-gray-600">{data.commissions} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-affiliate-primary">${data.earnings.toFixed(2)}</p>
                    <Badge 
                      variant={data.status === 'current' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {data.status === 'current' ? 'Current' : 'Paid'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((product, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-affiliate-primary">{product.commission}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales this month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateEarnings;