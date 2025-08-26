import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  Plus
} from "lucide-react";

const VendorRevenue = () => {
  const revenueStats = [
    {
      title: "Total Revenue",
      value: "$12,450.67",
      change: "+15%",
      period: "This month",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Pending Payouts",
      value: "$2,340.25",
      change: "3 orders",
      period: "Awaiting processing",
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Total Payouts",
      value: "$45,678.90",
      change: "+23%",
      period: "All time",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Platform Fees",
      value: "$1,245.56",
      change: "5% of sales",
      period: "This month",
      icon: CreditCard,
      color: "text-muted-foreground"
    }
  ];

  const payoutHistory = [
    {
      id: "PO-001",
      date: "2024-03-15",
      amount: "$1,234.56",
      status: "Completed",
      method: "Bank Transfer",
      orders: 45
    },
    {
      id: "PO-002",
      date: "2024-03-01",
      amount: "$2,567.89",
      status: "Completed",
      method: "PayPal",
      orders: 67
    },
    {
      id: "PO-003",
      date: "2024-02-15",
      amount: "$1,890.23",
      status: "Completed",
      method: "Bank Transfer",
      orders: 34
    },
    {
      id: "PO-004",
      date: "2024-02-01",
      amount: "$3,456.78",
      status: "Processing",
      method: "Bank Transfer",
      orders: 89
    },
  ];

  const salesBreakdown = [
    { product: "Wireless Headphones", revenue: "$4,567.89", orders: 156, percentage: 37 },
    { product: "Smart Watch", revenue: "$3,234.56", orders: 89, percentage: 26 },
    { product: "Phone Case", revenue: "$2,890.12", orders: 234, percentage: 23 },
    { product: "Laptop Stand", revenue: "$1,758.10", orders: 67, percentage: 14 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'Processing': return 'bg-warning text-warning-foreground';
      case 'Pending': return 'bg-secondary text-secondary-foreground';
      case 'Failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Revenue & Payouts</h1>
        <p className="text-muted-foreground">
          Track your earnings, payouts, and financial performance.
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {revenueStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.change.includes('+') && <TrendingUp className="h-3 w-3 text-success" />}
                <span className={`text-xs font-medium ${stat.change.includes('+') ? 'text-success' : 'text-muted-foreground'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payout History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payout History
                </CardTitle>
                <CardDescription>Your recent payouts and transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{payout.id}</p>
                    <Badge className={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{payout.method}</p>
                  <p className="text-xs text-muted-foreground">{payout.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{payout.amount}</p>
                  <p className="text-xs text-muted-foreground">{payout.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue by Product */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue by Product
            </CardTitle>
            <CardDescription>Top performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{item.product}</p>
                  <p className="font-semibold text-success">{item.revenue}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.orders} orders</span>
                  <span>{item.percentage}% of total</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods & Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Configure your payout preferences and payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-3">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">Primary</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <span className="text-secondary-foreground font-bold text-sm">PP</span>
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">vendor@example.com</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Payout Schedule</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border bg-card">
                  <p className="font-medium">Weekly Payouts</p>
                  <p className="text-sm text-muted-foreground">Every Friday</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next payout: March 22, 2024
                  </p>
                </div>
                
                <div className="p-3 rounded-lg border bg-muted">
                  <p className="font-medium">Minimum Payout</p>
                  <p className="text-sm text-muted-foreground">$100.00</p>
                </div>
                
                <div className="p-3 rounded-lg border bg-muted">
                  <p className="font-medium">Processing Time</p>
                  <p className="text-sm text-muted-foreground">2-3 business days</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3">
                <Calendar className="h-4 w-4 mr-2" />
                Change Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRevenue;