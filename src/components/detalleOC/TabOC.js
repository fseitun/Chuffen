// import { useState, useContext } from 'react';
import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
//import { TextField, Typography, Grid, Autocomplete, Hidden, Switch} from '@mui/material';
import { Box, Tab, Hidden} from '@mui/material';
import { FormDetalleOC } from 'src/components/detalleOC/FormDetalleOC';
import { GrillaTareas } from 'src/components/detalleOC/GrillaTareas';
import { GrillaPagos } from 'src/components/detalleOC/GrillaPagos';
// import { SumFacturaContext } from './sumFacturaContext';


export function TabOC({ OCId,  idSociety, loggedUser, formOC, isLoading, error, refetch, totPagosARS, totPagosUSD, totAjusteARS, totAjusteUSD}) {

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  
  let verAgregar = (loggedUser?.['rol.oc'] ==='vista'); // si es vista, no ve boton agregar 

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
          
    <>

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Pesos" value="1" />
                <Tab label="Dolares" value="2" />
                <Tab label="Resumen" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
                  <Hidden  smUp={verAgregar} >
                    <Box sx={{ pt: 3 }}>
                      <FormDetalleOC
                            OCId={OCId}
                            idSociety={idSociety}
                            loggedUser={loggedUser}
                            formOC={formOC}
                            isLoading={isLoading}
                            error={error}
                            refetch={refetch}
                            moneda={'ARS'}
                      />
                    </Box>
                  </Hidden>
                  <Box sx={{ pt: 3 }}>
                    
                    <GrillaTareas
                          OCId={OCId}
                          idSociety={idSociety}
                          loggedUser={loggedUser}
                          formOC={formOC}
                          isLoading={isLoading}
                          error={error}
                          refetch={refetch}
                          totPagos={totPagosARS}
                          totAjuste={totAjusteARS}
                          moneda={'ARS'}
                    />
                  </Box>
                  <Box sx={{ pt: 3 }}>
                    
                    <GrillaPagos
                          OCId={OCId}
                          idSociety={idSociety}
                          loggedUser={loggedUser}
                          formOC={formOC}
                          isLoading={isLoading}
                          error={error}
                          refetch={refetch}
                          totPagos={totPagosARS}
                          totAjuste={totAjusteARS}
                          moneda={'ARS'}
                    />
                  </Box>
            
            </TabPanel>
            <TabPanel value="2">
                <Hidden  smUp={verAgregar} >
                      <Box sx={{ pt: 3 }}>
                        <FormDetalleOC
                              OCId={OCId}
                              idSociety={idSociety}
                              loggedUser={loggedUser}
                              formOC={formOC}
                              isLoading={isLoading}
                              error={error}
                              refetch={refetch}
                              moneda={'USD'}
                        />
                      </Box>
                  </Hidden>
                  <Box sx={{ pt: 3 }}>
                    
                    <GrillaTareas
                          OCId={OCId}
                          idSociety={idSociety}
                          loggedUser={loggedUser}
                          formOC={formOC}
                          isLoading={isLoading}
                          error={error}
                          refetch={refetch}
                          totPagos={totPagosUSD}
                          totAjuste={totAjusteUSD}
                          moneda={'USD'}
                    />
                  </Box>
                  <Box sx={{ pt: 3 }}>
                  <GrillaPagos
                          OCId={OCId}
                          idSociety={idSociety}
                          loggedUser={loggedUser}
                          formOC={formOC}
                          isLoading={isLoading}
                          error={error}
                          refetch={refetch}
                          totPagos={totPagosUSD}
                          totAjuste={totAjusteUSD}
                          moneda={'USD'}
                    />
                  </Box>
            
            
            
            </TabPanel>
            <TabPanel value="3">
              
            </TabPanel>
          </TabContext>                  
    </>   
  );
}
