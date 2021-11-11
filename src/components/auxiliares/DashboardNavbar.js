import { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, Badge, Avatar } from '@mui/material';
import { Notifications, Menu, ExitToApp } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import Logo from 'src/components/auxiliares/Logo.js';
import { sideBarOptions } from 'src/components/auxiliares/sideBarOptions.js';

const user = {
  avatar: '/static/images/avatars/ingeniero.png',
};

export default function DashboardNavbar({
  setisMobileNavOpen,
  setLoggedUser,
  idSociety,
  loggedUser,
}) {

  
  const { pathname } = useLocation();

  // const lastPartOfPath = pathname.split('/').at(-1);
  const lastPartOfPath = pathname.split('/')[pathname.split('/').length - 1];

  const nameOfPage =
    sideBarOptions.find(option => option.path === lastPartOfPath)?.title || lastPartOfPath;


  const [notifications] = useState([]);
  function logOut() {
    setLoggedUser(null);
  }
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Link to="/">
          <Logo idSociety={idSociety} />
        </Link>
        <div style={{ marginLeft: 50, fontSize: 24 }}>{nameOfPage}</div>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit">
          <Badge badgeContent={notifications.length} color="primary" variant="dot">
            <Notifications />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          sx={{ display: { md: 'block', lg: 'none' } }}
          onClick={setisMobileNavOpen}
        >
          <Menu />
        </IconButton>
        <div style={{ fontSize: 24 }}>{loggedUser?.user}</div>

        <IconButton color="inherit">
          <Avatar
            component={Link}
            to="/"
            src={user.avatar}
            sx={{
              cursor: 'pointer',
              width: 30,
              height: 30,
            }}
          />
        </IconButton>
        <IconButton color="inherit" onClick={logOut}>
          <ExitToApp />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
