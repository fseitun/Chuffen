import { React, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer, List } from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Folder as Rubros,
  DollarSign as Dolar,
  Truck as Proveedores,
  Umbrella as Pruebas
} from 'react-feather';
import NavItem from './NavItem';

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Tablero de Control'
  },
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: 'Clientes'
  },
  {
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: 'Productos'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: 'Usuario'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Configuración'
  },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Login'
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Nuevo Usuario'
  },
  {
    href: '/app/usuarios',
    icon: UsersIcon,
    title: 'Usuarios'
  },
  {
    href: '/app/rubros',
    icon: Rubros,
    title: 'Rubros y Subrubros'
  },
  {
    href: '/app/pruebas',
    icon: Pruebas,
    title: 'Pruebas'
  },
  {
    href: '/app/dolar',
    icon: Dolar,
    title: 'Dólar'
  },
  {
    href: '/app/proveedores',
    icon: Proveedores,
    title: 'Proveedores'
  },
  {
    href: '/404',
    icon: AlertCircleIcon,
    title: 'Error'
  }
];

export default function DashboardSidebar({ onMobileClose, openMobile }) {
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      {/* <Box sx={{ flexGrow: 1 }} /> estaba en el template, no se con que fin */}
    </Box>
  );

  return (
    <>
      <Drawer
        sx={{ display: { sm: 'block', md: 'none' } }}
        anchor="left"
        onClose={onMobileClose}
        open={openMobile}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 256
          }
        }}
      >
        {content}
      </Drawer>
      <Drawer
        sx={{ display: { sm: 'none', md: 'block' } }}
        anchor="left"
        open
        variant="persistent"
        PaperProps={{
          sx: {
            width: 256,
            top: 64,
            height: 'calc(100% - 64px)'
          }
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};
