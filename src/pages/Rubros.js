import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ResultadoListaDeRubros from 'src/components/rubros/ResultadoListaDeRubros';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar'; // pendiente corregir src
import axios from 'axios';

let rubros;
axios.get('http://localhost:3000/rubro/listar/1').then((res) => {
  console.log(res.data);
  rubros = res.data;
});

const ListaDeRubros = () => (
  <>
    <Helmet>
      <title>Rubros | TSF Desarrollos</title>
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
          <ResultadoListaDeRubros rubros={rubros} />
        </Box>
      </Container>
    </Box>
  </>
);

export default ListaDeRubros;
