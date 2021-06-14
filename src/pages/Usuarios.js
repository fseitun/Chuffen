import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ResultadoListaDeUsuarios from 'src/components/usuarios/ResultadoListaDeUsuarios';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar'; // pendiente corregir src
import axios from 'axios';

let usersAxios;
axios.get('http://localhost:3000/usuario/listar/1').then((res) => {
  console.log(res.data);
  usersAxios = res.data;
  console.log(`type Axios ${Array.isArray(usersAxios)}`);
});

// const userFunction = async () => {
//   const response = await fetch('http://localhost:3000/usuario/listar/1');
//   return response.json();
// };

// const users = userFunction();
// console.log(users[0]);
// .then((datos) => {
//   console.log(`datos ${datos}`);
//   return datos;
// });
// console.log(`contenido de users: ${users} es array? ${Array.isArray(users)}`);

const ListaDeUsuarios = () => (
  <>
    <Helmet>
      <title>Usuarios | TSF Desarrollos</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar />
        <Box sx={{ pt: 3 }}>
          <ResultadoListaDeUsuarios users={usersAxios} />
        </Box>
      </Container>
    </Box>
  </>
);

export default ListaDeUsuarios;
