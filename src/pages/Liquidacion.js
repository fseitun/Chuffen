import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { TabLiquidacion } from 'src/components/liquidacion/TabLiquidacion';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';

export function Liquidacion({ idSociety, loggedUser}) {


    const { data: fideicomisos } = useQuery(
      ['fideicomisos'],
      () => getMethod(`fideicomiso/listar/${idSociety.id}`));
  
    const { data: fideActivo } = useQuery(
      ['fideActivo'],
      () => getMethod(`contrato/fideicomisos_con_cuotas/${idSociety.id}/ARS`));
  
    const { data: periodos } = useQuery(
        ['periodos'],
        () => getMethod(`contrato/periodos_con_cuotas/${idSociety.id}/0/ARS/pasado`));


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
           <TabLiquidacion 
            
              idSociety={idSociety}
              loggedUser={loggedUser}
              fideActivo={fideActivo}
              fideicomisos={fideicomisos}
              periodos={periodos}
                    
            />
        </Container>
      </Box>


    </>
  );
}