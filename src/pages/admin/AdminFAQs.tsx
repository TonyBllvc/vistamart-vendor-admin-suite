import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Audience = "all" | "users" | "vendors" | "affiliates";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category_id: string;
  audience: Audience;
  brand_id: string | null;
  keywords: string[];
  display_order: number;
  is_published: boolean;
  view_count: number;
};

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

const CATEGORIES: Category[] = [
  { id: "1", name: "Payments & Wallet" },
  { id: "2", name: "Orders & Shipping" },
  { id: "3", name: "Account & Security" },
  { id: "4", name: "Becoming a Vendor" },
  { id: "5", name: "Affiliate Program" },
];

const BRANDS: Brand[] = [
  { id: "b1", name: "Samsung" },
  { id: "b2", name: "Apple" },
  { id: "b3", name: "Nike" },
  { id: "b4", name: "Sony" },
];

const INITIAL: FAQ[] = [
  { id: "1", question: "How do I top up my Primemart wallet?", answer: "Go to Wallet > Top Up and choose a payment method.", category_id: "1", audience: "users", brand_id: null, keywords: ["wallet", "topup", "payment"], display_order: 1, is_published: true, view_count: 1240 },
  { id: "2", question: "When will my order be delivered?", answer: "Delivery times vary by location, typically 2-5 business days.", category_id: "2", audience: "all", brand_id: null, keywords: ["delivery", "shipping"], display_order: 2, is_published: true, view_count: 3210 },
  { id: "3", question: "How do I become a vendor?", answer: "Sign up, complete store setup, and pick a subscription package.", category_id: "4", audience: "vendors", brand_id: null, keywords: ["vendor", "onboarding"], display_order: 3, is_published: true, view_count: 540 },
  { id: "4", question: "How do affiliate commissions work?", answer: "You earn a percentage on every sale through your referral link.", category_id: "5", audience: "affiliates", brand_id: null, keywords: ["affiliate", "commission"], display_order: 4, is_published: false, view_count: 102 },
  { id: "5", question: "How do I enable two-factor authentication?", answer: "Visit Profile > Security > Enable 2FA.", category_id: "3", audience: "all", brand_id: null, keywords: ["2fa", "security"], display_order: 5, is_published: true, view_count: 870 },
];

type FormState = {
  category_id: string;
  question: string;
  answer: string;
  audience: Audience;
  brand_id: string | null;
  keywords: string[];
  display_order: number;
  is_published: boolean;
};

const EMPTY_FORM: FormState = {
  category_id: "",
  question: "",
  answer: "",
  audience: "all",
  brand_id: null,
  keywords: [],
  display_order: 0,
  is_published: false,
};

