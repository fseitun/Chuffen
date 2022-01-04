import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { GrillaOP_Auth } from 'src/components/OP/GrillaOP_Auth';

export function AuthAdmOP({ idSociety, loggedUser }) {
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
            <GrillaOP_Auth idSociety={idSociety}  loggedUser={loggedUser} tipo='adm' />
          </Box>
        </Container>
      </Box>
    </>
  );
}