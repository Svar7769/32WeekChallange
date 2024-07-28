// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
  {
    origin: ["https://financial-app-front.vercel.app/"],
    methods: ["POST", "GET","PATCH","DELETE"],
    credentials: true
  }
));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Import auth middleware
const auth = require('./middleware/auth');

// Import controllers
const budgetController = require('./controllers/budgetController');
const goalController = require('./controllers/goalController');
const categoryController = require('./controllers/categoryController');
const reminderController = require('./controllers/reminderController');
// const userController = require('./controllers/userController');

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/reminders', require('./routes/reminders'));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
