import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Para redirección
import API from '../../utils/api';
import './Register.css';  // Para estilos personalizados

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.post('/users/register', formData);
            setMessage('Registro exitoso. Redirigiendo a login...');
            setTimeout(() => navigate('/login'), 2000);  // Redirige tras 2 segundos
        } catch (error) {
            setMessage('Error en el registro. Intenta de nuevo.');
        }
        setLoading(false);
    };

    // Nueva función para manejar la redirección al login
    const handleLoginRedirect = () => {
        navigate('/login');  // Redirige a la página de login
    };

    return (
        <div className="register-container">
            <h2>Regístrate</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    onChange={handleChange}
                    value={formData.username}
                    className="input-field"
                    aria-label="Nombre de usuario"  // Accesibilidad
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    onChange={handleChange}
                    value={formData.email}
                    className="input-field"
                    aria-label="Correo electrónico"  // Accesibilidad
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    value={formData.password}
                    className="input-field"
                    aria-label="Contraseña"  // Accesibilidad
                    required
                />
                <button type="submit" className={`register-button ${loading ? 'loading' : ''}`}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>

            {/* Botón para regresar a la página de login */}
            <button onClick={handleLoginRedirect} className="back-to-login-button">
                Volver al Inicio de Sesión
            </button>

            {message && <p className="register-message">{message}</p>}
        </div>
    );
};

export default Register;
