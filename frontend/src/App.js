import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import PostList from './PostList';
import { useState, useEffect } from 'react';

const App = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Obtener el rol del usuario desde el token almacenado en localStorage
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserRole(decodedToken.role);
        }
    }, []);

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/posts" element={<PostList />} />
                    {/* Rutas protegidas para administradores */}
                    {userRole === 'admin' && (
                        <Route path="/admin" element={<h2>Página de administración</h2>} />
                    )}
                    {/* Redirigir si el usuario no es admin */}
                    {userRole !== 'admin' && (
                        <Route path="/admin" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
