import { useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormSubRubro } from 'src/components/rubro/FormSubRubro';
import { GrillaSubRubro } from 'src/components/rubro/GrillaSubRubro';

export function SubRubro({ idSociety, loggedUser}) {
  const { idRubro } = useParams();
  console.log("idRubro: " + idRubro);
  const rubro = parseInt(idRubro);
  return (
    <>
      <Helmet>
        <title>SubRubro | {idSociety?.nombre ?? ''}</title>
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
            <FormSubRubro idSociety={idSociety} idRubro={rubro} loggedUser={loggedUser} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaSubRubro idSociety={idSociety} idRubro={rubro} loggedUser={loggedUser} />
          </Box>
        </Container>
      </Box>
    </>
  );
}