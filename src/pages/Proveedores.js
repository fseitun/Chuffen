import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';

import { FormProveedor } from 'src/components/proveedores/FormProveedor';
import { GrillaProveedor } from 'src/components/proveedores/GrillaProveedor';

export function Proveedores({ idSociety, loggedUser }) {
  return (
    <>
      <Helmet>
        <title>Proveedores | {idSociety?.nombre ?? ''}</title>
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
            <FormProveedor idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaProveedor idSociety={idSociety} loggedUser={loggedUser}/>
          </Box>
        </Container>
      </Box>
    </>
  );
}
