import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import {
  Package,
  ShoppingCart,
  Wallet,
  Star,
  Eye,
  AlertCircle,
} from "lucide-react";

interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  last30: {
    views: number;
    orders: number;
    daily: { date: string; views: number; orders: number }[];
  };
  topByOrders: {
    id: string;
    name: string;
    orders: number;
    rating: number;
    views: number;
  }[];
  topByRating: {
    id: string;
    name: string;
    rating: number;
    totalRatings: number;
    orders: number;
  }[];
  ratingDistribution: { stars: number; count: number }[];
}

const MOCK: AnalyticsData = {
  totalProducts: 47,
  totalOrders: 1284,
  totalRevenue: 2840000,
  averageRating: 4.6,
  last30: {
    views: 18420,
    orders: 312,
    daily: Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views: Math.floor(400 + Math.random() * 400),
        orders: Math.floor(5 + Math.random() * 20),
      };
    }),
  },
  topByOrders: [
    { id: "p1", name: "Wireless Earbuds Pro", orders: 184, rating: 4.7, views: 3420 },
    { id: "p2", name: "Smart Watch Series 5", orders: 142, rating: 4.5, views: 2890 },
    { id: "p3", name: "Bluetooth Speaker Mini", orders: 121, rating: 4.4, views: 2210 },
    { id: "p4", name: "Phone Charging Stand", orders: 98, rating: 4.3, views: 1840 },
    { id: "p5", name: "USB-C Hub 7-in-1", orders: 87, rating: 4.6, views: 1620 },
  ],
  topByRating: [
    { id: "p6", name: "Premium Leather Wallet", rating: 4.9, totalRatings: 312, orders: 76 },
    { id: "p1", name: "Wireless Earbuds Pro", rating: 4.7, totalRatings: 284, orders: 184 },
    { id: "p7", name: "Ceramic Coffee Mug Set", rating: 4.7, totalRatings: 198, orders: 64 },
    { id: "p5", name: "USB-C Hub 7-in-1", rating: 4.6, totalRatings: 156, orders: 87 },
    { id: "p2", name: "Smart Watch Series 5", rating: 4.5, totalRatings: 240, orders: 142 },
  ],
  ratingDistribution: [
    { stars: 5, count: 620 },
    { stars: 4, count: 412 },
    { stars: 3, count: 184 },
    { stars: 2, count: 62 },
    { stars: 1, count: 28 },
  ],
};

const formatNGN = (n: number) =>
  `NGN ${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const chartConfig = {
  views: { label: "Views", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--secondary))" },
  count: { label: "Ratings", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {sub && <div className="text-sm text-muted-foreground">{sub}</div>}
        </div>
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const VendorAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(MOCK);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Store Analytics</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load analytics. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Store Analytics</h1>
        <p className="text-sm text-muted-foreground">Last updated: just now</p>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !data ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))
        ) : (
          <>
            <StatCard
              icon={Package}
              label="Total Products"
              value={data.totalProducts.toLocaleString()}
              sub="Active listings"
            />
            <StatCard
              icon={ShoppingCart}
              label="Total Orders"
              value={data.totalOrders.toLocaleString()}
              sub="All time"
            />
            <StatCard
              icon={Wallet}
              label="Total Revenue"
              value={<span className="text-xl">{formatNGN(data.totalRevenue)}</span>}
              sub="All time"
            />
            <StatCard
              icon={Star}
              label="Average Store Rating"
              value={
                <span className="flex items-center gap-2">
                  {data.averageRating.toFixed(1)}
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(data.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </span>
                </span>
              }
            />
          </>
        )}
      </div>

      {/* Last 30 days */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Last 30 Days</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {loading || !data ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : (
            <>
              <StatCard
                icon={Eye}
                label="Views"
                value={data.last30.views.toLocaleString()}
              />
              <StatCard
                icon={ShoppingCart}
                label="Orders"
                value={data.last30.orders.toLocaleString()}
              />
            </>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !data ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <LineChart data={data.last30.daily}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-orders)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Top products */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Top Products</h2>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top by Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Total Orders</TableHead>
                      <TableHead className="text-right">Avg Rating</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topByOrders.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <Link
                            to={`/vendor/products/${p.id}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {p.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">{p.orders}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {p.rating.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {p.views.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top by Rating</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Avg Rating</TableHead>
                      <TableHead className="text-right">Total Ratings</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topByRating.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <Link
                            to={`/vendor/products/${p.id}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {p.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {p.rating.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{p.totalRatings}</TableCell>
                        <TableCell className="text-right">{p.orders}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rating breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Rating Breakdown</h2>
        <Card>
          <CardContent className="p-6">
            {loading || !data ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="space-y-3">
                {data.ratingDistribution.map((r) => {
                  const max = Math.max(...data.ratingDistribution.map((x) => x.count));
                  const pct = (r.count / max) * 100;
                  return (
                    <div key={r.stars} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {r.stars}★ — {r.count.toLocaleString()} ratings
                        </span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default VendorAnalytics;
