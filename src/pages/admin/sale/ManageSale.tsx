
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, RefreshCw } from "lucide-react";
import { toast } from 'sonner';

interface Sale {
  _id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

const ManageSale = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/sales', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setSales(result.data || []);
      } else {
        toast.error('Failed to fetch sales');
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`http://localhost:5000/sales/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          setSales(prev => prev.filter(sale => sale._id !== id));
          toast.success('Sale deleted successfully');
        } else {
          toast.error('Failed to delete sale');
        }
      } catch (error) {
        console.error('Error deleting sale:', error);
        toast.error('Error deleting sale');
      }
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDiscount = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `₹${value}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Sales</h2>
          <p className="text-muted-foreground">
            Create and manage your sale promotions
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchSales}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => navigate('/admin/sale/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sale
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Sales List</CardTitle>
              <CardDescription>
                {loading ? 'Loading...' : `${filteredSales.length} sales found`}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading sales...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filteredSales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No sales found
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filteredSales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell className="font-medium">{sale.title}</TableCell>
                    <TableCell>{formatDiscount(sale.discountType, sale.discountValue)}</TableCell>
                    <TableCell>
                      {new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {sale.active ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {sale.featured ? (
                        <Badge>Featured</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => navigate(`/admin/sale/${sale._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDelete(sale._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageSale;
