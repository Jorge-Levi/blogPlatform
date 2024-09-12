import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import PostList from './components/PostList/PostList';
import CreatePost from './components/CreatePost/CreatePost';
import PostDetail from './components/PostDetail/PostDetail';
import ProtectedRoute from './routes/ProtectedRoute';  // Importamos el componente de rutas protegidas

const App = () => {
    const [userRole, setUserRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Nuevo estado para autenticación

    useEffect(() => {
        // Obtener el rol del usuario desde el token almacenado en localStorage
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserRole(decodedToken.role);
            setIsAuthenticated(true); // El usuario está autenticado si tiene un token
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Redirección en la ruta raíz */}
                <Route 
                    path="/" 
                    element={isAuthenticated ? <Navigate to="/posts" /> : <Navigate to="/login" />} 
                />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas */}
                <Route 
                    path="/posts" 
                    element={
                        <ProtectedRoute>
                            <PostList />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/create-post" 
                    element={
                        <ProtectedRoute>
                            <CreatePost />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/posts/:id" 
                    element={
                        <ProtectedRoute>
                            <PostDetail />
                        </ProtectedRoute>
                    } 
                />

                {/* Rutas protegidas para administradores */}
                {userRole === 'admin' ? (
                    <Route path="/admin" element={<h2>Página de administración</h2>} />
                ) : (
                    <Route path="/admin" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </Router>
    );
};

export default App;
