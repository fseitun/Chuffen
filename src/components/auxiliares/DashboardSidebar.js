import { Box, List, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NavItem } from './NavItem';
import { sideBarOptions } from './sideBarOptions';

export default function DashboardSidebar({ setisMobileNavOpen, setLoggedUser, isMobileNavOpen, idSociety, loggedUser }) {
  // console.log('idSociety:', idSociety);
  const navigate = useNavigate();
  if(!loggedUser){
    logOut();
  }

  function logOut() {
    setLoggedUser(null);
    navigate(`../${idSociety?.nombre}`);
  }
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: 2,
      }}
    >
      <List>
        {arrMenu(sideBarOptions, loggedUser?.['rol.accesoTXT']).map(item => (
          <NavItem
            href={`/${idSociety?.nombre}/${item.path}`}
            key={item.title}
            title={item.title}
            icon={item.icon}
          />
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        sx={{ display: { xs: 'block', lg: 'none' } }}
        anchor="left"
        onClose={setisMobileNavOpen}
        open={isMobileNavOpen}
        PaperProps={{
          sx: {
            width: 256,
          },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="persistent"
        open
        sx={{ display: { xs: 'none', lg: 'block' } }}
        anchor="left"
        PaperProps={{
          sx: {
            width: 256,
            top: 64,
            height: 'calc(100% - 64px)',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

// segun acceso en el accessTXT del rol
function arrMenu(sideBarOptions, acceso){
  
  let arr =[{}]; 

  sideBarOptions.forEach(obj => {
    if(acceso.indexOf(obj.acceso) !== -1 && obj.acceso.trim()!=="" && obj.acceso!==null && obj.acceso!==undefined){
      arr.push(obj);
    }  
  })
  arr.splice(0, 1);

  return arr;
}
