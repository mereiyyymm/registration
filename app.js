const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: '1234',
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Регистрация нового пользователя
app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  // Хэширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Вставка пользователя в базу данных с указанием роли
  const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [username, email, hashedPassword, role];

  try {
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// Вход пользователя
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  // Добавьте логику проверки роли при входе
  // ...

  // После проверки роли, перенаправьте пользователя на соответствующую страницу
  if (role === 'user') {
    res.redirect('/user-welcome');
  } else if (role === 'admin') {
    res.redirect('/admin-welcome');
  } else if (role === 'moderator') {
    res.redirect('/moderator-welcome');
  }
});

// Маршруты для страниц различных ролей
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/user-welcome', (req, res) => {
  res.sendFile(__dirname + '/user-welcome.html');
});

app.get('/admin-welcome', (req, res) => {
  res.sendFile(__dirname + '/admin-welcome.html');
});

app.get('/moderator-welcome', (req, res) => {
  res.sendFile(__dirname + '/moderator-welcome.html');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
