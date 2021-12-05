import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormDolar } from 'src/components/dolar/FormDolar';
import { GrillaDolar } from 'src/components/dolar/GrillaDolar';

export function Dolar({ idSociety, loggedUser }) {
  return (
    <>
      <Helmet>
        <title>Dólar | {idSociety?.nombre ?? ''}</title>
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
            <FormDolar idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDolar idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
