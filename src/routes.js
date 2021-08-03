import React from 'react';
import { Navigate } from 'react-router-dom'; //según la documentación de react-router-dom conviene usar useNavigate ya que no uso classes sino hooks
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import CustomerList from 'src/pages/CustomerList';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import ProductList from 'src/pages/ProductList';
import Register from 'src/pages/Register';
import Settings from 'src/pages/Settings';
import Usuarios from 'src/pages/Usuarios';
import Rubros from 'src/pages/Rubros';
import { Dolar } from 'src/pages/Dolar';
import { Cac } from 'src/pages/Cac';
import { Formulario } from 'src/pages/Pruebas';
import Proveedores from 'src/pages/Proveedores';

let idSociedad = 1; // esto después lo pisaremos desde la autenticación de usuario

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'settings', element: <Settings /> },
      { path: 'usuarios', element: <Usuarios /> },
      { path: 'rubros', element: <Rubros /> },
      { path: 'pruebas', element: <Formulario /> },
      { path: 'dolar', element: <Dolar idSociedad={idSociedad} /> },
      { path: 'cac', element: <Cac idSociedad={idSociedad} /> },
      { path: 'proveedores', element: <Proveedores /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export { routes };
