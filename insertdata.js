const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Define the Debt schema
const debtSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  dueDate: Date,
  creditor: String
});

const Debt = mongoose.model('Debts', debtSchema);

// Sample data
const sampleDebts = [
  {
    description: "Car Loan",
    amount: 5000,
    dueDate: new Date("2023-12-31"),
    creditor: "Bank XYZ"
  },
  {
    description: "Student Loan",
    amount: 15000,
    dueDate: new Date("2024-05-15"),
    creditor: "Federal Student Aid"
  },
  {
    description: "Credit Card Debt",
    amount: 2000,
    dueDate: new Date("2023-08-01"),
    creditor: "Visa"
  }
];

// Function to insert sample data
async function insertSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Insert the sample data
    const result = await Debt.insertMany(sampleDebts);
    console.log(`${result.length} documents inserted`);

    // Optional: Fetch and display all debts
    const allDebts = await Debt.find();
    console.log('All debts:', allDebts);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
insertSampleData();
