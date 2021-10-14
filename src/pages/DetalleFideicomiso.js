import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';
import { Container, Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { DatosPrincipalesFideicomiso } from 'src/components/fideicomiso/DatosPrincipalesFideicomiso';
import { ManipularDetalleFideicomiso } from 'src/components/detalleFideicomiso/ManipularDetalleFideicomiso';
import { GrillaDetalleFideicomiso } from 'src/components/detalleFideicomiso/GrillaDetalleFideicomiso';

export function DetalleFideicomiso({ idSociety }) {
  const { nombreFideicomiso } = useParams();

  const { data } = useQuery(['fideicomiso', idSociety.id], () =>
    getMethod(`fideicomiso/listar/${idSociety.id}`)
  );

  const selectedFideicomisoData = data?.find(el => el.nombre === nombreFideicomiso);

  return (
    <>
      <Helmet>
        <title>{nombreFideicomiso} | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <DatosPrincipalesFideicomiso
              idSociety={idSociety}
              selectedFideicomisoData={selectedFideicomisoData}
            />
          </Box>
          <Box sx={{ pt: 3 }}>
            <Typography align='left' color='textPrimary' variant='h5'>
              Grilla de Productos
            </Typography>
          </Box>
          <Box sx={{ pt: 3 }}>
            <ManipularDetalleFideicomiso
              idSociety={idSociety}
              selectedFideicomisoData={selectedFideicomisoData}
            />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaDetalleFideicomiso />
          </Box>
        </Container>
      </Box>
    </>
  );
}
