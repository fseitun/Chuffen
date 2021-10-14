import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
import { ManipularPersona } from 'src/components/persona/ManipularPersona';
import { GrillaPersona } from 'src/components/persona/GrillaPersona';

export function Persona({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>Fiduciante | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularPersona idSociedad={idSociedad} />
          </Box>

          <Box sx={{ pt: 3 }}>
            <GrillaPersona idSociedad={idSociedad} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
