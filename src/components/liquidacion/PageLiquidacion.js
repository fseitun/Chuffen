// import { useContext } from 'react';
// import { useState } from 'react';
import { Box, Hidden } from '@mui/material';
import { FormLiquidacion } from 'src/components/liquidacion/FormLiquidacion';
import { GrillaLiquidacion } from 'src/components/liquidacion/GrillaLiquidacion';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';


export function PageLiquidacion({ contratoId, idSociety, loggedUser, contrato, productos, cesion, qCuotasARS, qCuotasUSD}) {

  // var conceptosPago = useContext(ConceptosPagoContext);  
  // var conceptosCuota = useContext(ConceptosCuotaContext);


  var acceso = true;
  if(loggedUser?.['rol.contrato'] ==='vista'){acceso =false}

  const {
    data: liquidaciones,
    isLoading,
    error,
    refetch,
  } = useQuery(['liquidaciones', idSociety], () => getMethod(`liquidacion/listar/${idSociety.id}/0/${contratoId}`));


  return (
    <>

          <Hidden  smUp={!acceso} >
            <Box sx={{ pt: 3 }}>
              <FormLiquidacion
                    
                    loggedUser={loggedUser}
                    contrato={contrato}
                    productos={productos}
                    cesion={cesion}
                    qCuotasARS={qCuotasARS}
                    qCuotasUSD={qCuotasUSD}
                    refetch={refetch}
                    // conceptosPago={conceptosPago}
                    // conceptosCuota={conceptosCuota}
                    
              />
            </Box>
          </Hidden>

          <Box sx={{ pt: 3 }}>                    
            <GrillaLiquidacion
                  // contratoId={contratoId}
                  loggedUser={loggedUser}
                  liquidaciones={liquidaciones}
                  // contrato={contrato}
                  isLoading={isLoading}
                  error={error}
                  refetch={refetch}                      
            />
          </Box>


    </>
  );
}