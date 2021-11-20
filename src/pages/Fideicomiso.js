import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { ManipularFideicomiso } from 'src/components/fideicomiso/ManipularFideicomiso';
import { GrillaFideicomiso } from 'src/components/fideicomiso/GrillaFideicomiso';

export function Fideicomiso({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>Fideicomisos | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container >
          <Box sx={{ pt: 3 }}>
            <ManipularFideicomiso idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaFideicomiso idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
