import { useState, useEffect, createContext } from 'react';
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
import { Liquidacion } from 'src/pages/Liquidacion';
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
import { getMethod } from 'src/utils/api';

export const SocietyContext = createContext({});
export const EstadosContext = createContext({});
export const EstadosPagoContext = createContext({});
export const FormaCobrosContext = createContext({});
export const FormaPagosContext = createContext({});
export const FormaPagosFiduContext = createContext({});
export const RetencionesContext = createContext({});
export const FondosContext = createContext({});
export const TiposContext = createContext({});
export const CondicionIVAContext = createContext({});
export const ConceptosCuotaContext = createContext({});
export const ConceptosPagoContext = createContext({});
export const TipoProductosContext = createContext({});
export const LetrasContext = createContext({});
export const CategoriasComboContext = createContext({});

dotenv.config();

export default function App() { 



const [idSociety, setIdSociety] = useState(() => {
  const localStorageIdSociety = localStorage.getItem('idSociety');
  return localStorageIdSociety ? JSON.parse(localStorageIdSociety) : null;
});

const { loggedUser, setLoggedUser } = useAuth();

const [estados, setEstados] = useState([]);
const [estadosPago, setEstadosPago] = useState([]);
const [formaPagos, setFormaPagos] = useState([]);
const [formaPagosFidu, setFormaPagosFidu] = useState([]);  
const [retenciones, setRetenciones] = useState([]);
const [fondos, setFondos] = useState([]);  
const [tipos, setTipos] = useState([]);
const [condicion_de_IVA, setCondicion_de_IVA] = useState([]);  
const [tipoProductos, setTipoProductos] = useState([]);
const [letras, setLetras] = useState([]); 
const [categoriasCombo, setCategoriasCombo] = useState([]);
const [conceptosCuota, setConceptosCuota] = useState([]); 
const [conceptosPago, setConceptosPago] = useState([]); 

useEffect(
  (idSociety)=> {
    let id = idSociety?.id > 0? idSociety.id:JSON.parse(localStorage.getItem("idSociety"))?.id;
    getMethod(`listas/listarEstados/${idSociety?.id}`).then((items) => setEstados(items));
    getMethod(`listas/listarEstadosPago/${idSociety?.id}`).then((items) => setEstadosPago(items));
    getMethod(`listas/listarFormaPagos/${idSociety?.id}`).then((items) => setFormaPagos(items));
    getMethod(`listas/listarFormaPagosFidu/${idSociety?.id}`).then((items) => setFormaPagosFidu(items));
    getMethod(`listas/listarRetenciones/${idSociety?.id}`).then((items) => setRetenciones(items));
    getMethod(`listas/listarFondos/${idSociety?.id}`).then((items) => setFondos(items));
    getMethod(`listas/listarTipos/${idSociety?.id}`).then((items) => setTipos(items));
    getMethod(`listas/listarCondicion_de_IVA/${idSociety?.id}`).then((items) => setCondicion_de_IVA(items));
    getMethod(`listas/listarTipoProductos/${idSociety?.id}`).then((items) => setTipoProductos(items));
    getMethod(`listas/listarLetras/${idSociety?.id}`).then((items) => setLetras(items));
    getMethod(`categoria/listarCombo/${id}`).then((items) => setCategoriasCombo(items));
    getMethod(`listas/conceptosCuota/${id}`).then((items) => setConceptosCuota(items));
    getMethod(`listas/conceptosPago/${idSociety?.id}`).then((items) => setConceptosPago(items));

  },[])

  return (

    <SocietyContext.Provider value={idSociety}>
    <EstadosContext.Provider value={estados}>
    <EstadosPagoContext.Provider value={estadosPago}> 
    <FormaPagosFiduContext.Provider value={formaPagosFidu} >
    <FormaPagosContext.Provider value={formaPagos} >
    <RetencionesContext.Provider value={retenciones}>
    <FondosContext.Provider value={fondos}>
    <TiposContext.Provider value={tipos}>
    <CondicionIVAContext.Provider value={condicion_de_IVA}>
    <ConceptosCuotaContext.Provider value={conceptosCuota}>
    <ConceptosPagoContext.Provider value={conceptosPago}>
    <TipoProductosContext.Provider value={tipoProductos}>
    <LetrasContext.Provider value={letras}>    
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
              <Route path="liquidacion" element={<Liquidacion idSociety={idSociety}  loggedUser={loggedUser}  />} />
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
    </LetrasContext.Provider>
    </TipoProductosContext.Provider>
    </ConceptosPagoContext.Provider>
    </ConceptosCuotaContext.Provider>
    </CondicionIVAContext.Provider>
    </TiposContext.Provider>
    </FondosContext.Provider>    
    </RetencionesContext.Provider>
    </FormaPagosContext.Provider>
    </FormaPagosFiduContext.Provider>
    </EstadosPagoContext.Provider>
    </EstadosContext.Provider>
    </SocietyContext.Provider>
    
    
  )}
