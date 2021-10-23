import { Box, List, Drawer } from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  LocalShipping,
  People,
  MenuBook,
  Assignment,
  ListAlt,
  CreditCard,
  Construction,
  MonetizationOn,
  Business,
  PeopleAlt,
  Schema,
  AssignmentTurnedIn,
} from '@mui/icons-material';

import { NavItem } from './NavItem';

export default function DashboardSidebar({ setisMobileNavOpen, isMobileNavOpen, idSociety }) {
  console.log('idSociety:', idSociety);
  const items = [
    {
      href: `/${idSociety?.nombre}/contratos`,
      icon: Assignment,
      title: 'Ver contratos ',
    },
    {
      href: `/${idSociety?.nombre}/contratoalta`,
      icon: Assignment,
      title: 'Crear contrato',
    },
    {
      href: `/${idSociety?.nombre}/cobros`,
      icon: MonetizationOn,
      title: 'Cobros',
    },

    {
      href: `/${idSociety?.nombre}/op`,
      icon: CreditCard,
      title: 'OPs',
    },
    {
      href: `/${idSociety?.nombre}/factura`,
      icon: ListAlt,
      title: 'Facturas',
    },
    {
      href: `/${idSociety?.nombre}/cobros`,
      icon: Construction,
      title: 'OTs',
    },
    {
      href: `/${idSociety?.nombre}/certificado`,
      icon: AssignmentTurnedIn,
      title: 'Certificados',
    },
    {
      href: `/${idSociety?.nombre}/empresa`,
      icon: Business,
      title: 'Empresa',
    },
    {
      href: `/${idSociety?.nombre}/persona`,
      icon: PeopleAlt,
      title: 'Personas',
    },
    {
      href: `/${idSociety?.nombre}/proveedores`,
      icon: LocalShipping,
      title: 'Proveedores',
    },
    {
      href: `/${idSociety?.nombre}/rubro`,
      icon: Schema,
      title: 'Rubros & Sub',
    },

    {
      href: `/${idSociety?.nombre}/cac`,
      icon: TrendingUp,
      title: 'CAC',
    },
    {
      href: `/${idSociety?.nombre}/usuarios`,
      icon: People,
      title: 'Usuarios',
    },
    {
      href: `/${idSociety?.nombre}/fideicomiso`,
      icon: LocalShipping,
      title: 'Fideicomisos',
    },
    {
      href: `/${idSociety?.nombre}/dolar`,
      icon: AttachMoney,
      title: 'Dólar',
    },
    {
      href: `/${idSociety?.nombre}/rubros`,
      icon: MenuBook,
      title: 'Rubros',
    },
  ];

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
        {items.map((item) => (
          <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
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
