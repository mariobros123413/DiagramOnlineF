import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia, { CardMediaProps } from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import io from 'socket.io-client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Footer from '../../components/footer/footer';

interface CustomCardMediaProps extends CardMediaProps {
  svgString: string;
  alt: string;
  title: string;
}
const Write: React.FC = () => {
  const [usuario, setUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate()
  const socket = io('https://diagramonlineb-production.up.railway.app/reunion');

  const localData = window.localStorage.getItem('loggedFocusEvent') !== null ? window.localStorage.getItem('loggedFocusEvent') : null;
  const localDataParsed = localData && localData !== 'null' ? JSON.parse(localData) : null;
  const userData = localDataParsed && Object.keys(localDataParsed).length > 0 ? JSON.parse(localDataParsed.userData) : null;

  useEffect(() => {
    
    if (!userData || (userData.id === null || userData.id === undefined)) {
    
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/'); 
    } else {
      const idUsuario = userData.id;
      console.log(`usuariio : ${userData.nombre}`);
      axios.get(`https://diagramonlineb-production.up.railway.app/reuniones/${idUsuario}/reuniones`)
        .then(response => {
          console.log(response.data);
          setUsuario(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los datos del usuario:', error);
        });
    }

  }, []);
  function SVGImage({ svgString, alt }) {
    const dataURL = `data:image/svg+xml,${encodeURIComponent(svgString)}`;

    return (
      <img src={dataURL} alt={alt} style={{ width: '100%', height: '100%' }} />
    );
  }

  function CustomCardMedia({ svgString, alt, title, ...props }: CustomCardMediaProps) {
    return (
      <CardMedia
        component={() => <SVGImage svgString={svgString} alt={alt} />}
        title={title}
        {...props}
      />
    );
  }


  const handleEntrarClick = (codigo, password) => {
    try {
      // logout();
      // localStorage.removeItem('token');
      // localStorage.removeItem('userData');
      // navigate('/');
      console.log(codigo);
      console.log(password);

      socket.emit('unirseReunion', { codigoReunion: codigo, password: password, usuarioId: usuario.usuarioid });
      socket.on('unirseReunionExitoso', (data) => {
        navigate(`/reunion/${data.id}/${data.codigo}`, {
          state: { tipo: 'unirse', usuarioId: userData.id },
        });
      });
    } catch (error) {
      console.error('Error al entrar en la reunión:', error);
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredReuniones = usuario ? usuario.filter((reunion) => {
    const titleMatch = reunion.diagrama_titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = reunion.diagrama_descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || descriptionMatch;
  }) : [];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Box sx={{ width: '50%', maxWidth: '100%', paddingTop: '30px', margin: '0 auto', textAlign: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Buscar"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
        {/* Renderizar tarjetas de reuniones */}
        {filteredReuniones.map((reunion: any) => (
          <div key={reunion.id} style={{ margin: '15px', transition: 'transform 0.3s' }}>
            <Card sx={{ width: 345, border: '1px solid #085659', borderRadius: '10px', overflow: 'hidden', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CustomCardMedia svgString={reunion.svg} alt="Descripción alternativa de la imagen SVG" title="Título de la imagen" style={{ width: '100%', height: '200px', objectFit: 'cover' }}/>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {reunion.diagrama_titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reunion.diagrama_descripcion}
                </Typography>
              </CardContent>
              <CardActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
                <Button variant="contained" color="primary" size="small" onClick={() => handleEntrarClick(reunion.codigo, reunion.password)}>Entrar</Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>

      <br />
      <br />
      <br />
      <Footer />
    </div>
  );

};

export default Write;
