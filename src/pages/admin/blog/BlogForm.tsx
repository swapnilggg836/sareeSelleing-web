
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Upload, ArrowLeft } from 'lucide-react';

const blogSchema = z.object({
  title: z.string().min(1, 'Blog title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      published: false,
      featured: false
    }
  });

  const published = watch('published');
  const featured = watch('featured');

  // Fetch existing blog data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchBlogPost();
    }
  }, [id, isEditing]);

  const fetchBlogPost = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/blog/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const blogData = result.data;
        
        reset({
          title: blogData.title,
          content: blogData.content,
          excerpt: blogData.excerpt || '',
          category: blogData.category,
          published: blogData.published,
          featured: blogData.featured,
        });

        if (blogData.image) {
          setImagePreview(`/api${blogData.image}`);
        }
      } else {
        toast.error('Failed to fetch blog post');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to fetch blog post');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Append all form fields to FormData
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('excerpt', data.excerpt || '');
      formData.append('category', data.category);
      formData.append('published', data.published.toString());
      formData.append('featured', data.featured.toString());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = localStorage.getItem('auth_token');
      const url = isEditing 
        ? `/api/blog/${id}` 
        : '/api/blog';
      
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Submitting blog data:', {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        published: data.published,
        featured: data.featured,
        hasImage: !!imageFile
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Blog post saved successfully:', result);
        toast.success(isEditing ? 'Blog post updated successfully!' : 'Blog post created successfully!');
        navigate('/admin/manage-blog');
      } else {
        const errorData = await response.json();
        console.error('Failed to save blog post:', errorData);
        toast.error(errorData.error || 'Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update blog post details' : 'Create a new blog post'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>
            Enter the information for your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Blog Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Latest Fashion Trends"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="sarees">Sarees</SelectItem>
                    <SelectItem value="trends">Trends</SelectItem>
                    <SelectItem value="care">Care Tips</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                {...register('excerpt')}
                placeholder="Brief description of the blog post..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Write your blog post content here..."
                rows={8}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="published">Published Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={(checked) => setValue('published', checked)}
                  />
                  <Label htmlFor="published" className="text-sm text-muted-foreground">
                    Publish this blog post
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured">Featured Post</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm text-muted-foreground">
                    Feature this post on homepage
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Blog preview"
                      className="w-full max-w-md h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400" />
                  )}
                  <p className="text-sm text-gray-500">
                    Click to upload blog image
                  </p>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogForm;
