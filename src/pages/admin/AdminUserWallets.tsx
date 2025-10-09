import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Wallet,
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Edit,
  Eye,
} from "lucide-react";

// Mock data
const walletStats = [
  {
    title: "Total Wallets",
    value: "2,847",
    trend: "+12.5%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Wallets",
    value: "2,654",
    trend: "+8.2%",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Total Balance",
    value: "$1,247,650",
    trend: "+15.3%",
    icon: DollarSign,
    color: "text-primary",
  },
  {
    title: "Pending Issues",
    value: "23",
    trend: "-5.2%",
    icon: Clock,
    color: "text-orange-600",
  },
];

const mockWallets = [
  {
    id: "1",
    walletId: "WLT-2024-00001",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    userId: "USR-001",
    userName: "John Doe",
    userEmail: "john@example.com",
    balance: 15420.50,
    status: "active",
    createdAt: "2024-01-15",
    lastTransaction: "2024-03-10",
  },
  {
    id: "2",
    walletId: "WLT-2024-00002",
    walletAddress: "0x8c3d5Aa3245B9e8521ef8d45C0231fEd432cEa1",
    userId: "USR-002",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    balance: 8750.25,
    status: "active",
    createdAt: "2024-01-20",
    lastTransaction: "2024-03-12",
  },
  {
    id: "3",
    walletId: "WLT-2024-00003",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0",
    userId: "USR-003",
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    balance: 450.00,
    status: "frozen",
    createdAt: "2024-02-01",
    lastTransaction: "2024-03-05",
  },
  {
    id: "4",
    walletId: "WLT-2024-00004",
    walletAddress: "0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0",
    userId: "USR-004",
    userName: "Alice Williams",
    userEmail: "alice@example.com",
    balance: 23890.75,
    status: "active",
    createdAt: "2024-02-10",
    lastTransaction: "2024-03-13",
  },
];

const mockTransactions = [
  {
    id: "TXN-001",
    type: "deposit",
    amount: 500.00,
    date: "2024-03-13 14:30",
    status: "completed",
    reference: "DEP-2024-001",
  },
  {
    id: "TXN-002",
    type: "withdrawal",
    amount: -250.00,
    date: "2024-03-12 10:15",
    status: "completed",
    reference: "WDR-2024-045",
  },
  {
    id: "TXN-003",
    type: "payment",
    amount: -89.99,
    date: "2024-03-11 16:45",
    status: "completed",
    reference: "PAY-2024-332",
  },
  {
    id: "TXN-004",
    type: "deposit",
    amount: 1200.00,
    date: "2024-03-10 09:20",
    status: "completed",
    reference: "DEP-2024-002",
  },
  {
    id: "TXN-005",
    type: "withdrawal",
    amount: -500.00,
    date: "2024-03-09 11:30",
    status: "pending",
    reference: "WDR-2024-046",
  },
];

const AdminUserWallets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<typeof mockWallets[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdjustBalanceOpen, setIsAdjustBalanceOpen] = useState(false);
  const [isResolveIssueOpen, setIsResolveIssueOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [transactionFilter, setTransactionFilter] = useState<string>("all");

  const filteredWallets = mockWallets.filter(wallet => {
    const matchesSearch = 
      wallet.walletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || wallet.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = mockTransactions.filter(txn => 
    transactionFilter === "all" || txn.type === transactionFilter
  );

  const handleViewDetails = (wallet: typeof mockWallets[0]) => {
    setSelectedWallet(wallet);
    setIsDetailsOpen(true);
  };

  const handleAdjustBalance = (wallet: typeof mockWallets[0]) => {
    setSelectedWallet(wallet);
    setIsAdjustBalanceOpen(true);
  };

  const handleResolveIssue = (wallet: typeof mockWallets[0]) => {
    setSelectedWallet(wallet);
    setIsResolveIssueOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      active: { variant: "default", icon: CheckCircle },
      frozen: { variant: "destructive", icon: Lock },
      suspended: { variant: "secondary", icon: AlertCircle },
    };
    
    const config = variants[status] || variants.active;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTransactionBadge = (type: string) => {
    const config: Record<string, { className: string, icon: any }> = {
      deposit: { className: "bg-green-500/10 text-green-600 border-green-200", icon: TrendingUp },
      withdrawal: { className: "bg-orange-500/10 text-orange-600 border-orange-200", icon: ArrowUpDown },
      payment: { className: "bg-blue-500/10 text-blue-600 border-blue-200", icon: DollarSign },
    };
    
    const { className, icon: Icon } = config[type] || config.payment;
    
    return (
      <Badge variant="outline" className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Wallets Management</h1>
          <p className="text-muted-foreground">Monitor and manage all user wallet accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {walletStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.trend}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Accounts</CardTitle>
          <CardDescription>Search and manage user wallet accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Wallet ID, Address, User Name or Email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Wallets Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet ID</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell className="font-medium">{wallet.walletId}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {wallet.walletAddress.slice(0, 8)}...{wallet.walletAddress.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{wallet.userName}</div>
                        <div className="text-sm text-muted-foreground">{wallet.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(wallet.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{wallet.lastTransaction}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(wallet)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdjustBalance(wallet)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveIssue(wallet)}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Wallet Details</DialogTitle>
            <DialogDescription>
              View complete wallet information and transaction history
            </DialogDescription>
          </DialogHeader>
          
          {selectedWallet && (
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Wallet ID</Label>
                  <p className="font-semibold">{selectedWallet.walletId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-semibold">{selectedWallet.userId}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Wallet Address</Label>
                  <p className="font-mono text-sm break-all">{selectedWallet.walletAddress}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User Name</Label>
                  <p className="font-semibold">{selectedWallet.userName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-semibold">{selectedWallet.userEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Balance</Label>
                  <p className="text-2xl font-bold text-primary">
                    ${selectedWallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedWallet.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="font-semibold">{selectedWallet.createdAt}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Transaction</Label>
                  <p className="font-semibold">{selectedWallet.lastTransaction}</p>
                </div>
              </div>

              {/* Transaction History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Transaction History</h3>
                  <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="payment">Payments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono text-xs">{txn.reference}</TableCell>
                          <TableCell>{getTransactionBadge(txn.type)}</TableCell>
                          <TableCell className={`font-semibold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {txn.amount >= 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm">{txn.date}</TableCell>
                          <TableCell>
                            <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'}>
                              {txn.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button 
                  variant={selectedWallet.status === 'active' ? 'destructive' : 'default'}
                  className="gap-2"
                >
                  {selectedWallet.status === 'active' ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Freeze Wallet
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      Unfreeze Wallet
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsDetailsOpen(false);
                  handleAdjustBalance(selectedWallet);
                }}>
                  Adjust Balance
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={isAdjustBalanceOpen} onOpenChange={setIsAdjustBalanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
            <DialogDescription>
              Manually adjust the balance for wallet {selectedWallet?.walletId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Current Balance</Label>
              <p className="text-2xl font-bold text-primary">
                ${selectedWallet?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adjustment-type">Adjustment Type</Label>
              <Select>
                <SelectTrigger id="adjustment-type">
                  <SelectValue placeholder="Select adjustment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Funds</SelectItem>
                  <SelectItem value="deduct">Deduct Funds</SelectItem>
                  <SelectItem value="set">Set Balance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Adjustment</Label>
              <Textarea
                id="reason"
                placeholder="Explain why you're adjusting this balance..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustBalanceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAdjustBalanceOpen(false)}>
              Apply Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Issue Dialog */}
      <Dialog open={isResolveIssueOpen} onOpenChange={setIsResolveIssueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Wallet Issue</DialogTitle>
            <DialogDescription>
              Document and resolve issues for wallet {selectedWallet?.walletId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <Select>
                <SelectTrigger id="issue-type">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transaction-failed">Failed Transaction</SelectItem>
                  <SelectItem value="incorrect-balance">Incorrect Balance</SelectItem>
                  <SelectItem value="unauthorized-access">Unauthorized Access</SelectItem>
                  <SelectItem value="duplicate-charge">Duplicate Charge</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-description">Issue Description</Label>
              <Textarea
                id="issue-description"
                placeholder="Describe the issue in detail..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Action</Label>
              <Textarea
                id="resolution"
                placeholder="Describe what action was taken to resolve..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution-status">Resolution Status</Label>
              <Select>
                <SelectTrigger id="resolution-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveIssueOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsResolveIssueOpen(false)}>
              Save Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserWallets;
