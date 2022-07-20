import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { PageLiquidacion } from 'src/components/liquidacion/PageLiquidacion';

export function Liquidacion({ idSociety, loggedUser}) {
  return (
    <>
      <Helmet>
        <title>Rubro | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      


      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
           <PageLiquidacion 
                    
                    modo={'liqui'}
                    idSociety={idSociety}
                    loggedUser={loggedUser}
                    
            />
        </Container>
      </Box>


    </>
  );
}