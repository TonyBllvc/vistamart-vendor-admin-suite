import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Download, Search, Filter } from "lucide-react";

const UserTransactions = () => {
  const transactions = [
    {
      id: "TXN001",
      date: "2024-01-15",
      type: "Purchase",
      description: "Order #12345 - Wireless Headphones",
      amount: -89.99,
      status: "Completed",
      method: "Credit Card"
    },
    {
      id: "TXN002",
      date: "2024-01-14",
      type: "Refund",
      description: "Refund for Order #12340",
      amount: 29.99,
      status: "Completed",
      method: "Credit Card"
    },
    {
      id: "TXN003",
      date: "2024-01-12",
      type: "Purchase",
      description: "Order #12344 - Smart Watch",
      amount: -199.99,
      status: "Completed",
      method: "PayPal"
    },
    {
      id: "TXN004",
      date: "2024-01-10",
      type: "Wallet Top-up",
      description: "Wallet credit added",
      amount: 100.00,
      status: "Completed",
      method: "Bank Transfer"
    },
    {
      id: "TXN005",
      date: "2024-01-08",
      type: "Purchase",
      description: "Order #12343 - Phone Case",
      amount: -29.99,
      status: "Pending",
      method: "Wallet"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Purchase': return 'text-red-600';
      case 'Refund': return 'text-green-600';
      case 'Wallet Top-up': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View all your payment transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search transactions..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="wallet">Wallet Top-up</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 3 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-affiliate-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-affiliate-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">{transaction.id}</span>
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.method}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className={`text-xl font-bold ${getTypeColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.type}</p>
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserTransactions;