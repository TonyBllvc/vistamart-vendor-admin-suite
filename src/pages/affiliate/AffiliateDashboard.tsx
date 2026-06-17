import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Link2,
  CheckCircle2,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Copy,
  RefreshCw,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const AFFILIATE_CODE = "AFF-JD-X9KP2R";

const ngn = (n: number) =>
  `NGN ${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type LinkRow = {
  id: string;
  product: string;
  thumbnail: string;
  code: string;
  clicks: number;
  conversions: number;
  revenue: number;
  lastActivity: string;
};

const mockLinks: LinkRow[] = [
  { id: "1", product: "Wireless Noise-Cancel Headphones", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop", code: "AFF-JD-H9P2", clicks: 1284, conversions: 87, revenue: 612500, lastActivity: "2 hours ago" },
  { id: "2", product: "Smart Fitness Watch Pro", thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop", code: "AFF-JD-W4K1", clicks: 942, conversions: 54, revenue: 388200, lastActivity: "5 hours ago" },
  { id: "3", product: "Portable Bluetooth Speaker", thumbnail: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop", code: "AFF-JD-S7M3", clicks: 718, conversions: 41, revenue: 184500, lastActivity: "1 day ago" },
  { id: "4", product: "Ergonomic Office Chair", thumbnail: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=80&h=80&fit=crop", code: "AFF-JD-C2Q8", clicks: 533, conversions: 28, revenue: 252000, lastActivity: "2 days ago" },
  { id: "5", product: "Mechanical Gaming Keyboard", thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop", code: "AFF-JD-K5R6", clicks: 491, conversions: 22, revenue: 158400, lastActivity: "3 days ago" },
  { id: "6", product: "4K Action Camera", thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80&h=80&fit=crop", code: "AFF-JD-A9V0", clicks: 312, conversions: 14, revenue: 98000, lastActivity: "4 days ago" },
];

const Stat = ({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: string;
  icon: any;
  tint: string;
}) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tint}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const CopyChip = ({ code }: { code: string }) => (
  <button
    onClick={() => {
      navigator.clipboard.writeText(code);
      toast.success("Code copied");
    }}
    className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs hover:bg-muted"
  >
    {code}
    <Copy className="h-3 w-3" />
  </button>
);

const AffiliateDashboard = () => {
  const [loading] = useState(false);
  const [error] = useState(false);
  const links = mockLinks;

  const totalLinks = links.length;
  const activeLinks = links.filter((l) => l.clicks > 0).length;
  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = links.reduce((s, l) => s + l.conversions, 0);
  const totalRevenue = links.reduce((s, l) => s + l.revenue, 0);
  const convRate = totalClicks ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0.00";

  const topProducts = [...links].sort((a, b) => b.conversions - a.conversions).slice(0, 5);
  const recent = [...links].slice(0, 10);

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Unable to load dashboard data. Please refresh the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (totalLinks === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Link2 className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">No referral links yet</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Set up your affiliate links to start earning. Create your first referral link to get started.
              </p>
            </div>
            <Link to="/affiliate/referrals">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create First Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Affiliate Dashboard</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your code:</span>
            <Badge variant="secondary" className="font-mono">
              {AFFILIATE_CODE}
            </Badge>
            <button
              onClick={() => {
                navigator.clipboard.writeText(AFFILIATE_CODE);
                toast.success("Affiliate code copied");
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Copy code"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <Link to="/affiliate/referrals">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Referral Link
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label="Total Links" value={String(totalLinks)} icon={Link2} tint="bg-blue-100 text-blue-700" />
        <Stat label="Active Links" value={String(activeLinks)} icon={CheckCircle2} tint="bg-emerald-100 text-emerald-700" />
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointerClick} tint="bg-violet-100 text-violet-700" />
        <Stat label="Total Conversions" value={totalConversions.toLocaleString()} icon={ShoppingBag} tint="bg-amber-100 text-amber-700" />
        <Stat label="Total Revenue" value={ngn(totalRevenue)} icon={DollarSign} tint="bg-yellow-100 text-yellow-700" />
        <Stat label="Conversion Rate" value={`${convRate}%`} icon={TrendingUp} tint="bg-rose-100 text-rose-700" />
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.product} className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-medium">{p.product}</span>
                    </div>
                  </TableCell>
                  <TableCell><CopyChip code={p.code} /></TableCell>
                  <TableCell className="text-right">{p.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{p.conversions}</TableCell>
                  <TableCell className="text-right font-medium">{ngn(p.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {recent.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.product}</p>
                    <p className="text-xs text-muted-foreground">Last activity: {r.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span><span className="font-medium text-foreground">{r.clicks.toLocaleString()}</span> clicks</span>
                  <span><span className="font-medium text-foreground">{r.conversions}</span> conv.</span>
                  <span className="font-medium text-foreground">{ngn(r.revenue)}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateDashboard;
