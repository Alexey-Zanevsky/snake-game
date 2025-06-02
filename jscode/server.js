const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5000;
const config = require('./config');

const app = express();

// app.use(cors({
//   origin: 'http://127.0.0.1:5501',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://127.0.0.1') || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Alexey:${config.password}@cluster0.pnj89vy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}
start();