const audienceBadge = (a: Audience) => {
  const map: Record<Audience, { label: string; className: string }> = {
    all: { label: "All Users", className: "bg-blue-100 text-blue-800" },
    users: { label: "Users", className: "bg-green-100 text-green-800" },
    vendors: { label: "Vendors", className: "bg-orange-100 text-orange-800" },
    affiliates: { label: "Affiliates", className: "bg-purple-100 text-purple-800" },
  };
  const { label, className } = map[a];
  return (
    <Badge className={cn("border-transparent hover:opacity-90", className)}>
      {label}
    </Badge>
  );
};

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n) + "…" : s);

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>(INITIAL);
  const [loading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "drafts">("all");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<"" | "publish" | "unpublish" | "move">("");
  const [bulkMoveTarget, setBulkMoveTarget] = useState<string>("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [deleting, setDeleting] = useState<FAQ | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keywordInput, setKeywordInput] = useState("");

  const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    return faqs
      .filter((f) => (categoryFilter === "all" ? true : f.category_id === categoryFilter))
      .filter((f) => {
        if (audienceFilter === "all") return true;
        if (audienceFilter === "all-audiences") return f.audience === "all";
        return f.audience === audienceFilter;
      })
      .filter((f) => {
        if (statusFilter === "published") return f.is_published;
        if (statusFilter === "drafts") return !f.is_published;
        return true;
      })
      .filter((f) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.display_order - b.display_order);
  }, [faqs, categoryFilter, audienceFilter, statusFilter, search]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((f) => selected.has(f.id));

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) filtered.forEach((f) => next.delete(f.id));
      else filtered.forEach((f) => next.add(f.id));
      return next;
    });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setKeywordInput("");
    setCreateOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setForm({
      category_id: faq.category_id,
      question: faq.question,
      answer: faq.answer,
      audience: faq.audience,
      brand_id: faq.brand_id,
      keywords: [...faq.keywords],
      display_order: faq.display_order,
      is_published: faq.is_published,
    });
    setErrors({});
    setKeywordInput("");
    setEditing(faq);
  };

  const validate = (ignoreId?: string) => {
    const errs: Record<string, string> = {};
    if (!form.category_id) errs.category_id = "Category is required.";
    if (!form.question.trim()) errs.question = "Question is required.";
    else if (form.question.length > 255) errs.question = "Question must be 255 characters or fewer.";
    if (!form.answer.trim()) errs.answer = "Answer is required.";

    if (form.question.trim() && form.category_id) {
      const dup = faqs.some(
        (f) =>
          f.id !== ignoreId &&
          f.category_id === form.category_id &&
          f.question.trim().toLowerCase() === form.question.trim().toLowerCase(),
      );
      if (dup) errs.question = "This question already exists in the selected category.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addKeyword = () => {
    const k = keywordInput.trim();
    if (!k) return;
    if (k.length > 50) return;
    if (form.keywords.includes(k)) {
      setKeywordInput("");
      return;
    }
    setForm({ ...form, keywords: [...form.keywords, k] });
    setKeywordInput("");
  };

  const removeKeyword = (k: string) =>
    setForm({ ...form, keywords: form.keywords.filter((x) => x !== k) });

  const handleCreate = () => {
    if (!validate()) return;
    const newFaq: FAQ = { id: Date.now().toString(), ...form, view_count: 0 };
    setFaqs((prev) => [...prev, newFaq]);
    setCreateOpen(false);
    toast.success("FAQ created successfully.");
  };

  const handleUpdate = () => {
    if (!editing) return;
    if (!validate(editing.id)) return;
    setFaqs((prev) => prev.map((f) => (f.id === editing.id ? { ...f, ...form } : f)));
    setEditing(null);
    toast.success("FAQ updated.");
  };

  const handleDelete = () => {
    if (!deleting) return;
    setFaqs((prev) => prev.filter((f) => f.id !== deleting.id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(deleting.id);
      return next;
    });
    setDeleting(null);
    toast("FAQ deleted.");
  };

  const applyBulk = () => {
    const count = selected.size;
    if (!count || !bulkAction) return;
    if (bulkAction === "publish") {
      setFaqs((prev) => prev.map((f) => (selected.has(f.id) ? { ...f, is_published: true } : f)));
      toast.success(`${count} FAQs published.`);
    } else if (bulkAction === "unpublish") {
      setFaqs((prev) => prev.map((f) => (selected.has(f.id) ? { ...f, is_published: false } : f)));
      toast(`${count} FAQs unpublished.`);
    } else if (bulkAction === "move") {
      if (!bulkMoveTarget) {
        toast.error("Pick a target category first.");
        return;
      }
      setFaqs((prev) =>
        prev.map((f) => (selected.has(f.id) ? { ...f, category_id: bulkMoveTarget } : f)),
      );
      toast.success(`${count} FAQs moved to ${categoryName(bulkMoveTarget)}.`);
    }
    setSelected(new Set());
    setBulkAction("");
    setBulkMoveTarget("");
  };

  const isEmpty = !loading && faqs.length === 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-sm text-muted-foreground mt-1">{faqs.length} FAQs total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Create FAQ
        </Button>
      </div>

      {isEmpty ? (
        <div className="border rounded-lg p-12 text-center space-y-4">
          <p className="text-muted-foreground">
            No FAQs yet. Create your first FAQ to help users.
          </p>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create FAQ
          </Button>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="vendors">Vendors</SelectItem>
                <SelectItem value="affiliates">Affiliates</SelectItem>
                <SelectItem value="all-audiences">All Audiences</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              {(["all", "published", "drafts"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors capitalize",
                    statusFilter === key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-muted",
                  )}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[220px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by question, answer, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/50 border rounded-lg px-4 py-3">
              <span className="text-sm font-medium">{selected.size} FAQs selected</span>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={bulkAction} onValueChange={(v) => setBulkAction(v as typeof bulkAction)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publish">Publish All</SelectItem>
                    <SelectItem value="unpublish">Unpublish All</SelectItem>
                    <SelectItem value="move">Move to Category...</SelectItem>
                  </SelectContent>
                </Select>
                {bulkAction === "move" && (
                  <Select value={bulkMoveTarget} onValueChange={setBulkMoveTarget}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Target category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button size="sm" onClick={applyBulk} disabled={!bulkAction}>
                  Apply
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={toggleAllVisible}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No FAQs match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(f.id)}
                          onCheckedChange={() => toggleRow(f.id)}
                          aria-label={`Select ${f.question}`}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {f.display_order}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {truncate(f.question, 60)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {categoryName(f.category_id)}
                        </Badge>
                      </TableCell>
                      <TableCell>{audienceBadge(f.audience)}</TableCell>
                      <TableCell>
                        {f.is_published ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-transparent">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {f.view_count.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            aria-label="View"
                          >
                            <a href={`/faq/${f.id}`} target="_blank" rel="noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(f)}
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleting(f)}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Create / Edit modal */}
      <Dialog
        open={createOpen || editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Category */}
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm({ ...form, category_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive">{errors.category_id}</p>
              )}
            </div>

            {/* Question */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label htmlFor="question">Question</Label>
                <span className="text-xs text-muted-foreground">
                  {form.question.length}/255
                </span>
              </div>
              <Input
                id="question"
                maxLength={255}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
              />
              {errors.question && (
                <p className="text-sm text-destructive">{errors.question}</p>
              )}
            </div>

            {/* Answer */}
            <div className="space-y-1.5">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                rows={8}
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
              />
              {errors.answer && (
                <p className="text-sm text-destructive">{errors.answer}</p>
              )}
            </div>

            {/* Audience */}
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <RadioGroup
                value={form.audience}
                onValueChange={(v) => setForm({ ...form, audience: v as Audience })}
                className="grid grid-cols-2 gap-2"
              >
                {[
                  { value: "all", label: "All Users" },
                  { value: "users", label: "Users (Customers)" },
                  { value: "vendors", label: "Vendors" },
                  { value: "affiliates", label: "Affiliates" },
                ].map((o) => (
                  <label
                    key={o.value}
                    className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50"
                  >
                    <RadioGroupItem value={o.value} />
                    <span className="text-sm">{o.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <Label>Brand (optional)</Label>
              <Select
                value={form.brand_id ?? "none"}
                onValueChange={(v) => setForm({ ...form, brand_id: v === "none" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (global FAQ)</SelectItem>
                  {BRANDS.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Link this FAQ to a specific brand. Leave blank for a global FAQ.
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-1.5">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="Type and press Enter"
                value={keywordInput}
                maxLength={50}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              {form.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.keywords.map((k) => (
                    <Badge
                      key={k}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {k}
                      <button
                        type="button"
                        onClick={() => removeKeyword(k)}
                        className="hover:bg-muted-foreground/20 rounded-sm"
                        aria-label={`Remove ${k}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Add search keywords to help users find this FAQ.
              </p>
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: Number(e.target.value) || 0 })
                }
              />
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="publish" className="cursor-pointer">
                Publish immediately
              </Label>
              <Switch
                id="publish"
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={editing ? handleUpdate : handleCreate}>
              {editing ? "Save Changes" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this FAQ? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
