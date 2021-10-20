import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { ManipularOP } from 'src/components/fideicomiso/ManipularOP';
import { GrillaOP } from 'src/components/fideicomiso/GrillaOP';

export function OP({ idSociety }) {
  return (
    <>
      <Helmet>
        <title>OP's | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <ManipularOP idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaOP idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}