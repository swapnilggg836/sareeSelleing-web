
const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /contact
// @access  Public
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('Contact form submission error:', err);
    next(err);
  }
};

// @desc    Get all contact submissions
// @route   GET /contact
// @access  Private/Admin
exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    next(err);
  }
};
