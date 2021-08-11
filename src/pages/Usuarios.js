import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { ManipularUsuarios } from 'src/components/usuarios/ManipularUsuarios';
import { GrillaUsuarios } from 'src/components/usuarios/GrillaUsuarios';

export function Usuarios({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Usuarios | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularUsuarios idSociedad={idSociedad} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaUsuarios idSociedad={idSociedad} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
Usuarios.propTypes = {
  idSociedad: PropTypes.number,
};
