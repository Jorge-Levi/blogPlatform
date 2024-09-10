import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Para redirigir
import API from './api';
import './PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();  // Usamos navigate para redirigir

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

    return (
        <div className="post-list-container">
            <h2>Publicaciones</h2>
            {posts.length === 0 ? (
                <div className="empty-state">
                    <p>No hay publicaciones disponibles.</p>
                    <button className="create-post-button" onClick={() => navigate('/create-post')}>
                        Crear una nueva publicación
                    </button>
                </div>
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
