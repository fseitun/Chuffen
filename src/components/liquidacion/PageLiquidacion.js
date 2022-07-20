import { useState } from 'react';
import { Box, Hidden } from '@mui/material';
import { FormLiquidacion } from 'src/components/liquidacion/FormLiquidacion';
import { FiltroLiquidacion } from 'src/components/liquidacion/FiltroLiquidacion';
import { GrillaLiquidacion } from 'src/components/liquidacion/GrillaLiquidacion';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';


export function PageLiquidacion({ modo, contratoId, idSociety, loggedUser, contrato, productos, cesion, qCuotasARS, qCuotasUSD}) {

  const { data: fideActivo } = useQuery(
    ['fideActivo'],
    () => getMethod(`contrato/fideicomisos_con_cuotas/${idSociety.id}/ARS`));

  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listar/${idSociety.id}`));

  const { data: periodos } = useQuery(
      ['periodos'],
      () => getMethod(`contrato/periodos_con_cuotas/${idSociety.id}/0/ARS/pasado`));

  const { data: contratos} = useQuery(
    ['contratos'], 
    () => getMethod(`contrato/listarCombo/${idSociety.id}/0`));

  const [filtFide, setFiltFide] = useState(-1);
  const [filtContrato, setFiltContrato] = useState(-1);
  const [filtPeriodo, setFiltPeriodo] = useState(-1); 

  var acceso = true;
  if(loggedUser?.['rol.contrato'] ==='vista'){acceso =false}

  const {
    data: liquidaciones,
    isLoading,
    error,
    refetch,
  } = useQuery(['liquidaciones', idSociety], () => getMethod(`liquidacion/listar/${idSociety.id}/0/${contratoId}`));

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

    return (
    <>

          <Hidden  smUp={!acceso || modo==='liqui'} >
            <Box sx={{ pt: 3 }}>
              <FormLiquidacion
                modo={modo}
                loggedUser={loggedUser}
                contrato={contrato}
                productos={productos}
                cesion={cesion}
                qCuotasARS={qCuotasARS}
                qCuotasUSD={qCuotasUSD}
                refetch={refetch}                    
              />
            </Box>
          </Hidden>

          <Box sx={{ pt: 3 }}>
              <FiltroLiquidacion
                modo={modo}
                loggedUser={loggedUser}      
                setFiltFide={setFiltFide}
                setFiltContrato={setFiltContrato}
                setFiltPeriodo={setFiltPeriodo}
                fideicomisos={fideicomisos?.filter((itemA)=> {return fideActivo?.find((itemB)=> {return itemA?.id === itemB?.fideicomisoId;})})}
                contratos={contratos}
                periodos={periodos}                    
              />
            </Box>

          <Box sx={{ pt: 3 }}>                    
            <GrillaLiquidacion
                modo={modo}
                filtFide={filtFide}
                filtContrato={filtContrato}
                filtPeriodo={filtPeriodo}
                contratoId={contratoId}
                loggedUser={loggedUser}
                liquidaciones={liquidaciones}
                contrato={contrato}
                fideicomisos={fideicomisos}
                contratos={contratos}
                isLoading={isLoading}
                error={error}
                refetch={refetch}                      
            />
          </Box>


    </>
  );
}