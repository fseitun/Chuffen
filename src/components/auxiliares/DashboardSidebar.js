import { Box, List, Drawer } from '@mui/material';

import { NavItem } from './NavItem';
import { sideBarOptions } from './sideBarOptions';

export default function DashboardSidebar({ setisMobileNavOpen, isMobileNavOpen, idSociety }) {
  // console.log('idSociety:', idSociety);

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
        {sideBarOptions.map(item => (
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
