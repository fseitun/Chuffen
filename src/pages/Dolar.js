import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { ManipularDolar } from 'src/components/dolar/ManipularDolar';
import { GrillaDolar } from 'src/components/dolar/GrillaDolar';

export function Dolar({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Dólar | TSF Desarrollos</title>
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
            <ManipularDolar idSociedad={idSociedad} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDolar idSociedad={idSociedad} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
Dolar.propTypes = {
  idSociedad: PropTypes.number
};
