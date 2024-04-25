import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../axiosInstance'; // Importa la instancia de Axios
import { useNavigate } from 'react-router-dom';
import "./register.css";
import { useUserContext } from '../../UserContext';

const Register = () => {
  const navigate = useNavigate();
  const [, setUser] = useState(null);
  const [, setToken] = useState(null);
  const [formData, setFormData] = useState({
    ci: 0,
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: 0,
    contrasena: '',
  });
  const [, setError] = useState('');
  const { setAuthenticated } = useUserContext();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/register', formData);
      console.log('Usuario registrado correctamente:', response.data);


      const userData = JSON.stringify(response.data.user.usuario);
      const token = JSON.stringify(response.data.user.token);
      // Almacena la información del usuario en el estado local
      setUser(userData);
      setToken(token);

      window.localStorage.setItem('loggedFocusEvent', JSON.stringify({ userData, token }));
      setAuthenticated(true);

      navigate('/');

    } catch (error) {
      console.error('Error al iniciar Sesión:', error);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Registro de Nuevo Usuario</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ci">Número de C.I</label>
            <input
              className="register-input"
              type="number"
              placeholder="Ingrese su C.I"
              value={formData.ci}
              onChange={(e) => setFormData({ ...formData, ci: e.target.valueAsNumber })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              className="register-input"
              type="text"
              placeholder="Ingrese su Nombre Completo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellidos</label>
            <input
              className="register-input"
              type="text"
              placeholder="Ingrese su Apellido Completo"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              className="register-input"
              type="text"
              placeholder="Ingrese su dirección de domicilio"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Número de Celular</label>
            <input
              className="register-input"
              type="number"
              placeholder="Ingrese su número de celular"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.valueAsNumber })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              className="register-input"
              type="password"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
            />
          </div>
          <button className="register-button">Registrar</button>
        </form>
        <p className="register-login-text">
          Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
