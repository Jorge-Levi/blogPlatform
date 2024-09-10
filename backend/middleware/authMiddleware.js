const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. No se ha proporcionado un token.' });
    }

    const token = authHeader.split(' ')[1];  // Extraer el token del formato Bearer <token>

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verificar el token con la clave secreta
        req.user = verified;  // Almacenar los datos del usuario autenticado en req.user
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token no válido.' });
    }
};

module.exports = auth;
