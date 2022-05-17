import { useState, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import dotenv from 'dotenv';

import { ThemeProvider } from '@mui/material/styles';
import GlobalStyles from 'src/components/auxiliares/GlobalStyles';
import theme from 'src/theme';

// *** Generales *********************************

import DashboardLayout from 'src/components/auxiliares/DashboardLayout';
import MainLayout from 'src/components/auxiliares/MainLayout';
import { DashBoard } from 'src/pages/DashBoard';
import { Login } from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import { useAuth } from 'src/utils/useAuth';

// *** Auxiliares *********************************
import { Dolar } from 'src/pages/Dolar';
import { Cac } from 'src/pages/Cac';
import { Rubro } from 'src/pages/Rubro';
import { Categoria } from 'src/pages/Categoria';
import { SubRubro } from 'src/pages/SubRubro';
import { Banco } from 'src/pages/Banco';
import { CuentaBanco } from 'src/pages/CuentaBanco';

// *** Maestros *********************************
import { Usuarios } from 'src/pages/Usuarios';
import { Proveedores } from 'src/pages/Proveedores';
import { Fiduciantes } from 'src/pages/Fiduciantes';

// *** Fide *********************************
import { Fideicomiso } from 'src/pages/Fideicomiso';
import { DetalleFideicomiso } from 'src/pages/DetalleFideicomiso';

// *** Contrato *********************************
import { Contrato } from 'src/pages/Contrato';
import { Cobros } from 'src/pages/Cobros';
import { Cuotas } from 'src/pages/Cuotas';
import { DetalleContrato } from 'src/pages/DetalleContrato';

// *** Pagos *********************************
import { OP } from 'src/pages/OP';
import { AuthAdmOP } from 'src/pages/AuthAdmOP';
import { AuthObraOP } from 'src/pages/AuthObraOP';
import { DetalleOP } from 'src/pages/DetalleOP';
import { Factura } from 'src/pages/Factura';

// *** Orden de Trabajo **********************
import { OC } from 'src/pages/OC';
import { DetalleOC } from 'src/pages/DetalleOC';
//import { Certificado } from 'src/pages/Certificado';

import { getMethod } from 'src/utils/api';
import { useQuery } from 'react-query';

export const SocietyContext = createContext({});

export const EstadosContext = createContext({});
export const FormaCobrosContext = createContext({});
export const FormaPagosContext = createContext({});
export const RetencionesContext = createContext({});
export const FondosContext = createContext({});
export const TiposContext = createContext({});
export const CondicionIVAContext = createContext({});
export const ConceptosCuotaContext = createContext({});
export const ConceptosPagoContext = createContext({});
export const TipoProductosContext = createContext({});
export const CategoriasComboContext = createContext({});

dotenv.config();

export default function App() {
  const { loggedUser, setLoggedUser } = useAuth();
    
  const [idSociety, setIdSociety] = useState(() => {
    const localStorageIdSociety = localStorage.getItem('idSociety');
    return localStorageIdSociety ? JSON.parse(localStorageIdSociety) : null;
  });

  
  const { data: estados } = useQuery(['estados', idSociety], () =>
    getMethod(`listas/listarEstados/${idSociety.id}`)
  );
  const { data: formaCobros } = useQuery(['formaCobros', idSociety], () =>
  getMethod(`listas/listarFormaCobros/${idSociety.id}`)
);
  const { data: formaPagos } = useQuery(['formaPagos', idSociety], () =>
    getMethod(`listas/listarFormaPagos/${idSociety.id}`)
  );
  const { data: retenciones } = useQuery(['retenciones', idSociety], () =>
  getMethod(`listas/listarRetenciones/${idSociety.id}`)
  );
  const { data: fondos } = useQuery(['fondos', idSociety], () =>
  getMethod(`listas/listarFondos/${idSociety.id}`)
  );
  const { data: tipos } = useQuery(['tipos', idSociety], () =>
  getMethod(`listas/listarTipos/${idSociety.id}`)
  );
  const { data: condicion_de_IVA } = useQuery(['condicion_de_IVA', idSociety], () =>
  getMethod(`listas/listarCondicion_de_IVA/${idSociety.id}`)
  );
  const { data: tipoProductos } = useQuery(['tipoProductos', idSociety], () =>
  getMethod(`listas/listarTipoProductos/${idSociety.id}`)
  );
  const {data: categoriasCombo} = useQuery(['categoriaCombo', idSociety], () => 
    getMethod(`categoria/listarCombo/${idSociety.id}`)
  ); 
  const {data: conceptosCuota} = useQuery(['conceptosCuota', idSociety], () => 
    getMethod(`listas/conceptosCuota/${idSociety.id}`)
  ); 
  const {data: conceptosPago} = useQuery(['conceptosPago', idSociety], () => 
    getMethod(`listas/conceptosPago/${idSociety.id}`)
  ); 

  return (

    <SocietyContext.Provider value={idSociety}>
    <EstadosContext.Provider value={estados}>
    <FormaCobrosContext.Provider value={formaCobros} >
    <FormaPagosContext.Provider value={formaPagos} >
    <RetencionesContext.Provider value={retenciones}>
    <FondosContext.Provider value={fondos}>
    <TiposContext.Provider value={tipos}>
    <CondicionIVAContext.Provider value={condicion_de_IVA}>
    <ConceptosCuotaContext.Provider value={conceptosCuota}>
    <ConceptosPagoContext.Provider value={conceptosPago}>
    <TipoProductosContext.Provider value={tipoProductos}>
    <CategoriasComboContext.Provider value={categoriasCombo}>

    
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        {loggedUser ? (
          <>
            
            <Route path="/" element={<Navigate to={`${idSociety?.nombre}`} />} />
            <Route
              path=":societyName"
              element={
                <DashboardLayout
                
                  setLoggedUser={setLoggedUser}
                  idSociety={idSociety}
                  loggedUser={loggedUser}
                />
              }
            >
              
              
              <Route path="dashboard" element={<DashBoard idSociety={idSociety} loggedUser={loggedUser}  />} />
              <Route path="dolar" element={<Dolar idSociety={idSociety} loggedUser={loggedUser}  />} />
              <Route path="cac" element={<Cac idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="usuarios" element={<Usuarios idSociety={idSociety}  loggedUser={loggedUser}  />} />
             <Route path="rubro"> 
                <Route path="" element={<Rubro idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":idRubro/:rubro"
                  element={<SubRubro idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>

              
              
              
              
              
              
              
              <Route path="contrato">
                <Route path="" element={<Contrato idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":contratoId/:page"
                  element={<DetalleContrato idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>
              <Route path="cobros" element={<Cobros idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="cuotas" element={<Cuotas idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="categoria" element={<Categoria idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="OC">
                <Route path="" element={<OC idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":idOC/:page"
                  element={<DetalleOC idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>
              <Route path="fiduciantes" element={<Fiduciantes idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="fideicomiso">
                <Route path="" element={<Fideicomiso idSociety={idSociety}  loggedUser={loggedUser}  />} />
                <Route
                  path=":fideicomisoId/:nombre"
                  element={<DetalleFideicomiso idSociety={idSociety}   loggedUser={loggedUser}  />}
                />
              </Route>
              
              
              
              
              
              <Route path="factura">
                <Route path="" element={<Factura idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":idOP/:fecha/:empresaId/:numero/:fideicomisoId/:fideicomiso/:estadoOP/:auth_adm/:auth_obra/:confirmada/:blue/:page"
                  element={<DetalleOP idSociety={idSociety} formaPagos={formaPagos} loggedUser={loggedUser} />}
                />
              </Route>
              <Route path="OP">
                <Route path="" element={<OP idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":idOP/:fecha/:empresaId/:numero/:fideicomisoId/:fideicomiso/:estadoOP/:auth_adm/:auth_obra/:confirmada/:blue/:page"
                  element={<DetalleOP idSociety={idSociety} formaPagos={formaPagos}  loggedUser={loggedUser} />}
                />
              </Route>
              <Route path="AuthAdmOP">
                <Route path="" element={<AuthAdmOP idSociety={idSociety}  formaPagos={formaPagos}  loggedUser={loggedUser} />}  />
                <Route
                  path=":idOP/:fecha/:empresaId/:numero/:fideicomisoId/:fideicomiso/:estadoOP/:auth_adm/:auth_obra/:confirmada/:blue/:page"
                  element={<DetalleOP idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>
              <Route path="AuthObraOP">
                <Route path="" element={<AuthObraOP idSociety={idSociety} formaPagos={formaPagos}   loggedUser={loggedUser} />}  />
                <Route
                  path=":idOP/:fecha/:empresaId/:numero/:fideicomisoId/:fideicomiso/:estadoOP/:auth_adm/:auth_obra/:confirmada/:blue/:page"
                  element={<DetalleOP idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>
              <Route path="proveedores" element={<Proveedores idSociety={idSociety}   loggedUser={loggedUser} />} />
              <Route path="banco"> 
                <Route path="" element={<Banco idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":idBanco/:banco"
                  element={<CuentaBanco idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>

              
              


              <Route path="*" element={<NotFound />} />
            </Route>
            
          </>
        ) : (
          <MainLayout>
            <Route
              path=":societyName/login"
              element={
                <Login
                  setLoggedUser={setLoggedUser}
                  setIdSociety={setIdSociety}
                />
              }
            />

            <Route path=":societyName" element={<Navigate to="login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </MainLayout>
        )}
      </Routes>
    </ThemeProvider>

    
    </CategoriasComboContext.Provider>
    </TipoProductosContext.Provider>
    </ConceptosPagoContext.Provider>
    </ConceptosCuotaContext.Provider>
    </CondicionIVAContext.Provider>
    </TiposContext.Provider>
    </FondosContext.Provider>    
    </RetencionesContext.Provider>
    </FormaPagosContext.Provider>
    </FormaCobrosContext.Provider>
    </EstadosContext.Provider>
    </SocietyContext.Provider>
    
    
  )}
