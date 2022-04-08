import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormCategoria } from 'src/components/categoria/FormCategoria';
import { GrillaCategoria } from 'src/components/categoria/GrillaCategoria';

export function Categoria({ idSociety, loggedUser}) {
  return (
    <>
      <Helmet>
        <title>Categoria | {idSociety?.nombre ?? ''}</title>
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
            <FormCategoria idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
          <GrillaCategoria idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}