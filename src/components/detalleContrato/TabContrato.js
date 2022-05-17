import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Hidden} from '@mui/material';
//import { FormDetalleOC } from 'src/components/detalleOC/FormDetalleOC';
import { AltaCuota } from 'src/components/detalleContrato/AltaCuota';
import { GrillaCuota } from 'src/components/detalleContrato/GrillaCuota';
//import { GrillaPagos } from 'src/components/detalleOC/GrillaPagos';


export function TabContrato({ OCId,  idSociety, loggedUser, conceptosCuota, dataContrato, isLoading, error, refetch, moneda, setMoneda, CACs}) {



  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setMoneda(newValue);
  };

  
  let verAgregar = (loggedUser?.['rol.oc'] ==='vista'); // si es vista, no ve boton agregar 

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
          
    <>

          <TabContext value={moneda}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Compromisos en Pesos" value="ARS" />
                <Tab label="Compromisos en Dolares" value="USD" />
                
              </TabList>
            </Box>
            <TabPanel value="ARS">

              <Hidden  smUp={verAgregar} >
                <Box sx={{ pt: 3 }}>
                  <AltaCuota
                        OCId={OCId}
                        idSociety={idSociety}
                        loggedUser={loggedUser}
                        dataContrato={dataContrato}
                        isLoading={isLoading}
                        error={error}
                        refetch={refetch}
                        moneda={'ARS'}
                        conceptosCuota={conceptosCuota}
                  />
                </Box>
              </Hidden>
              <Box sx={{ pt: 3 }}>                    
                <GrillaCuota
                      OCId={OCId}
                      idSociety={idSociety}
                      loggedUser={loggedUser}
                      dataContrato={dataContrato}
                      isLoading={isLoading}
                      error={error}
                      refetch={refetch}
                      conceptosCuota={conceptosCuota}
                      moneda={'ARS'}
                />
              </Box>
                  
            
            </TabPanel>
            <TabPanel value="USD">

              <Hidden  smUp={verAgregar} >
                <Box sx={{ pt: 3 }}>
                  <AltaCuota
                        OCId={OCId}
                        idSociety={idSociety}
                        loggedUser={loggedUser}
                        dataContrato={dataContrato}
                        isLoading={isLoading}
                        error={error}
                        refetch={refetch}
                        moneda={'USD'}
                        conceptosCuota={conceptosCuota}
                  />
                </Box>
              </Hidden>
              <Box sx={{ pt: 3 }}>                    
                <GrillaCuota
                      OCId={OCId}
                      idSociety={idSociety}
                      loggedUser={loggedUser}
                      dataContrato={dataContrato}
                      isLoading={isLoading}
                      error={error}
                      refetch={refetch}
                      conceptosCuota={conceptosCuota}
                      moneda={'USD'}
                />
              </Box>
            
            
            </TabPanel>

          </TabContext>                  
    </>   
  );
}
