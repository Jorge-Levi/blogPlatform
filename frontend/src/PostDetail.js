import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from './api';
import './PostDetail.css';  // Para agregar estilos personalizados

const PostDetail = () => {
    const { id } = useParams();  // Obtener el ID de la publicación desde la URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await API.get(`/posts/${id}`);
                setPost(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error al cargar la publicación');
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="post-detail-container">
            {post && (
                <>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <p><strong>Autor:</strong> {post.author.username}</p>
                </>
            )}
        </div>
    );
};

export default PostDetail;
