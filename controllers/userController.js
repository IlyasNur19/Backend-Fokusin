// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fungsi untuk membuat JSON Web Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token berlaku selama 30 hari
  });
};

// @desc    Mendaftarkan pengguna baru
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validasi input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Harap isi semua field' });
  }

  // 2. Cek apakah pengguna sudah ada
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Pengguna sudah terdaftar' });
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Buat pengguna baru
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 5. Kirim respons jika berhasil
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Data pengguna tidak valid' });
  }
};

// @desc    Login pengguna
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Cari pengguna berdasarkan email
  const user = await User.findOne({ email });

  // 2. Cek pengguna dan bandingkan password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Email atau password salah' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};