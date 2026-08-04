
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureUploadDir = () => {
  const uploadDir = path.join(__dirname, '../uploads/blog');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created blog upload directory:', uploadDir);
    }
  } catch (e) {
    // Ignore filesystem errors in read-only environment like Vercel
  }
  return uploadDir;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = ensureUploadDir();
    cb(null, uploadDir); // Use absolute path
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('Uploading blog image with filename:', uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @desc    Get all blog posts
// @route   GET /blog
// @access  Public
exports.getBlogPosts = async (req, res, next) => {
  try {
    const blogPosts = await Blog.find({ published: true }).populate('author', 'name');
    
    res.status(200).json({
      success: true,
      count: blogPosts.length,
      data: blogPosts
    });
  } catch (err) {
    console.error('Get blog posts error:', err);
    next(err);
  }
};

// @desc    Get single blog post
// @route   GET /blog/:id
// @access  Public
exports.getBlogPost = async (req, res, next) => {
  try {
    const blogPost = await Blog.findById(req.params.id).populate('author', 'name');
    
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (err) {
    console.error('Get blog post error:', err);
    next(err);
  }
};

// @desc    Create new blog post
// @route   POST /blog
// @access  Private/Admin
exports.createBlogPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, published, featured } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/blog/${req.file.filename}`;
      console.log('Blog image uploaded successfully:', imageUrl);
    }

    const blogData = {
      title,
      content,
      excerpt,
      category,
      published: published === 'true',
      featured: featured === 'true',
      image: imageUrl,
      author: req.user.id
    };

    console.log('Creating blog post with data:', blogData);
    const blogPost = await Blog.create(blogData);
    
    res.status(201).json({
      success: true,
      data: blogPost
    });
  } catch (err) {
    console.error('Create blog post error:', err);
    // Clean up uploaded file if blog creation fails
    if (req.file) {
      const filePath = req.file.path; // Use the actual file path from multer
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Cleaned up uploaded file due to error:', filePath);
      }
    }
    next(err);
  }
};

// @desc    Update blog post
// @route   PUT /blog/:id
// @access  Private/Admin
exports.updateBlogPost = async (req, res, next) => {
  try {
    let blogPost = await Blog.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    const { title, content, excerpt, category, published, featured } = req.body;

    const updateData = {
      title,
      content,
      excerpt,
      category,
      published: published === 'true',
      featured: featured === 'true'
    };

    if (req.file) {
      updateData.image = `/uploads/blog/${req.file.filename}`;
      console.log('Blog image updated:', updateData.image);
      
      // Clean up old image if it exists
      if (blogPost.image) {
        const oldImagePath = path.join(__dirname, '..', blogPost.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Cleaned up old blog image:', oldImagePath);
        }
      }
    }

    blogPost = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (err) {
    console.error('Update blog post error:', err);
    next(err);
  }
};

// @desc    Delete blog post
// @route   DELETE /blog/:id
// @access  Private/Admin
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const blogPost = await Blog.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    // Clean up associated image file
    if (blogPost.image) {
      const imagePath = path.join(__dirname, '..', blogPost.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Cleaned up blog image:', imagePath);
      }
    }
    
    await blogPost.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete blog post error:', err);
    next(err);
  }
};

exports.uploadBlogImage = upload.single('image');
