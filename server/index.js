const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require("dotenv").config();


const connectDB = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log('Connected to MongoDB database');
  } catch (error) {
      console.log(`Error: ${error.message}`);
      process.exit(1);
  }
};

const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
connectDB();
