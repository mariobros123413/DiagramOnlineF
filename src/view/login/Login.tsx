import "./login.css";
import { Link } from 'react-router-dom';
import api from '../../axiosInstance'; // Importa la instancia de Axios
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    ci: 0,
    contrasena: '',
  });
  const [error, setError] = useState('');
  const history = useNavigate();
  const [, setUser] = useState(null);
  const [, setToken] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/login', formData);
      console.log('Inicio de sesión correctamente:', response.data.user.token);
      const userData = JSON.stringify(response.data.user.usuario);
      console.log("user iniciado : ", userData);
      const token = JSON.stringify(response.data.user.token);

      window.localStorage.setItem('loggedFocusEvent', JSON.stringify({ userData, token }));

      setUser(userData);
      setToken(token);

      history('/');

    } catch (error) {

      console.error('Error al iniciar Sesión:', error);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="login-error">{error}</p>} {/* Muestra el mensaje de error si está configurado */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ci">Número de C.I</label>
            <input
              type="number"
              id="ci"
              placeholder="Ingrese su C.I"
              value={formData.ci}
              onChange={(e) => setFormData({ ...formData, ci: e.target.valueAsNumber })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
            />
          </div>
          <button className="login-button">Iniciar Sesión</button>
        </form>
        <p className="login-register-text">
          ¿No estás registrado? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
