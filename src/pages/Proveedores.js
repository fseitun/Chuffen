import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { ManipularProveedores } from 'src/components/proveedores/ManipularProveedores';
import { GrillaProveedores } from 'src/components/proveedores/GrillaProveedores';

export function Proveedores({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Proveedores | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularProveedores idSociedad={idSociedad} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaProveedores idSociedad={idSociedad} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
Proveedores.propTypes = {
  idSociedad: PropTypes.number
};
