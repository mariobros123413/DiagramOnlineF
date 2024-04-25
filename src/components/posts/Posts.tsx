import "./posts.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useUserContext } from "../../UserContext";
const Posts: React.FC = () => {
  const { logout } = useUserContext();

  const localData = window.localStorage.getItem('loggedFocusEvent') !== null ? window.localStorage.getItem('loggedFocusEvent') : null;




  const localDataParsed = localData && localData !== 'null' ? JSON.parse(localData) : null;

  const userData = localDataParsed && Object.keys(localDataParsed).length > 0 ? JSON.parse(localDataParsed.userData) : null;

  const navigate = useNavigate()
  const socket = io('https://diagramonlineb-production.up.railway.app/reunion');

  const [password,] = useState('');

  // Estado para controlar el valor del campo de entrada
  const [codigoReunion, setCodigoReunion] = useState('');
  const [meetingDetails, setMeetingDetails] = useState({
    name: '',
    description: '',
  });


  // Función para manejar el envío del formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Emitir un evento 'crearReunion' con los detalles de la reunión al servidor
      console.log('userData.id : ', userData.id)
      if (userData.id === null || userData.id === undefined) {
        logout();
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/');
      } else {

        socket.emit('crearReunion', {
          usuarioId: userData.id,
          titulo: meetingDetails.name,
          descripcion: meetingDetails.description,
          codigoReunion: codigoReunion,
        });
        console.log('Reunión creando:');


        socket.on('reunionCreada', (data) => {
          // console.log('Reunión creada:', data.diagrama);
          console.log('Reunión creando2: ', data);
          closeModal();
          console.log('datos obtenidos del backend para unirse a reunion : ', data.reunion.id);

          // Redirige a la página de reunión con el ID y el código
          navigate(`/reunion/${data.reunion.id}/${data.codigo}`, {
            state: { diagramaModel: '', tipo: 'nueva', password: data.reunion.password, usuarioId: data.usuarioId },
          });
        });
      }

    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
      console.error('Error al crear la reunión:', error);
    }
  };
  // Función para manejar cambios en el campo de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleEntrarClick = () => {
    if (codigoReunion.trim() !== '') {
      try {
        // Emitir un evento 'entrarReunion' con el código y contraseña al servidor
        socket.emit('unirseReunion', { codigoReunion, password, usuarioId: userData.id });
        socket.on('unirseReunionExitoso', (data) => {
          // console.log('data.diagrama.contenido : ', data);

          // const diagramaData = JSON.parse(data.diagrama.contenido);

          // Redirigir a la página de reunión con el ID y el código
          // navigate(`/reunion/${data.id}/${data.codigo}`); //antes estaba on
          navigate(`/reunion/${data.id}/${data.codigo}`, {
            state: { tipo: 'unirse', usuarioId: userData.id },
          });
        });

      } catch (error) {

        console.error('Error al entrar en la reunión:', error);
      }
    } else {

      console.error('Por favor, ingresa un código de reunión y una contraseña.');
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  // Función para abrir el modal
  const openModal = () => {
    setModalOpen(true);
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
  }
  return (
    <div className="home-container">
      <main>
        <section className="hero">
          <h1>Conexiones Virtuales Simplificadas</h1>
          <p>Descubre una nueva forma de conectar con colegas y amigos, donde sea y cuando sea.</p>

          <button onClick={openModal}>Iniciar una Sala</button>
          <br></br>
          <br></br>

          <p>O únete</p>
          <div className="join-meeting">
            <input
              type="text"
              placeholder="Ingresa el Código de la Sesión"
              value={codigoReunion}
              onChange={(e) => setCodigoReunion(e.target.value)}
            />
            <br></br>
            <br></br>

            <button onClick={handleEntrarClick}>Unirse</button>
          </div>
        </section>
      </main>
      {/* Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Iniciar una reunión</h2>
            {/* Formulario para crear la reunión */}
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={meetingDetails.name}
                onChange={handleInputChange}
                required
              />
              <br></br>
              <label htmlFor="description">Descripción:</label>
              <input
                id="description"
                type="text"
                name="description"
                value={meetingDetails.description}
                onChange={handleInputChange}
                required
              />
              <br></br>
              <button type="submit" >Crear Reunión</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default Posts;
