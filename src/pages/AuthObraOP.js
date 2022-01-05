import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { GrillaOpAuth } from 'src/components/OP/GrillaOpAuth';

export function AuthObraOP({ idSociety,  loggedUser }) {
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
        <Container >

          <Box sx={{ pt: 3 }}>
            <GrillaOpAuth idSociety={idSociety}  loggedUser={loggedUser} tipo='obra' />
          </Box>
        </Container>
      </Box>
    </>
  );
}