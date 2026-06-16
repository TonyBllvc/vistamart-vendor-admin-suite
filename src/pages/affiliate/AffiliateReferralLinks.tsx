import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Copy,
  Eye,
  Search,
  Link2,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

type Status = "active" | "inactive";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: string;
}

interface ReferralLink {
  id: string;
  product: Product;
  code: string;
  clicks: number;
  orders: number;
  conversions: number;
  revenue: number;
  status: Status;
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Wireless Noise-Cancelling Headphones", slug: "wireless-noise-cancelling-headphones", price: 89500, thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop" },
  { id: "p2", name: "Smart Fitness Watch Pro", slug: "smart-fitness-watch-pro", price: 65000, thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=120&fit=crop" },
  { id: "p3", name: "Ergonomic Office Chair", slug: "ergonomic-office-chair", price: 145000, thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&h=120&fit=crop" },
  { id: "p4", name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker", price: 32500, thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=120&h=120&fit=crop" },
  { id: "p5", name: "4K Action Camera", slug: "4k-action-camera", price: 112000, thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=120&h=120&fit=crop" },
  { id: "p6", name: "Mechanical Gaming Keyboard", slug: "mechanical-gaming-keyboard", price: 48000, thumbnail: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=120&h=120&fit=crop" },
];

const initialLinks: ReferralLink[] = [
  { id: "l1", product: PRODUCTS[0], code: "AF8K2QX", clicks: 1240, orders: 58, conversions: 58, revenue: 5191000, status: "active" },
  { id: "l2", product: PRODUCTS[1], code: "AFRT9MD", clicks: 880, orders: 21, conversions: 21, revenue: 1365000, status: "active" },
  { id: "l3", product: PRODUCTS[3], code: "AF3LZ7P", clicks: 415, orders: 8, conversions: 8, revenue: 260000, status: "inactive" },
];

const fmtNGN = (n: number) =>
  `NGN ${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtPrice = (n: number) =>
  `₦${n.toLocaleString("en-NG")}`;

const genCode = () =>
  "AF" + Math.random().toString(36).slice(2, 8).toUpperCase();

const buildUrl = (slug: string, code: string) =>
  `primemart.com/products/${slug}?ref=${code}`;

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-affiliate-primary/10 text-affiliate-primary flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold truncate">{value}</p>
      </div>
    </div>
  </Card>
);

const CopyChip = ({ value }: { value: string }) => (
  <button
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    }}
    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted hover:bg-muted/70 font-mono text-xs"
  >
    {value}
    <Copy className="h-3 w-3" />
  </button>
);

const AffiliateReferralLinks = () => {
  const [links, setLinks] = useState<ReferralLink[]>(initialLinks);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [conflict, setConflict] = useState<ReferralLink | null>(null);

  const [viewLink, setViewLink] = useState<ReferralLink | null>(null);

  const stats = useMemo(() => {
    const clicks = links.reduce((s, l) => s + l.clicks, 0);
    const conv = links.reduce((s, l) => s + l.conversions, 0);
    const rev = links.reduce((s, l) => s + l.revenue, 0);
    return { total: links.length, clicks, conv, rev };
  }, [links]);

  const filtered = useMemo(() => {
    return links.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (search && !l.product.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [links, statusFilter, search]);

  const productMatches = useMemo(() => {
    if (!productSearch.trim()) return [];
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    ).slice(0, 6);
  }, [productSearch]);

  const openCreate = () => {
    setSelected(null);
    setProductSearch("");
    setConflict(null);
    setCreateOpen(true);
  };

  const handleSelectProduct = (p: Product) => {
    const existing = links.find((l) => l.product.id === p.id);
    if (existing) {
      setConflict(existing);
      setSelected(null);
    } else {
      setConflict(null);
      setSelected(p);
    }
    setProductSearch("");
  };

  const handleGenerate = () => {
    if (!selected) return;
    try {
      const newLink: ReferralLink = {
        id: `l${Date.now()}`,
        product: selected,
        code: genCode(),
        clicks: 0,
        orders: 0,
        conversions: 0,
        revenue: 0,
        status: "active",
      };
      setLinks((prev) => [newLink, ...prev]);
      setCreateOpen(false);
      toast.success("Referral link created.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCopyLink = (l: ReferralLink) => {
    navigator.clipboard.writeText(buildUrl(l.product.slug, l.code));
    toast.success("Referral link copied!");
  };

  const isEmpty = links.length === 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">My Referral Links</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and track referral links for products you promote.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-affiliate-primary hover:bg-affiliate-primary/90"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create New Link
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Links" value={String(stats.total)} icon={Link2} />
        <StatCard label="Total Clicks" value={stats.clicks.toLocaleString()} icon={MousePointerClick} />
        <StatCard label="Total Conversions" value={stats.conv.toLocaleString()} icon={ShoppingBag} />
        <StatCard label="Total Revenue" value={fmtNGN(stats.rev)} icon={DollarSign} />
      </div>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {(["all", "active", "inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  statusFilter === s
                    ? "bg-affiliate-primary text-white border-affiliate-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Table / Empty */}
      {isEmpty ? (
        <Card className="p-10 text-center">
          <Link2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-base font-medium">
            You haven't created any referral links yet.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Start by promoting a product.
          </p>
          <Button
            onClick={openCreate}
            className="bg-affiliate-primary hover:bg-affiliate-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Your First Link
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Referral Code</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No links match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((l) => {
                  const rate = l.clicks > 0 ? (l.conversions / l.clicks) * 100 : 0;
                  return (
                    <TableRow key={l.id}>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <img
                            src={l.product.thumbnail}
                            alt={l.product.name}
                            className="h-10 w-10 rounded object-cover bg-muted flex-shrink-0"
                          />
                          <span className="text-sm font-medium line-clamp-2">
                            {l.product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CopyChip value={l.code} />
                      </TableCell>
                      <TableCell className="text-right">{l.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{l.orders.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{l.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">{fmtNGN(l.revenue)}</TableCell>
                      <TableCell className="text-right">{rate.toFixed(2)}%</TableCell>
                      <TableCell>
                        {l.status === "active" ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopyLink(l)}
                            title="Copy referral link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setViewLink(l)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Referral Link</DialogTitle>
            <DialogDescription>
              Search for a product to promote and generate your unique referral link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search for a product to promote"
                className="pl-9"
              />
              {productMatches.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-lg max-h-64 overflow-auto">
                  {productMatches.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-muted text-left"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="h-9 w-9 rounded object-cover bg-muted flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{fmtPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div className="p-3 rounded-md border bg-muted/30 flex items-center gap-3">
                <img
                  src={selected.thumbnail}
                  alt={selected.name}
                  className="h-12 w-12 rounded object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">{fmtPrice(selected.price)}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelected(null)}
                >
                  Remove
                </Button>
              </div>
            )}

            {conflict && (
              <div className="p-3 rounded-md border border-amber-300 bg-amber-50 text-amber-900 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <p className="text-sm font-medium">
                    You already have a referral link for this product.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Existing code:</span>
                  <CopyChip value={conflict.code} />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!selected}
              className="bg-affiliate-primary hover:bg-affiliate-primary/90"
            >
              Generate Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Modal */}
      <Dialog open={!!viewLink} onOpenChange={(o) => !o && setViewLink(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Referral Link Details</DialogTitle>
          </DialogHeader>
          {viewLink && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={viewLink.product.thumbnail}
                  alt={viewLink.product.name}
                  className="h-14 w-14 rounded object-cover bg-muted"
                />
                <div className="min-w-0">
                  <p className="font-medium">{viewLink.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {fmtPrice(viewLink.product.price)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Referral code</p>
                  <CopyChip value={viewLink.code} />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Referral URL</p>
                  <CopyChip value={buildUrl(viewLink.product.slug, viewLink.code)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="text-lg font-semibold">{viewLink.clicks.toLocaleString()}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Conversions</p>
                  <p className="text-lg font-semibold">{viewLink.conversions.toLocaleString()}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-lg font-semibold">{viewLink.orders.toLocaleString()}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-lg font-semibold">{fmtNGN(viewLink.revenue)}</p>
                </Card>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Status</span>
                {viewLink.status === "active" ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewLink(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliateReferralLinks;
