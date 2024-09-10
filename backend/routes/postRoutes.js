const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Crear nueva publicación (solo para usuarios autenticados)
router.post('/', auth, async (req, res) => {
    const { title, body } = req.body;

    try {
        const post = new Post({
            title,
            body,
            author: req.user.id, // Usar el ID del usuario autenticado
        });
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener todas las publicaciones
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
