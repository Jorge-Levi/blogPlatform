import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import './PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [otherPosts, setOtherPosts] = useState([]);
    const navigate = useNavigate();  // Para manejar la redirección

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await API.get('/posts');
                const allPosts = response.data;

                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    const userId = decodedToken.id;

                    // Separar "Mis Posts" y "Posts de los demás"
                    const myPosts = allPosts.filter(post => post.author._id === userId);
                    const otherPosts = allPosts.filter(post => post.author._id !== userId);

                    setMyPosts(myPosts);
                    setOtherPosts(otherPosts);
                } else {
                    setOtherPosts(allPosts);  // Si no hay token, todos son "Posts de los demás"
                }
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

    // Función para redirigir a la página de detalles de la publicación
    const handleReadMore = (postId) => {
        navigate(`/posts/${postId}`);  // Redirigir a la página de detalles usando el ID del post
    };

    return (
        <div className="post-list-container">
            <h2>Mis Publicaciones</h2>
            {myPosts.length === 0 ? (
                <p>No has creado ninguna publicación.</p>
            ) : (
                <div className="posts-grid">
                    {myPosts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.title}</h3>
                            <p>{post.body.slice(0, 100)}...</p>
                            <button
                                className="read-more-button"
                                onClick={() => handleReadMore(post._id)}  // Redirigir al hacer clic en "Leer Más"
                            >
                                Leer más
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <h2>Publicaciones de Otros Usuarios</h2>
            {otherPosts.length === 0 ? (
                <p>No hay publicaciones de otros usuarios.</p>
            ) : (
                <div className="posts-grid">
                    {otherPosts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.title}</h3>
                            <p>{post.body.slice(0, 100)}...</p>
                            <p><strong>Autor:</strong> {post.author?.username || 'Anónimo'}</p>
                            <button
                                className="read-more-button"
                                onClick={() => handleReadMore(post._id)}  // Redirigir al hacer clic en "Leer Más"
                            >
                                Leer más
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón de cerrar sesión */}
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
    );
};

export default PostList;
