import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Container, Hidden} from '@mui/material';
import { FormEmpresa } from 'src/components/empresa/FormEmpresa';
import { GrillaEmpresa } from 'src/components/empresa/GrillaEmpresa';
import { FormPersona } from 'src/components/fiduciante/FormPersona';
import { GrillaPersona } from 'src/components/fiduciante/GrillaPersona';
import { useQuery} from 'react-query';
import { getMethod } from 'src/utils/api';

export function TabFidu({ idSociety, loggedUser, tipo }) {
  
  const {
    data: empresaInformation,
    isLoading,
    error,
  } = useQuery(['empresa', idSociety], () => getMethod(`empresa/listar/${idSociety.id}/${tipo}`));

  
  const [activeTab, setTab] = React.useState('Personas');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };  

  return (
          
    <>

          <TabContext value={activeTab}>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Personas" value="Personas" />
                <Tab label="Empresas" value="Empresas" />
                
              </TabList>
            </Box>
            <TabPanel value="Personas">  

              <Box
                  sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    py: 3,
                  }}
                >
                  <Container maxWidth={false}>
                    <Hidden smUp={(loggedUser['rol.fidu'] ==='vista')} >
                      <Box sx={{ pt: 3 }}>
                        <FormPersona idSociety={idSociety} loggedUser={loggedUser} />
                      </Box>
                    </Hidden> 
                    <Box sx={{ pt: 3 }}>
                      <GrillaPersona idSociety={idSociety} loggedUser={loggedUser} />
                    </Box>
                  </Container>
                </Box>   

            

            
            </TabPanel>

            <TabPanel value="Empresas">

              <Box
                sx={{
                  backgroundColor: 'background.default',
                  minHeight: '100%',
                  py: 3,
                }}
              >
                <Container maxWidth={false}>
                  <Hidden smUp={(loggedUser['rol.fidu'] ==='vista')} >
                    <Box sx={{ pt: 3 }}>
                      <FormEmpresa idSociety={idSociety} loggedUser={loggedUser} tipo={tipo} />
                    </Box>
                  </Hidden> 
                  <Box sx={{ pt: 3 }}>
                    
                    <GrillaEmpresa idSociety={idSociety} loggedUser={loggedUser} tipo={tipo}  filtRS={-1}  isLoading={isLoading} error={error} empresaInformation={empresaInformation}  />
                  </Box>
                </Container>
              </Box>               
            
            </TabPanel>

          </TabContext>                  
    </>   
  );
}
