import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Plus,
  Package as PackageIcon,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PackageStatus = "active" | "inactive" | "pending_deletion";

type PackageRow = {
  id: string;
  name: string;
  finalPrice: number;
  currency: string;
  durationDays: number;
  productLimit: number;
  boostLevel: number;
  status: PackageStatus;
  pendingDeletion: boolean;
};

const MOCK_PACKAGES: PackageRow[] = [
  {
    id: "1",
    name: "Starter",
    finalPrice: 4500,
    currency: "NGN",
    durationDays: 30,
    productLimit: 50,
    boostLevel: 2,
    status: "active",
    pendingDeletion: false,
  },
  {
    id: "2",
    name: "Professional",
    finalPrice: 13500,
    currency: "NGN",
    durationDays: 30,
    productLimit: 200,
    boostLevel: 5,
    status: "active",
    pendingDeletion: false,
  },
  {
    id: "3",
    name: "Enterprise",
    finalPrice: 45000,
    currency: "NGN",
    durationDays: 90,
    productLimit: 1000,
    boostLevel: 9,
    status: "active",
    pendingDeletion: false,
  },
  {
    id: "4",
    name: "Legacy Basic",
    finalPrice: 2000,
    currency: "NGN",
    durationDays: 30,
    productLimit: 20,
    boostLevel: 0,
    status: "pending_deletion",
    pendingDeletion: true,
  },
  {
    id: "5",
    name: "Trial",
    finalPrice: 0,
    currency: "NGN",
    durationDays: 14,
    productLimit: 10,
    boostLevel: 1,
    status: "inactive",
    pendingDeletion: false,
  },
];

type FilterKey = "all" | "active" | "pending_deletion";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending_deletion", label: "Pending Deletion" },
];

const formatPrice = (amount: number, currency: string) =>
  `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const StatusBadge = ({ status }: { status: PackageStatus }) => {
  if (status === "active") {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 dark:text-emerald-400">
        Active
      </Badge>
    );
  }
  if (status === "pending_deletion") {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30 dark:text-amber-400">
        Pending Deletion
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Inactive
    </Badge>
  );
};

const PackageList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [packages, setPackages] = useState<PackageRow[]>(MOCK_PACKAGES);
  const [loading] = useState(false);
  const [errorState] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PackageRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return packages;
    if (filter === "active")
      return packages.filter((p) => p.status === "active");
    return packages.filter((p) => p.status === "pending_deletion");
  }, [filter, packages]);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    // Simulate API: POST /packages/<id>/queue-deletion/
    await new Promise((r) => setTimeout(r, 700));
    setPackages((prev) =>
      prev.map((p) =>
        p.id === pendingDelete.id
          ? { ...p, status: "pending_deletion", pendingDeletion: true }
          : p,
      ),
    );
    toast.success(`"${pendingDelete.name}" queued for deletion.`);
    setDeleting(false);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Subscription Packages
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage tiers vendors can purchase to list products on Primemart.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/packages/new">
            <Plus className="h-4 w-4" />
            Create Package
          </Link>
        </Button>
      </div>

      {/* Filter chips */}
      <div className="inline-flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      {errorState ? (
        <Card className="border-destructive/40 bg-destructive/5 p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">
              Unable to load packages. Please refresh the page.
            </p>
          </div>
        </Card>
      ) : loading ? (
        <Card className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : filtered.length === 0 && packages.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <PackageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            No packages yet. Create your first package to let vendors start
            selling.
          </p>
          <Button asChild>
            <Link to="/admin/packages/new">
              <Plus className="h-4 w-4" />
              Create Package
            </Link>
          </Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No packages match this filter.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Package Name</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Product Limit</TableHead>
                <TableHead>Boost Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>
                    {formatPrice(pkg.finalPrice, pkg.currency)}
                  </TableCell>
                  <TableCell>{pkg.durationDays} days</TableCell>
                  <TableCell>Up to {pkg.productLimit} products</TableCell>
                  <TableCell>{pkg.boostLevel} / 10</TableCell>
                  <TableCell>
                    <StatusBadge status={pkg.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/admin/packages/${pkg.id}/edit`)
                        }
                        aria-label={`Edit ${pkg.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {pkg.pendingDeletion ? (
                        <span className="px-2 text-xs font-medium text-muted-foreground italic">
                          Deletion queued
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setPendingDelete(pkg)}
                          aria-label={`Delete ${pkg.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete confirmation */}
      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Queue Package for Deletion</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              This package will no longer be available for new vendors to
              purchase. Existing subscribers will keep access until their
              subscriptions expire. The package will be permanently deleted
              once all active subscriptions have ended.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Queuing…" : "Queue for Deletion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageList;
