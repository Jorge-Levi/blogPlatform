import React, { useState } from 'react';
import API from './api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await API.post('/users/register', formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error al registrar el usuario.');
        }
    };

    return (
        <div>
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    onChange={handleChange}
                    value={formData.username}
                />
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
                <button type="submit">Registrarse</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
