const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

// Crear nueva publicación (solo para usuarios autenticados)
router.post('/', auth, async (req, res) => {
    const { title, body } = req.body;

    try {
        const post = new Post({
            title,
            body,
            author: req.user.id,  // Usar el ID del usuario autenticado
        });
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener todas las publicaciones
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;  // El ID del usuario autenticado
        // Obtener publicaciones que sean públicas o que pertenezcan al usuario autenticado
        const posts = await Post.find({
            $or: [
                { isPrivate: false },  // Publicaciones públicas
                { author: userId }  // Publicaciones del usuario autenticado
            ]
        }).populate('author', 'username');
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener una publicación específica por ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Editar una publicación (solo el autor)
router.put('/:id', auth, async (req, res) => {
    const { title, body } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
        }

        post.title = title || post.title;
        post.body = body || post.body;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error al editar la publicación' });
    }
});

// Eliminar publicación (solo el autor o administradores)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
        }

        // Usar deleteOne en lugar de remove
        await Post.deleteOne({ _id: req.params.id });
        res.json({ message: 'Publicación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la publicación' });
    }
});



// Cambiar visibilidad de la publicación (Público/Privado)
router.patch('/:id/visibility', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para cambiar la visibilidad de esta publicación' });
        }

        post.isPrivate = !post.isPrivate;
        await post.save();
        res.status(200).json({ message: `La publicación es ahora ${post.isPrivate ? 'privada' : 'pública'}` });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la visibilidad' });
    }
});

module.exports = router;
