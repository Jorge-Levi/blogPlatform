import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();  // Obtener el ID de la publicación desde la URL
    const [post, setPost] = useState(null);
    const navigate = useNavigate();  // Para manejar la redirección

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await API.get(`/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.log('Error al obtener la publicación');
            }
        };
        fetchPost();
    }, [id]);

    if (!post) return <p>Cargando...</p>;

    // Función para regresar a la lista de publicaciones
    const handleBackToPosts = () => {
        navigate('/posts');  // Redirigir a la lista de publicaciones
    };

    return (
        <div className="post-detail-container">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            {/* Asegurarse de acceder correctamente a la propiedad username del objeto author */}
            <p><strong>Autor:</strong> {post.author?.username}</p>
            
            {/* Botón para regresar a la lista de publicaciones */}
            <button onClick={handleBackToPosts} className="back-button">Regresar a publicaciones</button>
        </div>
    );
};

export default PostDetail;
