import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { GrillaOPAdm } from 'src/components/OP/GrillaOPAdm';

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
        <Container maxWidth={false}>

          <Box sx={{ pt: 3 }}>
            <GrillaOPAdm idSociety={idSociety}  loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}