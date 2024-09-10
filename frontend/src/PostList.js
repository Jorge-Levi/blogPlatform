import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import './PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();  // Para manejar la redirección al cerrar sesión

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await API.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.log('Error al obtener las publicaciones');
            }
        };
        fetchPosts();
    }, []);

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');  // Eliminar el token JWT
        navigate('/login');  // Redirigir a la página de inicio de sesión
    };

    return (
        <div className="post-list-container">
            <h2>Publicaciones</h2>
            {/* Botón de cerrar sesión */}
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>

            {posts.length === 0 ? (
                <p>No hay publicaciones disponibles.</p>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.title}</h3>
                            <p>{post.body.slice(0, 100)}...</p>
                            <button className="read-more-button">Leer más</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
