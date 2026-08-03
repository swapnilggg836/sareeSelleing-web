
const express = require('express');
const { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getLatestNotifications
} = require('../controllers/adminNotificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

router.get('/', getNotifications);
router.get('/latest', getLatestNotifications);
router.put('/:id/read', markNotificationAsRead);
router.put('/read-all', markAllNotificationsAsRead);

module.exports = router;
