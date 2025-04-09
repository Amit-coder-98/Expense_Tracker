const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connection = require('./conn');
const expenseModel = require('./models/expense');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Auth routes
app.use('/auth', authRoutes);

// Protected routes
app.post('/add', authenticateToken, async (req, res) => {
  try {
    const expense = new expenseModel({
      ...req.body,
      userId: req.user.id
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense' });
  }
});

app.get('/get', authenticateToken, async (req, res) => {
  try {
    const expenses = await expenseModel.find({ userId: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

app.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await expenseModel.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    await expenseModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense' });
  }
});

app.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await expenseModel.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    await expenseModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});