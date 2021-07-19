import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { ManipularDolar } from 'src/components/dolar/ManipularDolar';
import { GrillaDolar } from '../components/dolar/GrillaDolar';

const queryClient = new QueryClient();

export function Dolar(props) {
  const [selectionModel, setSelectionModel] = useState([]);
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
            <ManipularDolar
              sociedad={props.sociedad}
              selectionModel={selectionModel}
            />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDolar
              sociedad={props.sociedad}
              selectionModel={selectionModel}
              setSelectionModel={setSelectionModel}
            />
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
