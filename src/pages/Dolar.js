import {Container, Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';

import { ManipularDolar } from 'src/components/dolar/ManipularDolar';
import { GrillaDolar } from 'src/components/dolar/GrillaDolar';

export function Dolar({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>Dólar | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularDolar idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDolar idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );}