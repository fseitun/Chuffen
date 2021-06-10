import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ResultadoListaDeUsuarios from 'src/components/usuarios/ResultadoListaDeUsuarios';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar'; // pendiente corregir src
import axios from 'axios';

let users;
axios.get('http://localhost:3000/usuario/listar/1').then((res) => {
  console.log(res.data);
  users = res.data;
});

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
          <ResultadoListaDeUsuarios users={users} />
        </Box>
      </Container>
    </Box>
  </>
);

export default ListaDeUsuarios;
