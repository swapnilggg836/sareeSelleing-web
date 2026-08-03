import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Shield, FileText } from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: ''
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your address"
                      rows={3}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>
                Your privacy and data protection information
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>Data Collection</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>
              
              <h3>How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>
              
              <h3>Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
              
              <h3>Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h3>Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@dwarkadish.com
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Preferences</CardTitle>
              <CardDescription>
                Manage your content preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">About Dwarkadish</h3>
                <p className="text-muted-foreground mb-4">
                  Dwarkadish is your premier destination for authentic Pithani sarees. We specialize in 
                  handcrafted traditional wear that combines timeless elegance with contemporary style.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our collection features carefully curated sarees for weddings, festivals, and special 
                  occasions. Each piece is selected for its quality, craftsmanship, and cultural significance.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Our Mission</h3>
                <p className="text-muted-foreground mb-4">
                  To preserve and promote traditional Indian textile artistry while making it accessible 
                  to modern women who appreciate heritage and quality.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Quality Commitment</h3>
                <p className="text-muted-foreground">
                  Every saree in our collection undergoes strict quality checks to ensure you receive 
                  only the finest products that will be treasured for years to come.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
