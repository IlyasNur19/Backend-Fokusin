// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Koneksikan ke database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://frontend-fokusin.vercel.app/']
}));
app.use(express.json()); 

// Rute dasar
app.get('/', (req, res) => {
  res.send('API berjalan...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));