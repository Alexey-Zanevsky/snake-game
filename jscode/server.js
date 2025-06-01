const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./authRouter');
// const PORT = process.env.PORT || 5000;
const PORT = 5000;
const config = require('./config');

const app = express();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://snake-livid-two.vercel.app");
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use(cors({
  // stable version
  // origin: 'http://127.0.0.1:5501',
  // 
  // origin: 'https://snake-qlmv7zqyu-alexeys-projects-2c55db20.vercel.app',
  // origin: 'https://snake-livid-two.vercel.app',
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use("/auth", authRouter);

// app.use((req, res, next) => {
//   console.log(`Запрос: ${req.method} ${req.url}, Тело:`, req.body);
//   next();
// });

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Alexey:${config.password}@cluster0.pnj89vy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}
start();
