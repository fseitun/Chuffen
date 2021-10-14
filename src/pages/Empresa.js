import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';

import { ManipularEmpresa } from 'src/components/empresa/ManipularEmpresa';
import { GrillaEmpresa } from 'src/components/empresa/GrillaEmpresa';

export function Empresa({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Empresas | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularEmpresa idSociedad={idSociedad} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaEmpresa idSociedad={idSociedad} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
