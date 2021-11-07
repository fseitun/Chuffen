import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { GrillaOPObra } from 'src/components/OP/GrillaOPObra';

export function AuthObraOP({ idSociety }) {
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
            <GrillaOPObra idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}