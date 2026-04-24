import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  UserX2,
  LogOut,
  Pencil,
  Eye,
  ShieldOff,
  AlertCircle,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type RoleKey = "all" | "admin" | "author" | "vendor" | "affiliate" | "user";
type AccountStatus =
  | "Active"
  | "Locked"
  | "Banned"
  | "Suspended"
  | "Pending Deletion";

interface AccountRow {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: Exclude<RoleKey, "all">;
  status: AccountStatus;
  joined: string;
  lastLogin: string;
}

const PAGE_SIZE = 100;

const MOCK_ACCOUNTS: AccountRow[] = [
  { id: "acc_001", fullName: "Adaeze Okafor", username: "adaezeo", email: "adaeze@primemart.io", role: "admin", status: "Active", joined: "2023-04-12", lastLogin: "2026-04-23 09:21" },
  { id: "acc_002", fullName: "Marcus Bell", username: "mbell", email: "marcus.bell@primemart.io", role: "author", status: "Active", joined: "2023-08-02", lastLogin: "2026-04-22 18:04" },
  { id: "acc_003", fullName: "TechHub NG", username: "techhub", email: "ops@techhub.ng", role: "vendor", status: "Active", joined: "2024-01-19", lastLogin: "2026-04-23 07:55" },
  { id: "acc_004", fullName: "Lola Adekunle", username: "lola.a", email: "lola@influence.co", role: "affiliate", status: "Suspended", joined: "2024-03-04", lastLogin: "2026-03-30 14:11" },
  { id: "acc_005", fullName: "Samuel Eze", username: "samuele", email: "samuel.eze@gmail.com", role: "user", status: "Active", joined: "2024-06-21", lastLogin: "2026-04-23 11:00" },
  { id: "acc_006", fullName: "Patience Ade", username: "patiencea", email: "patience@gmail.com", role: "user", status: "Locked", joined: "2024-07-09", lastLogin: "2026-04-18 22:42" },
  { id: "acc_007", fullName: "FashionLane", username: "fashionlane", email: "support@fashionlane.com", role: "vendor", status: "Pending Deletion", joined: "2023-11-30", lastLogin: "2026-04-10 10:00" },
  { id: "acc_008", fullName: "Daniel Onuoha", username: "donuoha", email: "daniel@primemart.io", role: "admin", status: "Active", joined: "2022-09-15", lastLogin: "2026-04-23 08:32" },
  { id: "acc_009", fullName: "Grace Bassey", username: "graceb", email: "grace.bassey@gmail.com", role: "user", status: "Banned", joined: "2024-02-12", lastLogin: "2026-01-04 19:20" },
  { id: "acc_010", fullName: "Kola Writes", username: "kolaw", email: "kola@blog.primemart.io", role: "author", status: "Active", joined: "2023-06-22", lastLogin: "2026-04-22 09:14" },
  { id: "acc_011", fullName: "Bright Affiliate", username: "brightaff", email: "bright@aff.io", role: "affiliate", status: "Active", joined: "2025-01-10", lastLogin: "2026-04-23 06:48" },
  { id: "acc_012", fullName: "HomeEssentials", username: "homeess", email: "team@homeess.com", role: "vendor", status: "Active", joined: "2024-09-01", lastLogin: "2026-04-22 23:15" },
];

const roleTabs: { key: RoleKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admin" },
  { key: "author", label: "Author" },
  { key: "vendor", label: "Vendor" },
  { key: "affiliate", label: "Affiliate" },
  { key: "user", label: "User" },
];

const roleBadgeClass: Record<Exclude<RoleKey, "all">, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  author: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  vendor: "bg-success/10 text-success border-success/20",
  affiliate: "bg-warning/10 text-warning border-warning/20",
  user: "bg-muted text-muted-foreground border-border",
};

