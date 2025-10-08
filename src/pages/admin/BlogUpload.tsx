import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Upload, X, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BlogUpload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Mock categories - replace with actual API call
  const availableCategories = ["Tutorial", "E-commerce", "Tips", "Shopping", "Guide", "News", "Review"];

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview("");
  };

  const addCategory = (category: string) => {
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
      setCategoryInput("");
    }
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = (saveStatus: "draft" | "published") => {
    if (!title || !content || !author) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    // Implement save logic
    console.log({
      title,
      content,
      excerpt,
      author,
      status: saveStatus,
      categories: selectedCategories,
      tags,
      featuredImage,
    });

    toast.success(`Blog ${saveStatus === "published" ? "published" : "saved as draft"} successfully`);
    navigate("/admin/blog");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Create Blog Post</h1>
          <p className="text-muted-foreground">Write and publish engaging content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave("draft")} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave("published")} className="gap-2">
            <Eye className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>Enter the main content of your blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of the blog post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>Upload a featured image for your blog post</CardDescription>
            </CardHeader>
            <CardContent>
              {featuredImagePreview ? (
                <div className="relative rounded-lg border-2 border-dashed border-border p-4">
                  <img
                    src={featuredImagePreview}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-6 right-6"
                    onClick={removeFeaturedImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <span className="text-sm text-muted-foreground mb-2">
                    Click to upload featured image
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedImageChange}
                  />
                </label>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <CardDescription>Configure your blog post settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  placeholder="Author name..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: "draft" | "published") => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories *</CardTitle>
              <CardDescription>Select or add categories for your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={categoryInput} onValueChange={addCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCategory(category)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to improve discoverability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogUpload;
