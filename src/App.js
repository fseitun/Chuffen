import React from 'react';
// import 'react-perfect-scrollbar/dist/css/styles.css'; // venía con el template, lo usa?
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core'; // manda a los childs el theme de Material-UI
import dotenv from 'dotenv';

import GlobalStyles from 'src/components/auxiliares/GlobalStyles';
import theme from 'src/theme'; // trae el theme de src/theme/index.js, lo reparte con ThemeProvider
import DashboardLayout from 'src/components/auxiliares/DashboardLayout';
import MainLayout from 'src/components/auxiliares/MainLayout';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import { Dolar } from 'src/pages/Dolar';
import { Cac } from 'src/pages/Cac';
import { Proveedores } from 'src/pages/Proveedores';

dotenv.config();
let idSociedad = 1; // esto después lo pisaremos desde la autenticación de usuario

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        <Route path='app' element={<DashboardLayout />}>
          <Route path='dolar' element={<Dolar idSociedad={idSociedad} />} />
          <Route path='cac' element={<Cac idSociedad={idSociedad} />} />
          <Route path='proveedores' element={<Proveedores idSociedad={idSociedad} />} />
          <Route path='*' element={<Navigate to='/404' />} />
        </Route>
        <Route path='/' element={<MainLayout />}>
          <Route path='login' element={<Login />} />
          <Route path='404' element={<NotFound />} />
          <Route path='/' element={<Navigate to='/app/dolar' />} />
          <Route path='*' element={<Navigate to='/404' />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
