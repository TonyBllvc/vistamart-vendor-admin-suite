import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Info, ArrowUpRight } from "lucide-react";

// Mock data — replace with API call to GET /vendor/subscription/
const MOCK_ACTIVE = {
  package_name: "Growth Plan",
  status: "active" as "active" | "grace",
  expiry_date: "2027-04-21",
  days_total: 365,
  days_remaining: 142,
  products_used: 12,
  products_limit: 50,
  boost_level: 7,
  boost_max: 10,
  boost_active: true,
  grace_end_date: null as string | null,
  reference: "SUB-20260421142301-K9PXR7",
  system_message: null as string | null,
  flag_message: null as string | null,
};

const MOCK_HISTORY = [
  {
    id: "1",
    package_name: "Growth Plan",
    amount: 4500,
    status: "active",
    start_date: "2026-04-21",
    expiry_date: "2027-04-21",
    reference: "SUB-20260421142301-K9PXR7",
  },
  {
    id: "2",
    package_name: "Starter Plan",
    amount: 1500,
    status: "expired",
    start_date: "2025-04-21",
    expiry_date: "2026-04-21",
    reference: "SUB-20250421100000-A2BCDE",
  },
  {
    id: "3",
    package_name: "Pro Plan",
    amount: 9000,
    status: "refunded",
    start_date: "2025-01-10",
    expiry_date: "2025-04-10",
    reference: "SUB-20250110090000-X7YHJK",
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatNGN = (amount: number) =>
  `NGN ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const historyStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-600 hover:bg-green-600 text-white">Active</Badge>;
    case "expired":
      return <Badge variant="secondary">Expired</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">Pending Payment</Badge>;
    case "refunded":
      return <Badge className="bg-blue-600 hover:bg-blue-600 text-white">Refunded</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function VendorSubscription() {
  const active = MOCK_ACTIVE;
  const history = MOCK_HISTORY;
  const error = false;

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>
            Unable to load your subscription. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const daysPct = active ? (active.days_remaining / active.days_total) * 100 : 0;
  const productsPct = active ? (active.products_used / active.products_limit) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Subscription</h1>
        <p className="text-sm text-muted-foreground">
          View your current plan and subscription history.
        </p>
      </div>

      {active ? (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {active.package_name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expires: {formatDate(active.expiry_date)}
                  </p>
                </div>
                {active.status === "active" ? (
                  <Badge className="bg-green-600 hover:bg-green-600 text-white">Active</Badge>
                ) : (
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white">
                    In Grace Period
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Progress value={daysPct} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {active.days_remaining} of {active.days_total} days remaining
                </p>
              </div>

              <div>
                <Progress value={productsPct} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {active.products_used} of {active.products_limit} products used
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-foreground">
                  Visibility Boost: Level {active.boost_level} / {active.boost_max}
                </span>
                {active.boost_active ? (
                  <Badge className="bg-green-600 hover:bg-green-600 text-white">
                    Boost Active
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white">
                    Boost Expired
                  </Badge>
                )}
              </div>

              {active.status === "grace" && active.grace_end_date && (
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Grace period ends: {formatDate(active.grace_end_date)}
                </p>
              )}

              {active.system_message && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300">
                    {active.system_message}
                  </AlertDescription>
                </Alert>
              )}

              {active.flag_message && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{active.flag_message}</AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground pt-2 border-t">
                Ref: {active.reference}
              </p>
            </CardContent>
          </Card>

          <div>
            <Button asChild>
              <Link to="/vendor/packages">
                <ArrowUpRight className="h-4 w-4" />
                Upgrade Plan
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-900">
          <AlertTriangle className="h-4 w-4 text-yellow-700 dark:text-yellow-500" />
          <AlertDescription className="text-yellow-900 dark:text-yellow-200 flex items-center justify-between gap-4 flex-wrap">
            <span>
              You don't have an active subscription. You cannot list products
              until you purchase a plan.
            </span>
            <Button asChild size="sm">
              <Link to="/vendor/packages">Browse Plans</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">
            Subscription History
          </h3>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No previous subscriptions.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.package_name}</TableCell>
                    <TableCell>{formatNGN(row.amount)}</TableCell>
                    <TableCell>{historyStatusBadge(row.status)}</TableCell>
                    <TableCell>{formatDate(row.start_date)}</TableCell>
                    <TableCell>{formatDate(row.expiry_date)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.reference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
