import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';

import { FormUsuarios } from 'src/components/usuarios/FormUsuarios';
import { GrillaUsuarios } from 'src/components/usuarios/GrillaUsuarios';

export function Usuarios({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>Usuarios | {idSociety?.nombre ?? ''}</title>
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
            <FormUsuarios idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaUsuarios idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
