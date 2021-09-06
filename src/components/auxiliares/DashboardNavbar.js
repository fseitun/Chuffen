import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Logo from 'src/components/auxiliares/Logo.js';

const user = {
  avatar: '/static/images/avatars/ingeniero.png',
};

export default function DashboardNavbar({ setisMobileNavOpen, setLoggedUser, ...rest }) {
  const [notifications] = useState([]);
  function logOut() {
    setLoggedUser(null);
  }
  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <Link to='/' element={<Logo />}></Link>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton color='inherit'>
          <Badge badgeContent={notifications.length} color='primary' variant='dot'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          color='inherit'
          sx={{ display: { sm: 'block', md: 'none' } }}
          onClick={setisMobileNavOpen}>
          <MenuIcon />
        </IconButton>
        <IconButton color='inherit'>
          <Avatar
            component={Link}
            to='/'
            src={user.avatar}
            sx={{
              cursor: 'pointer',
              width: 30,
              height: 30,
            }}
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
  setisMobileNavOpen: PropTypes.func,
};
