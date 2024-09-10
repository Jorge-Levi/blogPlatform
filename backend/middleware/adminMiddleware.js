const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();  // Si el usuario tiene rol de 'admin', continuamos
    } else {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }
};

module.exports = admin;
