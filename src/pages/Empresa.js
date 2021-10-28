import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';

import { ManipularEmpresa } from 'src/components/empresa/ManipularEmpresa';
import { GrillaEmpresa } from 'src/components/empresa/GrillaEmpresa';

export function Empresa({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>Empresas | {idSociety?.name ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularEmpresa idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaEmpresa idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
