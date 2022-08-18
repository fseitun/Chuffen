import { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { PageCobro } from 'src/components/cobro/PageCobro';
import { getMethod } from 'src/utils/api';


export function Cobros({ idSociety, loggedUser, contrato}) {

  const [fideicomisos, setFideicomisos] = useState([]);  
  
  useEffect((idSociety) => {
    let id = idSociety?.id > 0? idSociety.id:JSON.parse(localStorage.getItem("idSociety"))?.id;
    getMethod(`fideicomiso/listarEmpresa/${id}`).then((fide) => setFideicomisos(fide));
  }, []);


  if (!fideicomisos) return <div>Loading...</div>;

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
                  fideicomisos={fideicomisos}
                  idSociety={idSociety}
                  loggedUser={loggedUser}
                  contrato={contrato}
              />
      
        </Container>
      </Box>
    </>
  );
}