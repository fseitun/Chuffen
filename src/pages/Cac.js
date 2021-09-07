import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { ManipularCac } from 'src/components/cac/ManipularCac';
import { GrillaCac } from 'src/components/cac/GrillaCac';

export function Cac({ idSociety }) {
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
            <ManipularCac idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaCac idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
Cac.propTypes = {
  idSociety: PropTypes.object,
};
