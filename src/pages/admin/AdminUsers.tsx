
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from "date-fns";
import { usersApi } from '@/api/apiClient';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profileImage?: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: usersApi.getAllUsers,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const users = usersResponse?.data || [];

  const filteredUsers = users?.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Error loading users: {error.message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure the backend server is running on port 5000
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage and monitor user accounts ({users.length} total)
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading users from database...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'No users found matching your search' : 'No users found in database'}
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredUsers?.map((user: User) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profileImage} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), 'PPP')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(user._id)}
                            disabled={deleteUserMutation.isPending}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
