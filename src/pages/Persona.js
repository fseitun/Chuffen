import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { ManipularPersona } from 'src/components/persona/ManipularPersona';
import { GrillaPersona } from 'src/components/persona/GrillaPersona';

export function Persona({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Fiduciante | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>

          <Box sx={{ pt: 3 }}>
            <ManipularPersona idSociedad={idSociedad} />
          </Box>

          <Box sx={{ pt: 3 }}>
            <GrillaPersona idSociedad={idSociedad} />
          </Box>
          
          
        </Container>
      </Box>
    </>
  );
}
Persona.propTypes = {
  idSociedad: PropTypes.number,
};
