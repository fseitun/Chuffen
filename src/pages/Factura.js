import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';

import { ManipularFactura } from 'src/components/factura/ManipularFactura';
import { GrillaFactura } from 'src/components/factura/GrillaFactura';

export function Factura({ idSociety , loggedUser}) {
  return (
    <>
      <Helmet>
        <title>Facturas | {idSociety?.nombre ?? ''}</title>
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
            <ManipularFactura idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaFactura idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
