
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingCart, Mail, User, AlertTriangle, CheckCircle } from "lucide-react";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

const AdminNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAdminNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case 'contact':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'subscription':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'issue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            {unreadCount} unread notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Stay updated with the latest activities on your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Badge variant="default" className="ml-2">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {notification.timestamp}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No notifications yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
