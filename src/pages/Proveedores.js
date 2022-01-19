import { Container, Box, Hidden } from '@mui/material';
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
          <Hidden smUp={(loggedUser?.['rol.factura'] ==='vista')} >
            <Box sx={{ pt: 3 }}>
              <FormProveedor idSociety={idSociety} loggedUser={loggedUser} />
            </Box>
          </Hidden> 
          <Box sx={{ pt: 3 }}>
            <GrillaProveedor idSociety={idSociety} loggedUser={loggedUser}/>
          </Box>
        </Container>
      </Box>
    </>
  );
}
