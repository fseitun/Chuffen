import {Container, Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormFideicomiso } from 'src/components/fideicomiso/FormFideicomiso';
import { ManipularDetalleFideicomiso } from 'src/components/detalleFideicomiso/ManipularDetalleFideicomiso';
import { GrillaDetalleFideicomiso } from 'src/components/detalleFideicomiso/GrillaDetalleFideicomiso';

export function DetalleFideicomiso({ idSociedad }) {
  return (
    <>
      <Helmet>
        <title>DetalleFideicomiso | TSF Desarrollos</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <Typography align='left' color='textPrimary' variant='h3'>
              Barlovento
            </Typography>
          </Box>
          <Box sx={{ pt: 3 }}>
            <FormFideicomiso />
          </Box>
          <Box sx={{ pt: 3 }}>
            <Typography align='left' color='textPrimary' variant='h5'>
              Grilla de Productos
            </Typography>
          </Box>
          <Box sx={{ pt: 3 }}>
            <ManipularDetalleFideicomiso />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDetalleFideicomiso />
          </Box>
        </Container>
      </Box>
    </>
  );
}
