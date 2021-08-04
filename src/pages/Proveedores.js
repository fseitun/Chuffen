import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { ManipularProveedores } from 'src/components/proveedores/ManipularProveedores';
import { GrillaProveedores } from 'src/components/proveedores/GrillaProveedores';

const queryClient = new QueryClient();

export function Proveedores({ idSociedad }) {
  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
Proveedores.propTypes = {
  idSociedad: PropTypes.number
};
