
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth, User } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditDialog = ({ open, onOpenChange }: ProfileEditDialogProps) => {
  const { user, updateProfile, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          profileImage: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For now, we'll just update the text fields
      // Image upload to Supabase Storage can be implemented later
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        // profileImage: formData.profileImage, // TODO: Implement Supabase Storage upload
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-2 mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={formData.profileImage || ''} 
                alt={formData.name || 'Profile'} 
              />
              <AvatarFallback>
                {formData.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <Label htmlFor="profile-image" className="cursor-pointer text-sm text-crimson-600 hover:underline">
                Change Photo (Coming Soon)
              </Label>
              <Input 
                id="profile-image" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                disabled
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              className="bg-gray-100"
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
            <Button type="submit" disabled={isLoading} className="bg-crimson-600 hover:bg-crimson-700">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
