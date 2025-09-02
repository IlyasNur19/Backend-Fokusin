// controllers/todoController.js
const Todo = require('../models/Todo');


const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ position: 'asc' });
  res.status(200).json(todos);
};


const createTodo = async (req, res) => {
  const { title, description, dueDate, priority, tags } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Judul tidak boleh kosong' });
  }

  // Logika untuk menentukan posisi: taruh di paling akhir
  const todoCount = await Todo.countDocuments({ user: req.user.id });

  const todo = await Todo.create({
    user: req.user.id,
    title,
    description,
    dueDate,
    priority,
    tags,
    position: todoCount, 
  });

  res.status(201).json(todo);
};


const updateTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo tidak ditemukan' });
  }

  // Pastikan todo ini milik pengguna yang sedang login
  if (todo.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Tidak terotorisasi' });
  }

  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedTodo);
};

// @desc    Menghapus todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo tidak ditemukan' });
  }

  // Pastikan todo ini milik pengguna yang sedang login
  if (todo.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Tidak terotorisasi' });
  }

  await todo.deleteOne(); // Gunakan deleteOne() dari instance Mongoose
  res.status(200).json({ id: req.params.id });
};

const reorderTodos = async (req, res) => {
  // Menerima array of objects: [{ _id: '...', position: 0 }, { _id: '...', position: 1 }]
  const { orderedTodos } = req.body;

  if (!orderedTodos || !Array.isArray(orderedTodos)) {
    return res.status(400).json({ message: 'Data urutan tidak valid' });
  }

  try {
    const promises = orderedTodos.map(todo => 
      Todo.updateOne({ _id: todo._id, user: req.user.id }, { $set: { position: todo.position } })
    );

    await Promise.all(promises);
    res.status(200).json({ message: 'Urutan berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
};
