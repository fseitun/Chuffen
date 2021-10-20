import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';

import { ManipularProveedores } from 'src/components/proveedores/ManipularProveedores';
import { GrillaProveedores } from 'src/components/proveedores/GrillaProveedores';

export function Proveedores({ idSociety }) {
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
            <ManipularProveedores idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaProveedores idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
