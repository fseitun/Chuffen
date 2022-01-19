import { Container, Box, Hidden } from '@mui/material';
import { Helmet } from 'react-helmet';

import { FormFactura } from 'src/components/factura/FormFactura';
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
          <Hidden smUp={(loggedUser?.['rol.factura'] ==='vista')} >
          <Box sx={{ pt: 3 }} >
            <FormFactura idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          </Hidden> 
          <Box sx={{ pt: 3 }}>
            <GrillaFactura idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
