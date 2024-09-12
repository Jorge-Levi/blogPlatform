import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Si no hay token, redirigir a la página de inicio de sesión
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Si hay token, renderizar el componente hijo (children)
    return children;
};

export default ProtectedRoute;
