import React from 'react';
import { Navigate } from 'react-router-dom'; //según la documentación de react-router-dom conviene usar useNavigate ya que no uso classes sino hooks
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import { Dolar } from 'src/pages/Dolar';
import { Cac } from 'src/pages/Cac';

let idSociedad = 1; // esto después lo pisaremos desde la autenticación de usuario

export const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dolar', element: <Dolar idSociedad={idSociedad} /> },
      { path: 'cac', element: <Cac idSociedad={idSociedad} /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dolar" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];
