
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

const bannerSchema = z.object({
  title: z.string().min(1, 'Banner title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  linkText: z.string().optional(),
  linkUrl: z.string().optional(),
  position: z.enum(['hero', 'secondary', 'footer']),
  active: z.boolean().default(true),
});

type BannerFormData = z.infer<typeof bannerSchema>;

const BannerForm = () => {
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
    formState: { errors }
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      active: true,
      position: 'hero'
    }
  });

  const active = watch('active');
  const position = watch('position');

  useEffect(() => {
    if (isEditing) {
      fetchBannerData();
    }
  }, [isEditing, id]);

  const fetchBannerData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/banners/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const banner = result.data;
        setValue('title', banner.title);
        setValue('subtitle', banner.subtitle || '');
        setValue('position', banner.position);
        setValue('active', banner.active);
        if (banner.image) {
          setImagePreview(`/api${banner.image}`);
        }
      }
    } catch (error) {
      toast.error('Failed to load banner data');
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

  const onSubmit = async (data: BannerFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.subtitle) formData.append('subtitle', data.subtitle);
      if (data.description) formData.append('description', data.description);
      if (data.linkText) formData.append('linkText', data.linkText);
      if (data.linkUrl) formData.append('linkUrl', data.linkUrl);
      formData.append('position', data.position);
      formData.append('active', data.active.toString());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = localStorage.getItem('auth_token');
      const url = isEditing 
        ? `/api/banners/${id}`
        : '/api/banners';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save banner');
      }

      const result = await response.json();
      console.log('Banner saved:', result);
      
      toast.success(isEditing ? 'Banner updated successfully!' : 'Banner created successfully!');
      navigate('/admin/manage-banners');
    } catch (error) {
      console.error('Save banner error:', error);
      toast.error('Failed to save banner');
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
            {isEditing ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update banner details' : 'Create a new promotional banner'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>
            Configure your promotional banner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Summer Sale"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  {...register('subtitle')}
                  placeholder="e.g., Up to 50% off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Banner Position</Label>
                <Select value={position} onValueChange={(value) => setValue('position', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="secondary">Secondary Section</SelectItem>
                    <SelectItem value="footer">Footer Section</SelectItem>
                  </SelectContent>
                </Select>
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
                    Display this banner on the website
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Banner description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkText">Button Text</Label>
                <Input
                  id="linkText"
                  {...register('linkText')}
                  placeholder="e.g., Shop Now"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Button Link</Label>
                <Input
                  id="linkUrl"
                  {...register('linkUrl')}
                  placeholder="e.g., /collection/sale"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
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
                      alt="Banner preview"
                      className="w-full max-w-md h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400" />
                  )}
                  <p className="text-sm text-gray-500">
                    Click to upload banner image (recommended: 1920x600px)
                  </p>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Banner' : 'Create Banner')}
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

export default BannerForm;
