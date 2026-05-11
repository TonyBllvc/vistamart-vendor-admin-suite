import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 100;

const formatNGN = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

// ---------- Mock data generators ----------
const productsData = Array.from({ length: 247 }, (_, i) => ({
  name: `Product ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  store: `Store ${((i % 12) + 1)}`,
  category: ["Electronics", "Fashion", "Home", "Beauty", "Sports"][i % 5],
  brand: ["Acme", "Globex", "Initech", "Umbrella", "Stark"][i % 5],
  status: i % 7 === 0 ? "Inactive" : "Active",
  visibility: i % 5 === 0 ? "Hidden" : "Visible",
  price: 1500 + (i * 137) % 50000,
  rating: (3 + (i % 20) / 10).toFixed(1),
  orders: (i * 3) % 500,
  views: (i * 47) % 10000,
  softDeleted: i % 11 === 0 ? "Yes" : "No",
  date: new Date(2026, 0, 1 + (i % 120)).toLocaleDateString(),
}));

const storesData = Array.from({ length: 87 }, (_, i) => ({
  name: `Store ${i + 1}`,
  reference: `STR-2026042${i % 10}-K${i}PXR7`,
  email: `vendor${i + 1}@example.com`,
  active: i % 6 === 0 ? "No" : "Yes",
  suspended: i % 13 === 0 ? "Yes" : "No",
  products: (i * 5) % 200,
  orders: (i * 12) % 1500,
  revenue: 50000 + (i * 13579) % 5000000,
  rating: (3.5 + (i % 15) / 10).toFixed(1),
  memberSince: new Date(2025, 0, 1 + (i % 300)).toLocaleDateString(),
}));

const ordersData = Array.from({ length: 412 }, (_, i) => ({
  reference: `ORD-${100000 + i}`,
  email: `buyer${i + 1}@example.com`,
  status: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"][i % 5],
  paid: i % 4 === 0 ? "No" : "Yes",
  grandTotal: 2000 + (i * 311) % 80000,
  itemsCount: 1 + (i % 8),
  registered: i % 3 === 0 ? "No" : "Yes",
  date: new Date(2026, 0, 1 + (i % 130)).toLocaleDateString(),
}));

const categoriesData = Array.from({ length: 64 }, (_, i) => ({
  name: `Category ${i + 1}`,
  parent: i % 4 === 0 ? "—" : `Category ${(i % 8) + 1}`,
  status: i % 9 === 0 ? "Inactive" : "Active",
  productCount: (i * 7) % 350,
  specCount: (i % 12) + 1,
}));

// ---------- Section component ----------
type Column<T> = { header: string; cell: (row: T) => React.ReactNode };

function ReportSection<T>({
  title,
  data,
  columns,
  loading,
}: {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading: boolean;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const slice = data.slice(0, visible);
  const total = data.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.success(`${title} export started`)}
        >
          <Download className="h-4 w-4" />
          Export as CSV
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.header} className="whitespace-nowrap">
                    {c.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, ci) => (
                      <TableCell key={ci}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : slice.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground py-12"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                slice.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((c) => (
                      <TableCell key={c.header} className="whitespace-nowrap">
                        {c.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && slice.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing {slice.length} of {total} records.
            </p>
            {visible < total && (
              <Button
                variant="outline"
                onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, total))}
              >
                Load More
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const StatusBadge = ({ value, good = "Active" }: { value: string; good?: string }) => (
  <Badge variant={value === good ? "default" : "secondary"}>{value}</Badge>
);

export default function AdminReports() {
  const [loading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Export raw platform data. 100 records per page.
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ReportSection
            title="Products Report"
            data={productsData}
            loading={loading}
            columns={[
              { header: "Product Name", cell: (r) => r.name },
              { header: "SKU", cell: (r) => r.sku },
              { header: "Store", cell: (r) => r.store },
              { header: "Category", cell: (r) => r.category },
              { header: "Brand", cell: (r) => r.brand },
              { header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
              { header: "Visibility", cell: (r) => <StatusBadge value={r.visibility} good="Visible" /> },
              { header: "Price", cell: (r) => formatNGN(r.price) },
              { header: "Avg Rating", cell: (r) => r.rating },
              { header: "Orders", cell: (r) => r.orders },
              { header: "Views", cell: (r) => r.views },
              { header: "Soft Deleted", cell: (r) => r.softDeleted },
              { header: "Date", cell: (r) => r.date },
            ]}
          />
        </TabsContent>

        <TabsContent value="stores">
          <ReportSection
            title="Stores Report"
            data={storesData}
            loading={loading}
            columns={[
              { header: "Store Name", cell: (r) => r.name },
              { header: "Reference", cell: (r) => <code className="text-xs">{r.reference}</code> },
              { header: "Vendor Email", cell: (r) => r.email },
              { header: "Active", cell: (r) => <StatusBadge value={r.active} good="Yes" /> },
              { header: "Suspended", cell: (r) => <StatusBadge value={r.suspended} good="No" /> },
              { header: "Products", cell: (r) => r.products },
              { header: "Orders", cell: (r) => r.orders },
              { header: "Revenue", cell: (r) => formatNGN(r.revenue) },
              { header: "Avg Rating", cell: (r) => r.rating },
              { header: "Member Since", cell: (r) => r.memberSince },
            ]}
          />
        </TabsContent>

        <TabsContent value="orders">
          <ReportSection
            title="Orders Report"
            data={ordersData}
            loading={loading}
            columns={[
              { header: "Order Reference", cell: (r) => r.reference },
              { header: "Buyer Email", cell: (r) => r.email },
              { header: "Status", cell: (r) => <StatusBadge value={r.status} good="Delivered" /> },
              { header: "Paid", cell: (r) => <StatusBadge value={r.paid} good="Yes" /> },
              { header: "Grand Total", cell: (r) => formatNGN(r.grandTotal) },
              { header: "Items Count", cell: (r) => r.itemsCount },
              { header: "Registered", cell: (r) => r.registered },
              { header: "Date", cell: (r) => r.date },
            ]}
          />
        </TabsContent>

        <TabsContent value="categories">
          <ReportSection
            title="Categories Report"
            data={categoriesData}
            loading={loading}
            columns={[
              { header: "Category Name", cell: (r) => r.name },
              { header: "Parent Category", cell: (r) => r.parent },
              { header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
              { header: "Product Count", cell: (r) => r.productCount },
              { header: "Spec Count", cell: (r) => r.specCount },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
