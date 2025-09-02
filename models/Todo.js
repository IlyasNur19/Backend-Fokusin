// models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Referensi ke model User
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dueDate: { // Tanggal jatuh tempo
    type: Date,
    default: null,
  },
  priority: { // Prioritas
    type: String,
    enum: ['Rendah', 'Sedang', 'Tinggi'],
    default: 'Sedang',
  },
  tags: [{ type: String }], // Kategori/Tags
  position: { // Posisi untuk drag-and-drop
    type: Number,
    required: true,
  },
  parent: { // Untuk subtask
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Todo', todoSchema);