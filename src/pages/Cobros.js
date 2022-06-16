import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { PageCobro } from 'src/components/cobro/PageCobro';

export function Cobros({ idSociety, loggedUser, contrato}) {

  

  return (
    <>
      <Helmet>
        <title>Cobros | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
      
              <PageCobro 
                  mode={"cobro"} 
                  idSociety={idSociety}
                  loggedUser={loggedUser}
                  contrato={contrato}
              />
      
        </Container>
      </Box>
    </>
  );
}