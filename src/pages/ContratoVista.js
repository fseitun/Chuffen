// *******************************************************************
// *******************************************************************
// *******************************************************************

// ************ Por ahora ni usar ni programa (tal vez sea solo un reporte)

// *******************************************************************
// *******************************************************************
// *******************************************************************

import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
// import { ManipularFideicomiso } from 'src/components/fideicomiso/ManipularFideicomiso';
// import { GrillaFideicomiso } from 'src/components/fideicomiso/GrillaFideicomiso';

export function ContratoVista({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Cuotas | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}></Container>
      </Box>
    </>
  );
}
