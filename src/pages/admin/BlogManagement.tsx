import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Blog {
  id: string;
  title: string;
  author: string;
  categories: string[];
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  views: number;
}

const BlogManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Mock data - replace with actual API call
  const [blogs] = useState<Blog[]>([
    {
      id: "1",
      title: "Getting Started with E-commerce",
      author: "John Doe",
      categories: ["Tutorial", "E-commerce"],
      status: "published",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      views: 1234,
    },
    {
      id: "2",
      title: "10 Tips for Online Shopping",
      author: "Jane Smith",
      categories: ["Tips", "Shopping"],
      status: "published",
      createdAt: "2024-02-01",
      updatedAt: "2024-02-05",
      views: 856,
    },
    {
      id: "3",
      title: "Understanding Product Categories",
      author: "John Doe",
      categories: ["Guide"],
      status: "draft",
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
      views: 0,
    },
  ]);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    // Implement delete logic
    console.log("Deleting blog:", id);
    setBlogToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground">Create, manage, and publish blog posts</p>
        </div>
        <Button onClick={() => navigate("/admin/blog/upload")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>Manage your blog content and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No blog posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {blog.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={blog.status === "published" ? "default" : "outline"}>
                          {blog.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{blog.views.toLocaleString()}</TableCell>
                      <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(blog.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/blog/preview/${blog.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setBlogToDelete(blog.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!blogToDelete} onOpenChange={() => setBlogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => blogToDelete && handleDelete(blogToDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogManagement;
