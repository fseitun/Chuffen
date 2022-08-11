
import { useContext } from 'react';
import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormDolar } from 'src/components/dolar/FormDolar';
import { GrillaDolar } from 'src/components/dolar/GrillaDolar';
import { SocietyContext } from 'src/App';

export function Dolar({loggedUser}) {

  const idSociety = useContext(SocietyContext);

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
            <FormDolar  loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDolar  loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
