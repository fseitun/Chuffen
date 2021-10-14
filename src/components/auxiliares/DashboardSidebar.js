import { Box, List, Drawer } from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  LocalShipping,
  People,
  MenuBook,
  AttachMoneyIcon,
  TrendingUpIcon,
  LocalShippingIcon,
  Assignment,
  Apartment,
  PeopleIcon,
  ListAlt,
  CreditCard,
  Construction,
  MonetizationOn,
  Business,
  PeopleAlt,
  Schema,
  AssignmentTurnedInIcon,
} from '@mui/icons-material';

import { NavItem } from './NavItem';

const items = [
  {
    href: '/app/contratos',
    icon: Assignment,
    title: 'Ver contratos ',
  },
  {
    href: '/app/contratoalta',
    icon: Assignment,
    title: 'Crear contrato',
  },
  {
    href: '/app/cobros',
    icon: MonetizationOn,
    title: 'Cobros',
  },

  {
    href: '/app/op',
    icon: CreditCard,
    title: 'OPs',
  },
  {
    href: '/app/factura',
    icon: ListAlt,
    title: 'Facturas',
  },
  {
    href: '/app/cobros',
    icon: Construction,
    title: 'OTs',
  },
  {
    href: '/app/certificado',
    icon: AssignmentTurnedInIcon,
    title: 'Certificados',
  },
  {
    href: '/app/empresa',
    icon: Business,
    title: 'Empresa',
  },
  {
    href: '/app/persona',
    icon: PeopleAlt,
    title: 'Personas',
  },
  {
    href: '/app/proveedores',
    icon: LocalShippingIcon,
    title: 'Proveedores',
  },
  {
    href: '/app/fideicomiso',
    icon: Apartment,
    title: 'Fideicomisos',
  },
  {
    href: '/app/rubro',
    icon: Schema,
    title: 'Rubros & Sub',
  },
  {
    href: '/app/dolar',
    icon: AttachMoneyIcon,
    title: 'Dólar',
  },
  {
    href: '/app/cac',
    icon: TrendingUpIcon,
    title: 'CAC',
  },
  {
    href: '/app/usuarios',
    icon: PeopleIcon,
    title: 'Usuarios',
  },
];

export default function DashboardSidebar({ setisMobileNavOpen, isMobileNavOpen, idSociety }) {
  const items = [
    {
      href: `/${idSociety?.name}/fideicomiso`,
      icon: LocalShipping,
      title: 'Fideicomisos',
    },
    {
      href: `/${idSociety?.name}/dolar`,
      icon: AttachMoney,
      title: 'Dólar',
    },
    {
      href: `/${idSociety?.name}/cac`,
      icon: TrendingUp,
      title: 'CAC',
    },
    {
      href: `/${idSociety?.name}/proveedores`,
      icon: LocalShipping,
      title: 'Proveedores',
    },
    {
      href: `/${idSociety?.name}/usuarios`,
      icon: People,
      title: 'Usuarios',
    },
    {
      href: `/${idSociety?.name}/rubros`,
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
      }}>
      <List>
        {items.map(item => (
          <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
        ))}
      </List>
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
