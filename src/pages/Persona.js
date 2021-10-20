import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
import { ManipularPersona } from 'src/components/persona/ManipularPersona';
import { GrillaPersona } from 'src/components/persona/GrillaPersona';

export function Persona({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>Fiduciante | {idSociety?.nombre ?? ''}</title>
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
            <ManipularPersona idSociety={idSociety} />
          </Box>

          <Box sx={{ pt: 3 }}>
            <GrillaPersona idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
