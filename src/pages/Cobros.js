import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
// import { ManipularFideicomiso } from 'src/components/fideicomiso/ManipularFideicomiso';
// import { GrillaFideicomiso } from 'src/components/fideicomiso/GrillaFideicomiso';

export function Cobros({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Cobros | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
        
        </Container>
      </Box>
    </>
  );
}
Cobros.propTypes = {
  idSociedad: PropTypes.number,
};
