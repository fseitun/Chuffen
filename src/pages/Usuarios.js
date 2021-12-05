import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';

import { FormUsuario } from 'src/components/usuarios/FormUsuario';
import { GrillaUsuario } from 'src/components/usuarios/GrillaUsuario';

export function Usuarios({ idSociety, loggedUser }) {
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
            <FormUsuario idSociety={idSociety}  loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaUsuario idSociety={idSociety}  loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
