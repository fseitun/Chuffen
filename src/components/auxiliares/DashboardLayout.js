import { useState } from 'react';
import { styled } from '@mui/system';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { ReactQueryDevtools } from 'react-query/devtools';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const DashboardLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 256,
  },
}));

const DashboardLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
});

const DashboardLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
});

export default function DashboardLayout({ setLoggedUser, idSociety, loggedUser }) {
  // console.log('idSociety', idSociety);
  const [isMobileNavOpen, setisMobileNavOpen] = useState(false);

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar
        setisMobileNavOpen={() => setisMobileNavOpen(!isMobileNavOpen)}
        setLoggedUser={setLoggedUser}
        idSociety={idSociety}
        loggedUser={loggedUser}
      />
      <DashboardSidebar
        idSociety={idSociety}
        setisMobileNavOpen={() => setisMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
      />
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            <Outlet />
            <ReactQueryDevtools initialIsOpen={false} />
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
}
