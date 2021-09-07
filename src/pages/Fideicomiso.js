import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { ManipularFideicomiso } from 'src/components/fideicomiso/ManipularFideicomiso';
import { GrillaFideicomiso } from 'src/components/fideicomiso/GrillaFideicomiso';

export function Fideicomiso({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>Fideicomisos | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularFideicomiso idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaFideicomiso idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
Fideicomiso.propTypes = {
  idSociety: PropTypes.object,
};
