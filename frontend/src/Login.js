import React, { useState } from 'react';
import API from './api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/users/login', formData);
            localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
            setMessage('Inicio de sesión exitoso.');
        } catch (error) {
            setMessage('Error en las credenciales.');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    value={formData.password}
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
