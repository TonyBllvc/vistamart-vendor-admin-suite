import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package,
  Activity,
  Eye
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const platformStats = [
  {
    title: "Total Revenue",
    value: "$125,430",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Total platform revenue this month"
  },
  {
    title: "Active Users",
    value: "2,847",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active users in the last 30 days"
  },
  {
    title: "Total Orders",
    value: "1,429",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: ShoppingBag,
    description: "Orders placed this month"
  },
  {
    title: "Total Products",
    value: "5,678",
    change: "+3.1%",
    changeType: "positive" as const,
    icon: Package,
    description: "Products listed on platform"
  },
];

const revenueData = [
  { month: 'Jan', revenue: 85000, orders: 1200 },
  { month: 'Feb', revenue: 92000, orders: 1350 },
  { month: 'Mar', revenue: 88000, orders: 1280 },
  { month: 'Apr', revenue: 105000, orders: 1520 },
  { month: 'May', revenue: 115000, orders: 1680 },
  { month: 'Jun', revenue: 125430, orders: 1825 },
];

const trafficSources = [
  { name: 'Direct', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Search', value: 28, color: 'hsl(var(--accent))' },
  { name: 'Social', value: 22, color: 'hsl(var(--secondary))' },
  { name: 'Referral', value: 15, color: 'hsl(var(--muted))' },
];

const topCategories = [
  { name: 'Electronics', orders: 456, revenue: 45600 },
  { name: 'Fashion', orders: 398, revenue: 38920 },
  { name: 'Home & Garden', orders: 267, revenue: 26780 },
  { name: 'Sports', orders: 189, revenue: 18900 },
  { name: 'Books', orders: 119, revenue: 11950 },
];

const topVendors = [
  { name: 'TechHub Store', orders: 234, revenue: 23400, rating: 4.8 },
  { name: 'Fashion Central', orders: 198, revenue: 19800, rating: 4.7 },
  { name: 'Home Essentials', orders: 156, revenue: 15600, rating: 4.9 },
  { name: 'Sports World', orders: 143, revenue: 14300, rating: 4.6 },
  { name: 'Book Haven', orders: 98, revenue: 9800, rating: 4.8 },
];

const AdminAnalytics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Monitor platform performance and key metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <Badge 
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                {' '}{stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Monthly revenue and order trends
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Traffic Sources
            </CardTitle>
            <CardDescription>
              Where your users come from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Categories */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Categories
            </CardTitle>
            <CardDescription>
              Best performing product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Top Performing Vendors
            </CardTitle>
            <CardDescription>
              Vendors by revenue and orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVendors.map((vendor, index) => (
                <div key={vendor.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.orders} orders • Rating: {vendor.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${vendor.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;