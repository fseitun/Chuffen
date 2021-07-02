import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { CargarDolar } from 'src/components/dolar/CargarDolar';
import { TiposDeCambio } from '../components/dolar/TiposDeCambio';

const queryClient = new QueryClient();

export function Dolar(props) {
  return (
    <QueryClientProvider client={queryClient}>
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
            <CargarDolar sociedad={props.sociedad} queryClient={queryClient} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <TiposDeCambio sociedad={props.sociedad} />
          </Box>
        </Container>
      </Box>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
Dolar.propTypes = {
  sociedad: PropTypes.number
};
