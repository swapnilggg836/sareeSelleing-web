
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');

// Mock notification storage (in production, use a database)
let notifications = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #DWK202400001 - ₹2,500 from John Doe',
    timestamp: '2 minutes ago',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: '2',
    type: 'contact',
    title: 'New Contact Message',
    message: 'Message from jane@example.com about product inquiry',
    timestamp: '15 minutes ago',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: '3',
    type: 'subscription',
    title: 'New Newsletter Subscription',
    message: 'user@example.com subscribed to newsletter',
    timestamp: '1 hour ago',
    read: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    id: '4',
    type: 'issue',
    title: 'System Issue Reported',
    message: 'Payment gateway timeout reported',
    timestamp: '2 hours ago',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

// Helper function to create notification
const createNotification = (type, title, message) => {
  const notification = {
    id: Date.now().toString(),
    type,
    title,
    message,
    timestamp: 'Just now',
    read: false,
    createdAt: new Date()
  };
  
  notifications.unshift(notification);
  return notification;
};

// @desc    Get all notifications
// @route   GET /admin/notifications
// @access  Private/Admin
exports.getNotifications = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest notifications (for polling)
// @route   GET /admin/notifications/latest
// @access  Private/Admin
exports.getLatestNotifications = async (req, res, next) => {
  try {
    // Check for new orders, contacts, and subscriptions
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    // Check for new orders
    const newOrders = await Order.find({ 
      createdAt: { $gte: fiveMinutesAgo } 
    }).populate('user', 'name');
    
    newOrders.forEach(order => {
      const existingNotification = notifications.find(n => 
        n.type === 'order' && n.message.includes(order.orderNumber)
      );
      
      if (!existingNotification) {
        createNotification(
          'order',
          'New Order Received',
          `Order #${order.orderNumber} - ₹${order.totalAmount.toLocaleString('en-IN')} from ${order.user?.name || 'Customer'}`
        );
      }
    });
    
    // Check for new contact messages
    const newContacts = await Contact.find({ 
      createdAt: { $gte: fiveMinutesAgo } 
    });
    
    newContacts.forEach(contact => {
      const existingNotification = notifications.find(n => 
        n.type === 'contact' && n.message.includes(contact.email)
      );
      
      if (!existingNotification) {
        createNotification(
          'contact',
          'New Contact Message',
          `Message from ${contact.email} about ${contact.subject}`
        );
      }
    });
    
    // Check for new newsletter subscriptions
    const newSubscriptions = await Newsletter.find({ 
      createdAt: { $gte: fiveMinutesAgo } 
    });
    
    newSubscriptions.forEach(subscription => {
      const existingNotification = notifications.find(n => 
        n.type === 'subscription' && n.message.includes(subscription.email)
      );
      
      if (!existingNotification) {
        createNotification(
          'subscription',
          'New Newsletter Subscription',
          `${subscription.email} subscribed to newsletter`
        );
      }
    });
    
    // Return recent notifications
    const recentNotifications = notifications.filter(n => 
      new Date(n.createdAt) >= fiveMinutesAgo
    );
    
    res.status(200).json({
      success: true,
      data: recentNotifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /admin/notifications/:id/read
// @access  Private/Admin
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    notifications[notificationIndex].read = true;
    
    res.status(200).json({
      success: true,
      data: notifications[notificationIndex]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /admin/notifications/read-all
// @access  Private/Admin
exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    notifications = notifications.map(n => ({ ...n, read: true }));
    
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};
