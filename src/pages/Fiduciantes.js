
import { Container, Box} from '@mui/material';
import { Helmet } from 'react-helmet';
import { TabFidu } from 'src/components/fiduciante/TabFidu';

export function Fiduciantes({ idSociety, loggedUser }) {

  const tipo = 1; // 1 = Fiduciantes  0 = Proveedores

  return (
    <>
      <Helmet>
        <title>Fiduciantes | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container >
          <Box  sx={{ pt: 3 }}>
            <TabFidu
              idSociety={idSociety}
              loggedUser={loggedUser}
              tipo={tipo}
      
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

