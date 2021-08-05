import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { ManipularCac } from 'src/components/cac/ManipularCac';
import { GrillaCac } from 'src/components/cac/GrillaCac';

export function Cac({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>CAC | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularCac idSociedad={idSociedad} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaCac idSociedad={idSociedad} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
Cac.propTypes = {
  idSociedad: PropTypes.number,
};
