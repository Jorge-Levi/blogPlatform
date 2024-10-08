import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';  // Para hacer la solicitud al backend
import './CreatePost.css';  // Para estilos personalizados

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.post('/posts', { title, body });
            setMessage('¡Felicidades! Tu publicación ha sido creada con éxito.');
            setTimeout(() => navigate('/posts'), 2000);  // Redirige a la lista de publicaciones tras 2 segundos
        } catch (error) {
            setMessage('Error al crear la publicación');
        }
        setLoading(false);
    };

    // Función para regresar a la lista de publicaciones
    const handleBackToPosts = () => {
        navigate('/posts');  // Redirigir a la lista de publicaciones
    };

    return (
        <div className="create-post-container">
            <h2>Crear Nueva Publicación</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className="input-field"
                    aria-label="Título de la publicación"
                    required
                />
                <textarea
                    name="body"
                    placeholder="Contenido de la publicación"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    className="textarea-field"
                    aria-label="Contenido de la publicación"
                    required
                ></textarea>
                <button 
                    type="submit" 
                    className={`create-post-button ${loading ? 'loading' : ''}`} 
                    aria-label="Crear Publicación"
                >
                    {loading ? 'Creando...' : 'Crear Publicación'}
                </button>
            </form>
            {message && <p className="create-post-message">{message}</p>}

            {/* Botón para regresar a la lista de publicaciones */}
            <button onClick={handleBackToPosts} className="back-to-posts-button">
                Regresar a Publicaciones
            </button>
        </div>
    );
};

export default CreatePost;
