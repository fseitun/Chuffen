import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';

import { ManipularRubros } from 'src/components/rubros/ManipularRubros';
import { GrillaRubros } from 'src/components/rubros/GrillaRubros';

export function Rubros({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>Rubros | {idSociety?.name ?? ''}</title>
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
            <ManipularRubros idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaRubros idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
