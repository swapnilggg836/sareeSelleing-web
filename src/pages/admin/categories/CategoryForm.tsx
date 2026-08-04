
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

const categorySchema = z.object({
  name: z.enum(['new-arrivals', 'banarasi-silk', 'kanjivaram', 'patola', 'paithani', 'bandhani'], {
    required_error: 'Please select a category name'
  }),
  description: z.string().min(1, 'Description is required'),
  parentCategory: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const predefinedCategories = [
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'banarasi-silk', label: 'Banarasi Silk' },
  { value: 'kanjivaram', label: 'Kanjivaram' },
  { value: 'patola', label: 'Patola' },
  { value: 'paithani', label: 'Paithani' },
  { value: 'bandhani', label: 'Bandhani' }
];

const CategoryForm = () => {
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
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      featured: false,
      active: true
    }
  });

  const featured = watch('featured');
  const active = watch('active');
  const selectedName = watch('name');

  // Fetch existing category data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchCategory();
    }
  }, [id, isEditing]);

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const categoryData = result.data;
        
        reset({
          name: categoryData.name,
          description: categoryData.description,
          parentCategory: categoryData.parentCategory || '',
          featured: categoryData.featured,
          active: categoryData.active,
        });

        if (categoryData.image) {
          setImagePreview(`/api${categoryData.image}`);
        }
      } else {
        toast.error('Failed to fetch category');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to fetch category');
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

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Append all form fields to FormData
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('parentCategory', data.parentCategory || '');
      formData.append('featured', data.featured.toString());
      formData.append('active', data.active.toString());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = localStorage.getItem('auth_token');
      const url = isEditing 
        ? `/api/categories/${id}` 
        : '/api/categories';
      
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Submitting category data:', {
        name: data.name,
        description: data.description,
        parentCategory: data.parentCategory,
        featured: data.featured,
        active: data.active,
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
        console.log('Category saved successfully:', result);
        toast.success(isEditing ? 'Category updated successfully!' : 'Category created successfully!');
        navigate('/admin/categories');
      } else {
        const errorData = await response.json();
        console.error('Failed to save category:', errorData);
        toast.error(errorData.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/categories')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update category details' : 'Create a new product category'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Enter the information for your category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Select onValueChange={(value) => setValue('name', value as CategoryFormData['name'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category name" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category</Label>
                <Select onValueChange={(value) => setValue('parentCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarees">Sarees</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe this category..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="featured">Featured Category</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm text-muted-foreground">
                    Display this category prominently
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="active">Active Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={active}
                    onCheckedChange={(checked) => setValue('active', checked)}
                  />
                  <Label htmlFor="active" className="text-sm text-muted-foreground">
                    Make this category visible to customers
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category Image</Label>
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
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400" />
                  )}
                  <p className="text-sm text-gray-500">
                    Click to upload category image
                  </p>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;
