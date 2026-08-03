
const express = require('express');
const { submitContactForm, getAllContacts } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', protect, authorize('admin'), getAllContacts);

module.exports = router;
