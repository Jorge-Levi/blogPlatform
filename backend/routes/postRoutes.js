const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Crear nueva publicación
router.post('/', async (req, res) => {
    const { title, body, authorId } = req.body;

    try {
        const author = await User.findById(authorId);
        if (!author) {
            return res.status(400).json({ message: 'Autor no encontrado' });
        }

        const post = new Post({ title, body, author: authorId });
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
