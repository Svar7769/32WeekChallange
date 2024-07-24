const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRouter = require('./routes/auth');
const expensesRouter = require('./routes/expenses');
const debtsRouter = require('./routes/debts');

app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/debts', debtsRouter);

app.get('/', (req, res) => {
  res.send('Tracker App is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
