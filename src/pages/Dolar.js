import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { ManipularDolar } from 'src/components/dolar/ManipularDolar';
import { GrillaDolar } from 'src/components/dolar/GrillaDolar';

const queryClient = new QueryClient();

export function Dolar({ idSociedad }) {
  const [selectedRows, setSelectedRows] = useState([]);
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
            <ManipularDolar idSociedad={idSociedad} selectedRows={selectedRows} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDolar
              idSociedad={idSociedad}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </Box>
        </Container>
      </Box>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
Dolar.propTypes = {
  idSociedad: PropTypes.number
};
