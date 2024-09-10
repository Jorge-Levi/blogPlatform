const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // Obtener el token del header de la petición
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    }

    try {
        // Verificar el token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardar los datos del usuario verificado en req.user
        next(); // Continuar al siguiente middleware o ruta
    } catch (error) {
        res.status(400).json({ message: 'Token no válido.' });
    }
}

module.exports = auth;
