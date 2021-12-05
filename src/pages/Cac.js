
  
import { Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet';

import { FormCac } from 'src/components/cac/FormCac';
import { GrillaCac } from 'src/components/cac/GrillaCac';

export function Cac({ idSociety, loggedUser }) {
  return (
    <>
      <Helmet>
        <title>CAC | {idSociety?.nombre ?? ''}</title>
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
            <FormCac idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaCac idSociety={idSociety} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}