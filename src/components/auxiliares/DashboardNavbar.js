import { useState } from 'react';
import { Typography, AppBar, Toolbar, Box, IconButton, Badge, Avatar } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import Logo from 'src/components/auxiliares/Logo.js';
import { sideBarOptions } from 'src/components/auxiliares/sideBarOptions.js';
import { useNavigate } from 'react-router-dom';

const user = {
  avatar: '/static/images/avatars/ingeniero.png',
};

export default function DashboardNavbar({
  setisMobileNavOpen,
  setLoggedUser,
  idSociety,
  loggedUser,
}) {

  const navigate = useNavigate();
  
  const { pathname } = useLocation();

  // const lastPartOfPath = pathname.split('/').at(-1);
  const lastPartOfPath = pathname.split('/')[pathname.split('/').length - 1];

  const nameOfPage =
    sideBarOptions.find(option => option.path === lastPartOfPath)?.title || lastPartOfPath;


  const [notifications] = useState([]);
  function logOut() {
    setLoggedUser(null);
    navigate(`../${idSociety?.nombre}`)

  }
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Link to="/">
          <Logo idSociety={idSociety} />
        </Link>
            <div style={{ marginLeft: 50, fontSize: 24 }}>
              
              <Typography align="left" color="white" variant="h4">
              {nameOfPage.replace("-"," de ").replace("%20"," ").replace("%20"," ").replace("%20"," ").replace("_",": ")}
              </Typography> 

            </div>
        <Box sx={{ flexGrow: 1 }} />
               
        <div>
            <Typography align="left" color="white" variant="h4">
                {loggedUser?.user}
            </Typography>        
        </div>

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
