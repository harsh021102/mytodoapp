const express = require('express');
const app = express();
const cors = require("cors");
const connectDB = require('./db/connect');
const tasks = require('./routes/tasks');
require('dotenv').config();

app.use(cors()); 
app.use(express.json())

//routes
app.use('/api/v1/tasks', tasks);


const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();