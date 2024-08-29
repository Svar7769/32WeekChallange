// routes/test.js
const express = require('express');
const router = express.Router();

// Test data
const testData = [
  { id: 1, name: 'Test User 1', email: 'test1@example.com' },
  { id: 2, name: 'Test User 2', email: 'test2@example.com' },
  { id: 3, name: 'Test User 3', email: 'test3@example.com' },
];

// GET /api/test
router.get('/', (req, res) => {
  res.json({
    message: 'Test route is working!',
    data: testData
  });
});

// GET /api/test/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = testData.find(user => user.id === id);

  if (user) {
    res.json({
      message: 'Test user found',
      data: user
    });
  } else {
    res.status(404).json({ message: 'Test user not found' });
  }
});

module.exports = router;