// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo, 
  reorderTodos 
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// Terapkan middleware 'protect' ke semua rute di file ini
router.use(protect);

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.put('/reorder', reorderTodos); 

router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;