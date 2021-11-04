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

export const sideBarOptions = [
  {
    path: 'op',
    icon: CreditCard,
    title: 'OPs',
  },

  {
    path: 'AuthAdmOP',
    icon: CreditCard,
    title: 'OPs Auth ADM',
  },

  {
    path: 'AuthObraOP',
    icon: CreditCard,
    title: 'OPs Auth Obra',
  },

  {
    path: 'factura',
    icon: ListAlt,
    title: 'Facturas',
  },
  {
    path: 'proveedores',
    icon: LocalShipping,
    title: 'Proveedores',
  },
  {
    path: 'fideicomiso',
    icon: LocalShipping,
    title: 'Fideicomisos',
  },
  {
    path: 'rubros',
    icon: MenuBook,
    title: 'Rubros',
  },

  {
    path: 'empresa',
    icon: Business,
    title: 'Empresa',
  },
  {
    path: 'persona',
    icon: PeopleAlt,
    title: 'Personas',
  },

  {
    path: 'cac',
    icon: TrendingUp,
    title: 'CAC',
  },
  {
    path: 'dolar',
    icon: AttachMoney,
    title: 'Dólar',
  },

  {
    path: 'usuarios',
    icon: People,
    title: 'Usuarios',
  },
];
