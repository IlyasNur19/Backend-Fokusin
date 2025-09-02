// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Dapatkan data pengguna dari token (tanpa password) dan sisipkan ke object request
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Lanjutkan ke controller selanjutnya
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Tidak terotorisasi, token gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token' });
  }
};

module.exports = { protect };