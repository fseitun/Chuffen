import React from 'react';
// import 'react-perfect-scrollbar/dist/css/styles.css'; // venía con el template, lo usa?
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core'; // manda a los childs el theme de Material-UI
import dotenv from 'dotenv';
import GlobalStyles from 'src/components/auxiliares/GlobalStyles';
import theme from 'src/theme'; // trae el theme de src/theme/index.js, lo reparte con ThemeProvider

// *** Generales *********************************
import DashboardLayout from 'src/components/auxiliares/DashboardLayout';
import MainLayout from 'src/components/auxiliares/MainLayout';
import { Login } from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import { useAuth } from 'src/components/auxiliares/useAuth';

// *** Auxiliares *********************************
import { Dolar } from 'src/pages/Dolar';
import { Cac } from 'src/pages/Cac';
import { Rubro } from 'src/pages/Rubro';
//import { SubRubro } from 'src/pages/SubRubro'; ..o DetalleRubro

// *** Maestros *********************************
import { Usuarios } from 'src/pages/Usuarios';
import { Proveedores } from 'src/pages/Proveedores';
import { Persona } from 'src/pages/Persona';
import { Empresa } from 'src/pages/Empresa';

// *** Fide *********************************
import { Fideicomiso } from 'src/pages/Fideicomiso';
import { DetalleFideicomiso } from 'src/pages/DetalleFideicomiso'

// *** Contrato *********************************
import { Contratos } from 'src/pages/Contratos';
import { ContratoAlta } from 'src/pages/ContratoAlta';
import { Cobros } from 'src/pages/Cobros';
import { Cuotas } from 'src/pages/Cuotas';
import { DetalleContrato } from 'src/pages/DetalleContrato';
//import { ContratoVista } from 'src/pages/ContratoVista';

// *** Pagos *********************************
import { OP } from 'src/pages/OP';
import { DetalleOP } from 'src/pages/DetalleOP';
import { Factura } from 'src/pages/Factura';

// *** Orden de Trabajo **********************
import { OT } from 'src/pages/OT';
import { DetalleOT } from 'src/pages/DetalleOT';
import { Certificado } from 'src/pages/Certificado';



dotenv.config();
let idSociedad = 1; // esto después lo pisaremos desde la autenticación de usuario
let idFideicomiso = 1; 

export default function App() {
  const { isAuth, setIsAuth } = useAuth();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        {isAuth ? (
          <Route path='app' element={<DashboardLayout setIsAuth={setIsAuth} />}>
            <Route path='dolar' element={<Dolar idSociedad={idSociedad} />} />
            <Route path='cac' element={<Cac idSociedad={idSociedad} />} />
            <Route path='proveedores' element={<Proveedores idSociedad={idSociedad} />} />
            <Route path='usuarios' element={<Usuarios idSociedad={idSociedad} />} />
            <Route path='fideicomiso' element={<Fideicomiso idSociedad={idSociedad} />} />
            <Route path='detallefideicomiso' element={<DetalleFideicomiso idSociedad={idSociedad} idFideicomiso={idFideicomiso} />} />            
            <Route path='persona' element={<Persona idSociedad={idSociedad}  />} />
            <Route path='empresa' element={<Empresa idSociedad={idSociedad}  />} />            
            <Route path='contratos' element={<Contratos  />} />
            <Route path='contratoalta' element={<ContratoAlta  />} />
            <Route path='cobros' element={<Cobros  />} />
            <Route path='cuotas' element={<Cuotas  />} />
            <Route path='rubro' element={<Rubro  />} />
            <Route path='detallecontrato' element={<DetalleContrato  />} />
            <Route path='op' element={<OP  />} />
            <Route path='detalleot' element={<DetalleOT  />} />
            <Route path='detalleop' element={<DetalleOT  />} />
            <Route path='Certificado' element={<Certificado  />} />
            <Route path='ot' element={<OT  />} />
            <Route path='factura' element={<Factura  />} />          
            
            <Route path='*' element={<Navigate to='/404' />} />
          </Route>
        ) : (
          <Route path='*' element={<Navigate to='/login' />} />
        )}
        <Route path='/' element={<MainLayout />}>
          <Route path='login' element={<Login setIsAuth={setIsAuth} idSociedad={idSociedad} />} />
          <Route path='404' element={<NotFound />} />
          <Route path='/' element={isAuth ? <Navigate to='app' /> : <Navigate to='login' />} />
          <Route path='*' element={<Navigate to='/404' />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