const statusBadgeClass: Record<AccountStatus, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Locked: "bg-warning/15 text-warning border-warning/30",
  Banned: "bg-destructive/10 text-destructive border-destructive/20",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
  "Pending Deletion": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AdminAccounts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RoleKey>("all");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Counts per role
  const counts = useMemo(() => {
    const base: Record<RoleKey, number> = {
      all: MOCK_ACCOUNTS.length,
      admin: 0,
      author: 0,
      vendor: 0,
      affiliate: 0,
      user: 0,
    };
    MOCK_ACCOUNTS.forEach((a) => {
      base[a.role]++;
    });
    return base;
  }, []);

  // Filter by role + search
  const filtered = useMemo(() => {
    let rows = MOCK_ACCOUNTS;
    if (activeTab !== "all") rows = rows.filter((r) => r.role === activeTab);
    if (submittedSearch.trim()) {
      const q = submittedSearch.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.username.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [activeTab, submittedSearch]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  const allOnPageSelected =
    visible.length > 0 && visible.every((r) => selected.has(r.id));
  const someSelected = selected.size > 0;

  const toggleSelectAll = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      visible.forEach((r) => (checked ? next.add(r.id) : next.delete(r.id)));
      return next;
    });
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(search);
    setVisibleCount(PAGE_SIZE);
  };

  const clearSearch = () => {
    setSearch("");
    setSubmittedSearch("");
  };

  const highlight = (text: string) => {
    const q = submittedSearch.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-warning/30 text-foreground rounded px-0.5">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Heading + Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage all Primemart accounts across roles, statuses, and access.
          </p>
        </div>
        <form
          onSubmit={onSubmitSearch}
          className="relative w-full lg:w-96"
          role="search"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, username, or email..."
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as RoleKey);
          setVisibleCount(PAGE_SIZE);
          setSelected(new Set());
        }}
      >
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {roleTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="data-[state=active]:bg-background"
            >
              {tab.label}
              <Badge
                variant="secondary"
                className="ml-2 h-5 min-w-[1.5rem] justify-center px-1.5 text-xs"
              >
                {counts[tab.key]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Bulk action toolbar */}
      {someSelected && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center gap-3 p-3">
            <span className="text-sm font-medium">
              {selected.size} selected
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                <Pencil className="mr-2 h-4 w-4" /> Edit Selected
              </Button>
              <Button size="sm" variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Force Logout Selected
              </Button>
              <Button size="sm" variant="destructive">
                <ShieldOff className="mr-2 h-4 w-4" /> Suspend Selected
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total count + actions */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {submittedSearch ? (
            <>
              Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              search result{filtered.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-foreground">"{submittedSearch}"</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              account{filtered.length === 1 ? "" : "s"} total
            </>
          )}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 700);
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Table / States */}
      <Card>
        <CardContent className="p-0">
          {error ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" onClick={() => setError(null)}>
                Try again
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={(c) => toggleSelectAll(Boolean(c))}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Joined</TableHead>
                  <TableHead className="hidden xl:table-cell">Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      {Array.from({ length: 9 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Inbox className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {submittedSearch
                              ? "No matching account found."
                              : `No ${activeTab === "all" ? "" : activeTab + " "}accounts found.`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {submittedSearch
                              ? "Try a different name, username, or email."
                              : "Accounts will appear here once created."}
                          </p>
                        </div>
                        {submittedSearch && (
                          <Button variant="outline" size="sm" onClick={clearSearch}>
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((row) => {
                    const isSelected = selected.has(row.id);
                    return (
                      <TableRow
                        key={row.id}
                        className={cn(
                          "cursor-pointer",
                          isSelected && "bg-primary/5"
                        )}
                        onClick={() => navigate(`/admin/accounts/${row.id}`)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(c) => toggleRow(row.id, Boolean(c))}
                            aria-label={`Select ${row.fullName}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold">
                              {initials(row.fullName)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {highlight(row.fullName)}
                              </p>
                              <p className="text-xs text-muted-foreground md:hidden truncate">
                                {highlight(row.email)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {highlight(row.email)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          @{highlight(row.username)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("capitalize", roleBadgeClass[row.role])}
                          >
                            {row.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusBadgeClass[row.status]}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                          {row.joined}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                          {row.lastLogin}
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/admin/accounts/${row.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <ShieldOff className="mr-2 h-4 w-4" /> Suspend
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" /> Force Logout
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <UserX2 className="mr-2 h-4 w-4" /> Ban Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Load more pagination */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Load more ({filtered.length - visible.length} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;
