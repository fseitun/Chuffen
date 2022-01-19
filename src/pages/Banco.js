import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormBanco } from 'src/components/banco/FormBanco';
import { GrillaBanco } from 'src/components/banco/GrillaBanco';

export function Banco({ idSociety, loggedUser}) {
  return (
    <>
      <Helmet>
        <title>Banco | {idSociety?.nombre ?? ''}</title>
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
            <FormBanco idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaBanco idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}