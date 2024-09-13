import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faEyeSlash, faSave, faArrowLeft,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState('');
    const [isAuthor, setIsAuthor] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await API.get(`/posts/${id}`);
                setPost(response.data);
                setTitle(response.data.title);
                setBody(response.data.body);

                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    const userId = decodedToken.id;

                    if (response.data.author._id === userId) {
                        setIsAuthor(true);
                    }
                }
            } catch (error) {
                console.log('Error al obtener la publicación');
            }
        };
        fetchPost();
    }, [id]);

    // Elimina el mensaje después de 3 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(''); // Limpiar el mensaje después de 3 segundos
            }, 3000);

            // Limpia el temporizador si el componente se desmonta o si cambia el mensaje
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!post) return <p>Cargando...</p>;

    const handleBackToPosts = () => {
        navigate('/posts');
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        if (title !== post.title || body !== post.body) {
            try {
                const updatedPost = { title, body };
                await API.put(`/posts/${id}`, updatedPost);
                setMessage('¡Publicación actualizada con éxito!');
                setPost({ ...post, title, body });
                setIsEditing(false);
            } catch (error) {
                setMessage('Error al actualizar la publicación. Inténtalo de nuevo.');
            }
        } else {
            setMessage('No se realizaron cambios en la publicación.');
        }
    };

    const handleDelete = async () => {
        try {
            await API.delete(`/posts/${id}`);
            setMessage('¡Publicación eliminada con éxito!');
            navigate('/posts');
        } catch (error) {
            setMessage('Error al eliminar la publicación.');
        }
    };

    const handleToggleVisibility = async () => {
        try {
            await API.patch(`/posts/${id}/visibility`);
            setMessage(`Visibilidad actualizada: ahora es ${post.isPrivate ? 'público' : 'privado'}.`);
            setPost({ ...post, isPrivate: !post.isPrivate });
        } catch (error) {
            setMessage('Error al cambiar la visibilidad.');
        }
    };

    return (
        <div className="post-detail-container">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p><strong>Autor:</strong> {post.author?.username}</p>
            <p><strong>Visibilidad:</strong> {post.isPrivate ? 'Privado' : 'Público'}</p>

            {isAuthor && (
                <div>
                    {isEditing ? (
                        <div className="edit-container">
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Título"
                                className="edit-input"
                            />
                            <textarea 
                                value={body} 
                                onChange={(e) => setBody(e.target.value)} 
                                placeholder="Cuerpo de la publicación" 
                                className="edit-textarea"
                            ></textarea>
                            <button onClick={handleSaveChanges} className="save-button">
                                <FontAwesomeIcon icon={faSave} /> Guardar Cambios
                            </button>
                        </div>
                    ) : (
                        <div className="button-group">
                            <button onClick={handleEditClick} className="edit-button">
                                <FontAwesomeIcon icon={faEdit} /> Editar Publicación
                            </button>
                            <button onClick={handleDelete} className="delete-button">
                                <FontAwesomeIcon icon={faTrashAlt} /> Eliminar Publicación
                            </button>
                            <button onClick={handleToggleVisibility} className="visibility-button">
                                <FontAwesomeIcon icon={post.isPrivate ? faEyeSlash : faEye} /> 
                                {post.isPrivate ? 'Hacer Público' : 'Hacer Privado'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {message && <p className="post-message">{message}</p>}

            <button onClick={handleBackToPosts} className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} /> Regresar a publicaciones
            </button>
        </div>
    );
};

export default PostDetail;
