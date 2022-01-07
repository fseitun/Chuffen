import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import dotenv from 'dotenv';

import { ThemeProvider } from '@mui/material/styles';
import GlobalStyles from 'src/components/auxiliares/GlobalStyles';
import theme from 'src/theme';

// *** Generales *********************************

import DashboardLayout from 'src/components/auxiliares/DashboardLayout';
import MainLayout from 'src/components/auxiliares/MainLayout';
import { Login } from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import { useAuth } from 'src/utils/useAuth';

// *** Auxiliares *********************************
import { Dolar } from 'src/pages/Dolar';
import { Cac } from 'src/pages/Cac';
import { Rubro } from 'src/pages/Rubro';
//import { Rubro } from 'src/pages/Rubro';
import { SubRubro } from 'src/pages/SubRubro';

// *** Maestros *********************************
import { Usuarios } from 'src/pages/Usuarios';

import { Proveedores } from 'src/pages/Proveedores';
import { Persona } from 'src/pages/Persona';
import { Empresa } from 'src/pages/Empresa';

// *** Fide *********************************
import { Fideicomiso } from 'src/pages/Fideicomiso';
import { DetalleFideicomiso } from 'src/pages/DetalleFideicomiso';

// *** Contrato *********************************
//import { Contratos } from 'src/pages/Contratos';
//import { ContratoAlta } from 'src/pages/ContratoAlta';
//import { Cobros } from 'src/pages/Cobros';
//import { Cuotas } from 'src/pages/Cuotas';
//import { DetalleContrato } from 'src/pages/DetalleContrato';
//import { ContratoVista } from 'src/pages/ContratoVista';

// *** Pagos *********************************
import { OP } from 'src/pages/OP';
import { AuthAdmOP } from 'src/pages/AuthAdmOP';
import { AuthObraOP } from 'src/pages/AuthObraOP';

import { DetalleOP } from 'src/pages/DetalleOP';
import { Factura } from 'src/pages/Factura';

// *** Orden de Trabajo **********************
import { OT } from 'src/pages/OT';
//import { DetalleOT } from 'src/pages/DetalleOT';
//import { Certificado } from 'src/pages/Certificado';

dotenv.config();

export default function App() {
  const { loggedUser, setLoggedUser } = useAuth();
  const [idSociety, setIdSociety] = useState(() => {
    const localStorageIdSociety = localStorage.getItem('idSociety');
    return localStorageIdSociety ? JSON.parse(localStorageIdSociety) : null;
  });

  return (
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
              <Route path="dolar" element={<Dolar idSociety={idSociety} loggedUser={loggedUser}  />} />
              <Route path="cac" element={<Cac idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="OT" element={<OT idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="empresa" element={<Empresa idSociety={idSociety}  loggedUser={loggedUser}  />} />
              <Route path="persona" element={<Persona idSociety={idSociety}  loggedUser={loggedUser}  />} />

              <Route path="factura" element={<Factura idSociety={idSociety} loggedUser={loggedUser} />} />
             
              <Route path="OP">
                <Route path="" element={<OP idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":idOP/:fecha/:empresaId/:numero/:fideicomiso"
                  element={<DetalleOP idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>

              <Route path="AuthAdmOP">
                <Route path="" element={<AuthAdmOP idSociety={idSociety}  loggedUser={loggedUser} />}  />
                <Route
                  path=":idOP/:fecha/:empresaId/:numero/:fideicomiso"
                  element={<DetalleOP idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>

              <Route path="AuthObraOP">
                <Route path="" element={<AuthObraOP idSociety={idSociety}  loggedUser={loggedUser} />}  />
                <Route
                  path=":idOP/:fecha/:empresaId/:numero/:fideicomiso"
                  element={<DetalleOP idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>


              
              <Route path="proveedores" element={<Proveedores idSociety={idSociety}   loggedUser={loggedUser} />} />
              <Route path="usuarios" element={<Usuarios idSociety={idSociety}  loggedUser={loggedUser}  />} />
              
              <Route path="rubro"> 
                <Route path="" element={<Rubro idSociety={idSociety} loggedUser={loggedUser} />} />
                <Route
                  path=":idRubro/:rubro"
                  element={<SubRubro idSociety={idSociety} loggedUser={loggedUser} />}
                />
              </Route>

              
              <Route path="fideicomiso">
                <Route path="" element={<Fideicomiso idSociety={idSociety}  loggedUser={loggedUser}  />} />
                <Route
                  path=":nombreFideicomiso"
                  element={<DetalleFideicomiso idSociety={idSociety}   loggedUser={loggedUser}  />}
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
                  idSociety={idSociety}
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
  );
}
