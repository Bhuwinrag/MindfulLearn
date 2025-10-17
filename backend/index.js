const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const materialRoutes = require('./routes/materials');
const forumRoutes = require('./routes/forums');
const notificationRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);


// Simple root route
app.get('/', (req, res) => {
  res.send('LMS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} 🔥`));