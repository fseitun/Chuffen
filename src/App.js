import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import dotenv from 'dotenv';
import { ThemeProvider } from '@mui/material/styles';
import GlobalStyles from 'src/components/auxiliares/GlobalStyles';
import theme from 'src/theme';
import DashboardLayout from 'src/components/auxiliares/DashboardLayout';
import MainLayout from 'src/components/auxiliares/MainLayout';
import { Login } from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import { Dolar } from 'src/pages/Dolar';
import { Cac } from 'src/pages/Cac';
import { Proveedores } from 'src/pages/Proveedores';
import { Usuarios } from 'src/pages/Usuarios';
import { Rubros } from 'src/pages/Rubros';
import { Fideicomiso } from 'src/pages/Fideicomiso';
import { DetalleFideicomiso } from 'src/pages/DetalleFideicomiso';
import { useAuth } from 'src/utils/useAuth';

dotenv.config();
let idFideicomiso = 1;

export default function App() {
  const { loggedUser, setLoggedUser } = useAuth();
  const [idSociety, setIdSociety] = useState(() => {
    const auxiliaryState = localStorage.getItem('idSociety');
    return auxiliaryState ? JSON.parse(auxiliaryState) : null;
  });
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        {loggedUser ? (
          <>
            <Route path='/' element={<Navigate to={`${idSociety.name}`} />} />
            <Route
              path=':societyName'
              element={<DashboardLayout setLoggedUser={setLoggedUser} idSociety={idSociety} />}>
              <Route path='dolar' element={<Dolar idSociety={idSociety} />} />
              <Route path='cac' element={<Cac idSociety={idSociety} />} />
              <Route path='proveedores' element={<Proveedores idSociety={idSociety} />} />
              <Route path='usuarios' element={<Usuarios idSociety={idSociety} />} />
              <Route path='rubros' element={<Rubros idSociety={idSociety} />} />
              <Route path='fideicomiso'>
                <Route path='' element={<Fideicomiso idSociety={idSociety} />} />
                <Route
                  path=':nombreFideicomiso'
                  element={<DetalleFideicomiso idSociety={idSociety} />}
                />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Route>
          </>
        ) : (
          <MainLayout>
            <Route
              path=':societyName/login'
              element={
                <Login
                  setLoggedUser={setLoggedUser}
                  idSociety={idSociety}
                  setIdSociety={setIdSociety}
                />
              }
            />
          </MainLayout>
        )}
      </Routes>
    </ThemeProvider>
  );
}
