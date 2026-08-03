
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface AdminEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminEditDialog = ({ open, onOpenChange }: AdminEditDialogProps) => {
  const { user, updateProfile, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      
      toast.success('Admin profile updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update admin profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Admin Profile</DialogTitle>
          <DialogDescription>
            Update your administrator profile information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-2 mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={user?.profileImage || ''} 
                alt={user?.name || 'Admin'} 
              />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">Administrator Account</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
              className="bg-gray-100 dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditDialog;
