import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';
import { Container, Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { DatosPrincipalesOP } from 'src/components/OP/DatosPrincipalesOP';
import { ManipularDetalleOP } from 'src/components/detalleOP/ManipularDetalleOP';
import { GrillaDetalleOP } from 'src/components/detalleOP/GrillaDetalleOP';

export function DetalleOP({ idSociety }) {
  const { nombreOP } = useParams();

  const { data } = useQuery(['OP', idSociety.id], () =>
    getMethod(`OP/listar/${idSociety.id}`)
  );

  const selectedOPData = data?.find(el => el.nombre === nombreOP);

  return (
    <>
      <Helmet>
        <title>{nombreOP} | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <DatosPrincipalesOP
              idSociety={idSociety}
              selectedOPData={selectedOPData}
            />
          </Box>
          <Box sx={{ pt: 3 }}>
            <Typography align='left' color='textPrimary' variant='h5'>
              Grilla de Productos
            </Typography>
          </Box>
          <Box sx={{ pt: 3 }}>
            <ManipularDetalleOP
              idSociety={idSociety}
              selectedOPData={selectedOPData}
            />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDetalleOP
              idSociety={idSociety}
              selectedOPData={selectedOPData}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}