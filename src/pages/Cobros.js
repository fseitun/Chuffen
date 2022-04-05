import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormRubro } from 'src/components/rubro/FormRubro';
import { GrillaRubro } from 'src/components/rubro/GrillaRubro';

export function Cobros({ idSociety, loggedUser}) {
  return (
    <>
      <Helmet>
        <title>Rubro | {idSociety?.nombre ?? ''}</title>
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
            <FormRubro idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaRubro idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}