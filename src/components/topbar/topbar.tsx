import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import './topbar.css';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
  const navigate = useNavigate();

  const localData = window.localStorage.getItem('loggedFocusEvent') || null;
  const isLoggedIn = localData !== null && Object.keys(localData).length !== 0;

  const localDataParsed = localData && localData !== 'null' ? JSON.parse(localData) : null;
  const userData = localDataParsed && Object.keys(localDataParsed).length > 0 ? JSON.parse(localDataParsed.userData) : null;

  const handleLogout = () => {
    window.localStorage.removeItem('loggedFocusEvent');
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <div className="top">
      <div className="topLeft">
        <Link className="link" to="/">
          <img className="logo" src="https://scontent.fvvi1-1.fna.fbcdn.net/v/t1.15752-9/436765365_756754019641337_2151670818439115044_n.png?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fzd2BWE1iJkQ7kNvgHxOh5U&_nc_ht=scontent.fvvi1-1.fna&oh=03_Q7cD1QEVXOKYe9aGmzC2odSaEs4tLLqiVr5CDIWAZDgnpL6i3g&oe=66514835" alt="Your Logo"
            style={{ maxWidth: '150px', maxHeight: '50px' }} // Ajusta estos valores según tus preferencias

          />
        </Link>
      </div>
      <div className="topRight">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">
              Inicio
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/diagramas">
              Tus Diagramas
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/sobre-mi">
              Sobre Mí
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/contacto">
              Contáctame
            </Link>
          </li>
        </ul>

        <div className="userSection">
          {isLoggedIn ? (
            <div className="loggedInUser">
              {userData && (
                <div className="userInfo">
                  <p>{userData.nombre} {userData.apellido}</p>
                  <img
                    className="topImg" style={{ marginTop: '17px' }}
                    src="https://w7.pngwing.com/pngs/312/283/png-transparent-man-s-face-avatar-computer-icons-user-profile-business-user-avatar-blue-face-heroes-thumbnail.png"
                    alt=""
                  />
                </div>
              )}
              <Button variant="outlined" className="logoutButton" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <div className="loginButtons">
              <Button variant="contained" className="loginButton" component={Link} to="/login">
                Iniciar Sesión
              </Button>
              <Button variant="contained" className="registerButton" component={Link} to="/register">
                Crear Cuenta
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;

