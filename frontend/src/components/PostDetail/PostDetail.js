import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();  // Obtener el ID de la publicación desde la URL
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState('');
    const [isAuthor, setIsAuthor] = useState(false);  // Verificar si es el autor del post
    const [isEditing, setIsEditing] = useState(false);  // Estado para saber si estamos en modo edición
    const navigate = useNavigate();  // Para manejar la redirección

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await API.get(`/posts/${id}`);
                setPost(response.data);
                setTitle(response.data.title);  // Inicializamos los inputs con los valores del post
                setBody(response.data.body);

                // Obtener el ID del usuario autenticado desde el token
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    const userId = decodedToken.id;

                    // Verificar si el usuario autenticado es el autor del post
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

    if (!post) return <p>Cargando...</p>;

    // Función para regresar a la lista de publicaciones
    const handleBackToPosts = () => {
        navigate('/posts');  // Redirigir a la lista de publicaciones
    };

    // Función para activar el modo edición
    const handleEditClick = () => {
        setIsEditing(true);  // Cambiar a modo edición
    };

    // Función para guardar los cambios
    const handleSaveChanges = async () => {
        // Verificar si se han hecho cambios en el título o en el cuerpo
        if (title !== post.title || body !== post.body) {
            try {
                const updatedPost = { title, body };  // Solo enviamos el título y el cuerpo que han cambiado
                await API.put(`/posts/${id}`, updatedPost);
                setMessage('Publicación actualizada con éxito');
                setPost({ ...post, title, body });  // Actualizar el estado local del post
                setIsEditing(false);  // Salir del modo edición
            } catch (error) {
                setMessage('Error al actualizar la publicación');
            }
        } else {
            setMessage('No se han realizado cambios en la publicación');
        }
    };

    // Función para eliminar el post
    const handleDelete = async () => {
        try {
            await API.delete(`/posts/${id}`);
            setMessage('Publicación eliminada con éxito');
            navigate('/posts');  // Redirigir a la lista de publicaciones después de eliminar
        } catch (error) {
            setMessage('Error al eliminar la publicación');
        }
    };

    // Función para cambiar la visibilidad del post
    const handleToggleVisibility = async () => {
        try {
            await API.patch(`/posts/${id}/visibility`);
            setMessage(`La visibilidad ha cambiado. Ahora es ${post.isPrivate ? 'público' : 'privado'}`);
            setPost({ ...post, isPrivate: !post.isPrivate });  // Actualizar el estado local del post
        } catch (error) {
            setMessage('Error al cambiar la visibilidad');
        }
    };

    return (
        <div className="post-detail-container">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p><strong>Autor:</strong> {post.author?.username}</p>
            <p><strong>Visibilidad:</strong> {post.isPrivate ? 'Privado' : 'Público'}</p>

            {/* Solo mostrar los botones de edición si es el autor */}
            {isAuthor && (
                <div>
                    {/* Si está en modo edición, mostrar inputs para editar */}
                    {isEditing ? (
                        <div>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Título" 
                            />
                            <textarea 
                                value={body} 
                                onChange={(e) => setBody(e.target.value)} 
                                placeholder="Cuerpo de la publicación" 
                            ></textarea>
                            <button onClick={handleSaveChanges} className="save-button">Guardar Cambios</button>
                        </div>
                    ) : (
                        // Si no está en modo edición, mostrar el botón de editar
                        <button onClick={handleEditClick} className="edit-button">Editar</button>
                    )}
                    <button onClick={handleDelete} className="delete-button">Eliminar</button>
                    <button onClick={handleToggleVisibility} className="visibility-button">
                        {post.isPrivate ? 'Hacer Público' : 'Hacer Privado'}
                    </button>
                </div>
            )}

            {message && <p className="post-message">{message}</p>}

            {/* Botón para regresar a la lista de publicaciones */}
            <button onClick={handleBackToPosts} className="back-button">Regresar a publicaciones</button>
        </div>
    );
};

export default PostDetail;
