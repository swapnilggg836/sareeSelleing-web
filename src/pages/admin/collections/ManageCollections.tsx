
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from 'sonner';

interface Collection {
  _id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
  createdAt: string;
}

const ManageCollections = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/collections', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCollections(result.data || []);
      } else {
        toast.error('Failed to fetch collections');
      }
    } catch (error) {
      console.error('Fetch collections error:', error);
      toast.error('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`http://localhost:5000/collections/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setCollections(prev => prev.filter(collection => collection._id !== id));
          toast.success('Collection deleted successfully');
        } else {
          toast.error('Failed to delete collection');
        }
      } catch (error) {
        console.error('Delete collection error:', error);
        toast.error('Failed to delete collection');
      }
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Collections</h2>
          <p className="text-muted-foreground">
            Organize your products into collections
          </p>
        </div>
        <Button onClick={() => navigate('/admin/collections/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Collections List</CardTitle>
              <CardDescription>Manage your product collections</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
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
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No collections found
                    </TableCell>
                  </TableRow>
                )}
                {filteredCollections.map((collection) => (
                  <TableRow key={collection._id}>
                    <TableCell>
                      <img
                        src={collection.image ? `http://localhost:5000${collection.image}` : '/placeholder.svg'}
                        alt={collection.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{collection.description}</TableCell>
                    <TableCell>
                      {collection.featured ? (
                        <Badge>Featured</Badge>
                      ) : (
                        <Badge variant="secondary">Regular</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(collection.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => navigate(`/admin/collections/edit/${collection._id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDelete(collection._id)}
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

export default ManageCollections;
