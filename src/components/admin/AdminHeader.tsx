
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { Bell, Settings, User, Moon, Sun, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import AdminEditDialog from './AdminEditDialog';
import AdminPrivacyDialog from './AdminPrivacyDialog';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useAdminTheme();
  const { unreadCount } = useAdminNotifications();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNotificationsClick = () => {
    navigate('/admin/notifications');
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 sm:px-6">
        <div className="flex flex-1 justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white truncate">
            Shopkeeper Admin Panel
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={handleNotificationsClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user?.role} Account
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Theme Toggle */}
                <DropdownMenuItem className="flex items-center justify-between">
                  <div className="flex items-center">
                    {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    <span>Dark Mode</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Edit Profile */}
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Admin Profile</span>
                </DropdownMenuItem>
                
                {/* Privacy & Policy */}
                <DropdownMenuItem onClick={() => setPrivacyDialogOpen(true)}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Privacy & Policy</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Settings */}
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                {/* Logout */}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Dialogs */}
      <AdminEditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
      />
      <AdminPrivacyDialog 
        open={privacyDialogOpen} 
        onOpenChange={setPrivacyDialogOpen} 
      />
    </>
  );
};

export default AdminHeader;
