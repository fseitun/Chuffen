import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ResultadoListaDeRubros from 'src/components/rubros/ResultadoListaDeRubros';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar'; // pendiente corregir src

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
          <ResultadoListaDeRubros rubros={1} />
        </Box>
      </Container>
    </Box>
  </>
);

export default ListaDeRubros;
