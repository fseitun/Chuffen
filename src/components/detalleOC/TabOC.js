import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Hidden} from '@mui/material';
import { FormDetalleOC } from 'src/components/detalleOC/FormDetalleOC';
import { AltaDetalleOC } from 'src/components/detalleOC/AltaDetalleOC';
import { GrillaTareas } from 'src/components/detalleOC/GrillaTareas';
import { GrillaPagos } from 'src/components/detalleOC/GrillaPagos';


export function TabOC({ OCId,  idSociety, loggedUser, formOC, isLoading, error, refetch, totPagosARS, totPagosUSD, totAjusteARS, totAjusteUSD, moneda, setMoneda, CACs}) {

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
                <Tab label="Pesos" value="ARS" />
                <Tab label="Dolares" value="USD" />
                
              </TabList>
            </Box>
            <TabPanel value="ARS">
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

                  <Hidden  smUp={verAgregar} >
                    <Box sx={{ pt: 3 }}>
                      <AltaDetalleOC
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
                          CACs={CACs}
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
                          CACs={CACs}
                    />
                  </Box>
            
            </TabPanel>
            <TabPanel value="USD">
                <Hidden  smUp={verAgregar} >
                      <Box sx={{ pt: 3 }}>
                        <AltaDetalleOC
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
                          CACs={CACs}
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

          </TabContext>                  
    </>   
  );
}
