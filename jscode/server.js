const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/user.js');
const app = express();

app.use(cors());
app.use(express.json());

/**
 * Connect to MongoDb Atlas.
 */
mongoose.connect('mongodb+srv://Alexey:AloxA2003_24@cluster0.mongodb.net/snake-game')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error', err));

// 🔐 JWT secret
const JWT_SECRET = 'snake-secret-key';


// 📌 Registration
app.post('/register', async (req, res) => {
  const { nickname, password } = req.body;

  try {
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nickname, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


// 📌 Login
app.post('/login', async (req, res) => {
  const { nickname, password } = req.body;

  try {
    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Вход выполнен', token });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


app.listen(3000, () => {
  console.log('Сервер работает на http://localhost:3000');
});
