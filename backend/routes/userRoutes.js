const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
