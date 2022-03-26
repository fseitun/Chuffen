import { Container, Box, Hidden } from '@mui/material';
import { Helmet } from 'react-helmet';

import { FormEmpresa } from 'src/components/empresa/FormEmpresa';
import { GrillaEmpresa } from 'src/components/empresa/GrillaEmpresa';

export function Proveedores({ idSociety, loggedUser }) {

  const tipo = 0; // 1 = Fiduciantes  0 = Proveedores

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
          <Hidden smUp={(loggedUser['rol.proveedor'] ==='vista')} >
            <Box sx={{ pt: 3 }}>
              <FormEmpresa idSociety={idSociety} loggedUser={loggedUser} tipo={tipo} />
            </Box>
          </Hidden> 
          <Box sx={{ pt: 3 }}>
            <GrillaEmpresa idSociety={idSociety} loggedUser={loggedUser} tipo={tipo} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
