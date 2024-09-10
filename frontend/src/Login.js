import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import API from './api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Creamos una instancia de useNavigate

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.post('/users/login', formData);
            localStorage.setItem('token', response.data.token);  // Guardar el token
            setMessage('Inicio de sesión exitoso.');
            navigate('/posts');  // Redirigir a la página de publicaciones
        } catch (error) {
            setMessage('Error en las credenciales.');
        }
        setLoading(false);
    };

    // Nueva función para manejar la redirección a la página de registro
    const handleRegisterRedirect = () => {
        navigate('/register');  // Redirige a la página de registro
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    value={formData.password}
                    className="input-field"
                    required
                />
                <button type="submit" className={`login-button ${loading ? 'loading' : ''}`}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </form>

            {/* Botón para redirigir a la página de registro */}
            <button onClick={handleRegisterRedirect} className="register-button">
                ¿No tienes una cuenta? Regístrate aquí
            </button>

            {message && <p className="login-message">{message}</p>}
        </div>
    );
};

export default Login;
