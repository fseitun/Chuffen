import { React, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer, List } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import NavItem from './NavItem';

const items = [
  {
    href: '/app/dolar',
    icon: AttachMoneyIcon,
    title: 'Dólar'
  },
  {
    href: '/app/cac',
    icon: TrendingUpIcon,
    title: 'CAC'
  },
  {
    href: '/app/proveedores',
    icon: LocalShippingIcon,
    title: 'Proveedores'
  }
];

export default function DashboardSidebar({ onMobileClose, openMobile }) {
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, openMobile, onMobileClose]); //openMobile, onMobileClose los agregué como dependencias por epdido del linter

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
