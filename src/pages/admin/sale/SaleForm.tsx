
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
import { ArrowLeft } from 'lucide-react';

const saleSchema = z.object({
  title: z.string().min(1, 'Sale title is required'),
  description: z.string().min(1, 'Description is required'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(1, 'Discount value is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

type SaleFormData = z.infer<typeof saleSchema>;

const SaleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      active: true,
      featured: false,
      discountType: 'percentage'
    }
  });

  const active = watch('active');
  const featured = watch('featured');
  const discountType = watch('discountType');

  // Fetch sale data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchSaleData();
    }
  }, [id, isEditing]);

  const fetchSaleData = async () => {
    try {
      const response = await fetch(`/api/sales/${id}`);
      const result = await response.json();
      
      if (result.success) {
        const sale = result.data;
        
        // Format dates for input fields
        const startDate = new Date(sale.startDate).toISOString().split('T')[0];
        const endDate = new Date(sale.endDate).toISOString().split('T')[0];
        
        reset({
          title: sale.title,
          description: sale.description,
          discountType: sale.discountType,
          discountValue: sale.discountValue,
          startDate,
          endDate,
          active: sale.active,
          featured: sale.featured
        });
      }
    } catch (error) {
      console.error('Error fetching sale:', error);
      toast.error('Failed to load sale data');
    }
  };

  const onSubmit = async (data: SaleFormData) => {
    setLoading(true);
    try {
      console.log('Submitting sale data:', data);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        navigate('/admin/login');
        return;
      }

      const url = isEditing 
        ? `/api/sales/${id}`
        : '/api/sales';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        toast.success(isEditing ? 'Sale updated successfully!' : 'Sale created successfully!');
        navigate('/admin/sale');
      } else {
        throw new Error(result.error || 'Failed to save sale');
      }
    } catch (error) {
      console.error('Error saving sale:', error);
      toast.error('Failed to save sale');
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
            {isEditing ? 'Edit Sale' : 'Add New Sale'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update sale details' : 'Create a new sale promotion'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale Details</CardTitle>
          <CardDescription>
            Configure your sale promotion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Sale Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Summer Sale 2024"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select value={discountType} onValueChange={(value) => setValue('discountType', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  {...register('discountValue', { valueAsNumber: true })}
                  placeholder={discountType === 'percentage' ? 'e.g., 50' : 'e.g., 500'}
                />
                {errors.discountValue && (
                  <p className="text-sm text-red-500">{errors.discountValue.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your sale promotion..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="active">Active Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={active}
                    onCheckedChange={(checked) => setValue('active', checked)}
                  />
                  <Label htmlFor="active" className="text-sm text-muted-foreground">
                    Make this sale active
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured">Featured Sale</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm text-muted-foreground">
                    Feature this sale prominently
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Sale' : 'Create Sale')}
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

export default SaleForm;
