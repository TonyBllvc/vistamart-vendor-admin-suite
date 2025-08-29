import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  Clock,
  AlertCircle
} from "lucide-react";

const VendorWallet = () => {
  const walletStats = [
    {
      title: "Available Balance",
      value: "$3,240.50",
      change: "+12.5%",
      trend: "up",
      icon: Wallet
    },
    {
      title: "Pending Earnings",
      value: "$1,890.00",
      change: "+8.2%",
      trend: "up",
      icon: Clock
    },
    {
      title: "This Month Earned",
      value: "$5,670.00",
      change: "+23.1%",
      trend: "up",
      icon: TrendingUp
    },
    {
      title: "Total Lifetime",
      value: "$45,230.00",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign
    }
  ];

  const recentTransactions = [
    {
      id: "TXN001",
      type: "Sale Commission",
      description: "iPhone 15 Pro Max Sale",
      amount: "+$156.80",
      status: "completed",
      date: "2 hours ago"
    },
    {
      id: "TXN002",
      type: "Withdrawal",
      description: "Bank Transfer",
      amount: "-$2,500.00",
      status: "processing",
      date: "4 hours ago"
    },
    {
      id: "TXN003",
      type: "Sale Commission",
      description: "MacBook Air Sale",
      amount: "+$289.50",
      status: "completed",
      date: "6 hours ago"
    },
    {
      id: "TXN004",
      type: "Refund",
      description: "Product Return",
      amount: "-$45.00",
      status: "completed",
      date: "1 day ago"
    }
  ];

  const payoutSchedule = [
    {
      period: "Dec 1-15, 2024",
      amount: "$3,240.00",
      status: "pending",
      payoutDate: "Dec 20, 2024"
    },
    {
      period: "Nov 16-30, 2024",
      amount: "$2,890.00",
      status: "paid",
      payoutDate: "Dec 5, 2024"
    },
    {
      period: "Nov 1-15, 2024",
      amount: "$4,120.00",
      status: "paid",
      payoutDate: "Nov 20, 2024"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet & Earnings</h1>
          <p className="text-muted-foreground">Track your earnings and manage payouts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Building2 className="h-4 w-4 mr-2" />
            Bank Details
          </Button>
          <Button>
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Request Withdrawal
          </Button>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {walletStats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payout Progress */}
      <Card className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5 text-secondary" />
            Next Payout Progress
          </CardTitle>
          <CardDescription>
            Payout scheduled for December 20, 2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Period Earnings</span>
              <span className="font-medium text-foreground">$3,240.00 / $5,000.00</span>
            </div>
            <Progress value={65} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Period: Dec 1-15</span>
              <span>5 days remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Your latest earnings and withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "Sale Commission" ? "bg-green-500/10" :
                        transaction.type === "Withdrawal" ? "bg-blue-500/10" : "bg-red-500/10"
                      }`}>
                        {transaction.type === "Sale Commission" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : transaction.type === "Withdrawal" ? (
                          <ArrowDownLeft className="h-4 w-4 text-blue-500" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.amount.startsWith("+") ? "text-green-500" : "text-red-500"
                      }`}>
                        {transaction.amount}
                      </p>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payout Schedule
              </CardTitle>
              <CardDescription>
                Your scheduled and completed payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutSchedule.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{payout.period}</p>
                      <p className="text-sm text-muted-foreground">Payout: {payout.payoutDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{payout.amount}</p>
                      <Badge variant={payout.status === "paid" ? "default" : "secondary"}>
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownLeft className="h-5 w-5" />
                Request Withdrawal
              </CardTitle>
              <CardDescription>
                Withdraw your available balance to your bank account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Available balance: <span className="font-semibold">$3,240.50</span>
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Withdrawal Amount</label>
                <Input type="number" placeholder="Enter amount" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Bank Account</label>
                <Input defaultValue="****-****-****-1234" disabled className="mt-1" />
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1">Request Withdrawal</Button>
                <Button variant="outline">Update Bank Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
                <CardDescription>Update your payout destination</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Account Holder Name</label>
                  <Input defaultValue="John Doe" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Account Number</label>
                  <Input defaultValue="1234567890" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Bank Name</label>
                  <Input defaultValue="First National Bank" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Routing Number</label>
                  <Input defaultValue="123456789" className="mt-1" />
                </div>
                <Button>Update Bank Details</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Preferences</CardTitle>
                <CardDescription>Configure your payout settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Minimum Payout Amount</label>
                  <Input type="number" defaultValue="100" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Payout Frequency</label>
                  <select className="w-full p-2 border border-border rounded-md bg-background">
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                    <option>Manual</option>
                  </select>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorWallet;