
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Upload, ArrowLeft } from 'lucide-react';

// Updated schema: remove products
const collectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required'),
  description: z.string().min(1, 'Description is required'),
  featured: z.boolean().default(false),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

const CollectionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Removed allProducts and selectedProducts state

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      featured: false
    }
  });

  const featured = watch('featured');

  useEffect(() => {
    // fetchAllProducts(); REMOVED
    if (isEditing) {
      fetchCollectionData();
    }
  }, [isEditing, id]);

  // Removed fetchAllProducts

  const fetchCollectionData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/collections/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const collection = result.data;
        setValue('name', collection.name);
        setValue('description', collection.description);
        setValue('featured', collection.featured);
        // Removed products set logic
        if (collection.image) {
          setImagePreview(`http://localhost:5000${collection.image}`);
        }
      }
    } catch (error) {
      toast.error('Failed to load collection data');
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

  // Removed handleProductSelectChange

  const onSubmit = async (data: CollectionFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('featured', data.featured.toString());
      // Removed products append logic
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = localStorage.getItem('auth_token');
      const url = isEditing 
        ? `http://localhost:5000/collections/${id}`
        : 'http://localhost:5000/collections';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save collection');
      }

      const result = await response.json();
      toast.success(isEditing ? 'Collection updated successfully!' : 'Collection created successfully!');
      navigate('/admin/manage-collections');
    } catch (error) {
      console.error('Save collection error:', error);
      toast.error('Failed to save collection');
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
            {isEditing ? 'Edit Collection' : 'Add New Collection'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update collection details' : 'Create a new collection for your products'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Details</CardTitle>
          <CardDescription>
            Enter the information for your collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Wedding Collection"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured">Featured Collection</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm text-muted-foreground">
                    Display this collection prominently on the homepage
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your collection..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Collection Image</Label>
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
                      alt="Collection preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400" />
                  )}
                  <p className="text-sm text-gray-500">
                    Click to upload collection image
                  </p>
                </label>
              </div>
            </div>

            {/* Removed Products in this Collection selection UI */}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Collection' : 'Create Collection')}
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

export default CollectionForm;

// The file is now below 300 lines but is still fairly long. For future maintainability, consider refactoring this file into smaller subcomponents (e.g., for image upload, header, etc).
