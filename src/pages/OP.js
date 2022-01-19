import { Container, Box, Hidden } from '@mui/material';
import { Helmet } from 'react-helmet';
import { ManipularOP } from 'src/components/OP/ManipularOP';
import { GrillaOP } from 'src/components/OP/GrillaOP';

export function OP({ idSociety, loggedUser }) {
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
          <Hidden smUp={(loggedUser?.['rol.factura'] ==='vista')} >
            <Box sx={{ pt: 3 }}>
              <ManipularOP idSociety={idSociety}  loggedUser={loggedUser} />
            </Box>
          </Hidden>
          <Box sx={{ pt: 3 }}>
            <GrillaOP idSociety={idSociety}  loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}