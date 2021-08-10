import { React, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Logo from 'src/components/auxiliares/Logo.js';

const user = {
  avatar: '/static/images/avatars/ingeniero.png',
};

export default function DashboardNavbar({ onMobileNavOpen, setIsAuth, ...rest }) {
  const [notifications] = useState([]);
  function logOut() {
    setIsAuth(null);
  }
  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to='/'>
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color='inherit'>
          <Badge badgeContent={notifications.length} color='primary' variant='dot'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          color='inherit'
          sx={{ display: { sm: 'block', md: 'none' } }}
          onClick={onMobileNavOpen}>
          <MenuIcon />
        </IconButton>
        <IconButton color='inherit'>
          <Avatar
            component={RouterLink}
            src={user.avatar}
            sx={{
              cursor: 'pointer',
              width: 30,
              height: 30,
            }}
            to='/app/account'
          />
        </IconButton>
        <IconButton color='inherit' onClick={logOut}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
};
