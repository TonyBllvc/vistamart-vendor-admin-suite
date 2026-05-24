import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FAQCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  is_published: boolean;
  faq_count: number;
};

type FormState = {
  name: string;
  description: string;
  icon: string;
  display_order: number;
  is_published: boolean;
};

const INITIAL: FAQCategory[] = [
  { id: "1", name: "Payments & Wallet", description: "How payments, refunds and wallet top-ups work.", icon: "payment", display_order: 1, is_published: true, faq_count: 12 },
  { id: "2", name: "Orders & Shipping", description: "Order tracking, delivery times and returns.", icon: "package", display_order: 2, is_published: true, faq_count: 18 },
  { id: "3", name: "Account & Security", description: "Managing your account, password and 2FA.", icon: "security", display_order: 3, is_published: true, faq_count: 9 },
  { id: "4", name: "Becoming a Vendor", description: "Vendor onboarding, packages and store setup.", icon: "store", display_order: 4, is_published: false, faq_count: 7 },
  { id: "5", name: "Affiliate Program", description: "How to earn through referrals.", icon: "share", display_order: 5, is_published: false, faq_count: 4 },
];

const EMPTY_FORM: FormState = { name: "", description: "", icon: "", display_order: 0, is_published: false };

export default function AdminFAQCategories() {
  const [categories, setCategories] = useState<FAQCategory[]>(INITIAL);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<FAQCategory | null>(null);
  const [deleting, setDeleting] = useState<FAQCategory | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [nameError, setNameError] = useState("");

  const filtered = useMemo(() => {
    return categories
      .filter((c) => {
        if (filter === "published") return c.is_published;
        if (filter === "drafts") return !c.is_published;
        return true;
      })
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      })
      .sort((a, b) => a.display_order - b.display_order);
  }, [categories, filter, search]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) filtered.forEach((c) => next.delete(c.id));
      else filtered.forEach((c) => next.add(c.id));
      return next;
    });
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setNameError("");
    setCreateOpen(true);
  };

  const openEdit = (cat: FAQCategory) => {
    setForm({
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      display_order: cat.display_order,
      is_published: cat.is_published,
    });
    setNameError("");
    setEditing(cat);
  };

  const validateName = (name: string, ignoreId?: string) => {
    const exists = categories.some(
      (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase() && c.id !== ignoreId,
    );
    if (exists) {
      setNameError("A category with this name already exists.");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleCreate = () => {
    if (!form.name.trim()) {
      setNameError("Name is required.");
      return;
    }
    if (!validateName(form.name)) return;
    const newCat: FAQCategory = {
      id: Date.now().toString(),
      ...form,
      faq_count: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    setCreateOpen(false);
    toast.success("Category created successfully.");
  };

  const handleUpdate = () => {
    if (!editing) return;
    if (!form.name.trim()) {
      setNameError("Name is required.");
      return;
    }
    if (!validateName(form.name, editing.id)) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === editing.id ? { ...c, ...form } : c)),
    );
    setEditing(null);
    toast.success("Category updated.");
  };

  const handleDelete = () => {
    if (!deleting) return;
    const name = deleting.name;
    setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(deleting.id);
      return next;
    });
    setDeleting(null);
    toast(`${name} deleted.`);
  };

  const handleBulk = (publish: boolean) => {
    const count = selected.size;
    if (!count) return;
    setCategories((prev) =>
      prev.map((c) => (selected.has(c.id) ? { ...c, is_published: publish } : c)),
    );
    setSelected(new Set());
    if (publish) toast.success(`${count} categories published.`);
    else toast(`${count} categories unpublished.`);
  };

  const isEmpty = categories.length === 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">FAQ Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>

      {isEmpty ? (
        <div className="border rounded-lg p-12 text-center space-y-4">
          <p className="text-muted-foreground">
            No FAQ categories yet. Create your first category to get started.
          </p>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create Category
          </Button>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              {(["all", "published", "drafts"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors capitalize",
                    filter === key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-muted",
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/50 border rounded-lg px-4 py-3">
              <span className="text-sm font-medium">
                {selected.size} categories selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulk(true)}>
                  Publish All
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulk(false)}>
                  Unpublish All
                </Button>
                <Button size="sm" onClick={() => setSelected(new Set())}>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>FAQ Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No categories match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(cat.id)}
                          onCheckedChange={() => toggleRow(cat.id)}
                          aria-label={`Select ${cat.name}`}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {cat.display_order}
                      </TableCell>
                      <TableCell className="font-semibold">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {cat.description}
                      </TableCell>
                      <TableCell>{cat.faq_count} FAQs</TableCell>
                      <TableCell>
                        {cat.is_published ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-transparent">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(cat)}
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleting(cat)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit FAQ Category" : "Create FAQ Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Payments & Wallet"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (nameError) setNameError("");
                }}
              />
              {nameError && (
                <p className="text-sm text-destructive">{nameError}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of what FAQs this category covers."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                placeholder="e.g. payment, security, order"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                An icon name used to display a visual for this category.
              </p>
            </div>
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
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first.
              </p>
            </div>
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
              {editing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <Dialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              {deleting && (
                <>
                  Deleting '<span className="font-semibold">{deleting.name}</span>'
                  will also permanently delete all {deleting.faq_count} FAQs in this
                  category. This cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
