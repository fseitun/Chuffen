import { Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormCac } from 'src/components/cac/FormCac';
import { GrillaCac } from 'src/components/cac/GrillaCac';

export function Cac({ idSociety }) {
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
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <FormCac idSociety={idSociety} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaCac idSociety={idSociety} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
