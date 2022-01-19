import { useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormCuentaBanco } from 'src/components/banco/FormCuentaBanco';
import { GrillaCuentaBanco } from 'src/components/banco/GrillaCuentaBanco';

export function CuentaBanco({ idSociety, loggedUser}) {
  const { idRubro } = useParams();
  const rubro = parseInt(idRubro);
  return (
    <>
      <Helmet>
        <title>CuentaBanco | {idSociety?.nombre ?? ''}</title>
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
            <FormCuentaBanco idSociety={idSociety} idRubro={rubro} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaCuentaBanco idSociety={idSociety} idRubro={rubro} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}