import { React } from 'react';
import PropTypes from 'prop-types';
import { Box, Drawer, List } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PeopleIcon from '@material-ui/icons/People';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { NavItem } from './NavItem';

export default function DashboardSidebar({ setisMobileNavOpen, isMobileNavOpen, idSociety }) {
  const items = [
    {
      href: `/${idSociety?.name}/dolar`,
      icon: AttachMoneyIcon,
      title: 'Dólar',
    },
    {
      href: `/${idSociety?.name}/cac`,
      icon: TrendingUpIcon,
      title: 'CAC',
    },
    {
      href: `/${idSociety?.name}/proveedores`,
      icon: LocalShippingIcon,
      title: 'Proveedores',
    },
    {
      href: `/${idSociety?.name}/usuarios`,
      icon: PeopleIcon,
      title: 'Usuarios',
    },
    {
      href: `/${idSociety?.name}/rubros`,
      icon: MenuBookIcon,
      title: 'Rubros',
    },
  ];

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <Box sx={{ p: 2 }}>
        <List>
          {items.map(item => (
            <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
          ))}
        </List>
      </Box>
      {/* <Box sx={{ flexGrow: 1 }} /> estaba en el template, no se con que fin */}
    </Box>
  );

  return (
    <>
      <Drawer
        variant='temporary'
        sx={{ display: { xs: 'block', lg: 'none' } }}
        anchor='left'
        onClose={setisMobileNavOpen}
        open={isMobileNavOpen}
        PaperProps={{
          sx: {
            width: 256,
          },
        }}>
        {content}
      </Drawer>
      <Drawer
        variant='persistent'
        open
        sx={{ display: { xs: 'none', lg: 'block' } }}
        anchor='left'
        PaperProps={{
          sx: {
            width: 256,
            top: 64,
            height: 'calc(100% - 64px)',
          },
        }}>
        {content}
      </Drawer>
    </>
  );
}

DashboardSidebar.propTypes = {
  setisMobileNavOpen: PropTypes.func,
  isMobileNavOpen: PropTypes.bool,
};

DashboardSidebar.defaultProps = {
  setisMobileNavOpen: () => {},
  isMobileNavOpen: false,
};
