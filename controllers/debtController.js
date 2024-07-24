const Debt = require('../models/Debt');

const getAllDebts = async (req, res) => {
  try {
    const debts = await Debt.find();
    res.json(debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDebt = async (req, res) => {
  const debt = new Debt({
    description: req.body.description,
    amount: req.body.amount,
    dueDate: req.body.dueDate,
    creditor: req.body.creditor
  });

  try {
    const newDebt = await debt.save();
    res.status(201).json(newDebt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (debt == null) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    res.json(debt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (debt == null) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    
    if (req.body.description != null) {
      debt.description = req.body.description;
    }
    if (req.body.amount != null) {
      debt.amount = req.body.amount;
    }
    if (req.body.dueDate != null) {
      debt.dueDate = req.body.dueDate;
    }
    if (req.body.creditor != null) {
      debt.creditor = req.body.creditor;
    }

    const updatedDebt = await debt.save();
    res.json(updatedDebt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (debt == null) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    await debt.remove();
    res.json({ message: 'Debt deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllDebts,
  createDebt,
  getDebt,
  updateDebt,
  deleteDebt
};
