import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await API.post('/users/login', formData);
            localStorage.setItem('token', response.data.token);
            setMessage('Inicio de sesión exitoso.');
            navigate('/posts');
        } catch (error) {
            setMessage('Credenciales incorrectas. Intenta nuevamente.');
        }
        setLoading(false);
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
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

            <button onClick={handleRegisterRedirect} className="register-button">
                ¿No tienes una cuenta? Regístrate aquí
            </button>

            {message && <p className="login-message">{message}</p>}
        </div>
    );
};

export default Login;
