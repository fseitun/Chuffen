import {
  AttachMoney,
  TrendingUp,
  LocalShipping,
  People,
  MenuBook,
  Apartment,
  /*Assignment,*/
  ListAlt,
  CreditCard,
  /*
  Construction,
  MonetizationOn,
  Business,
  PeopleAlt,
  Schema,
  AssignmentTurnedIn,*/
} from '@mui/icons-material';

export const sideBarOptions = [
  {
    path: 'op',
    icon: CreditCard,
    title: 'OPs',
    acceso: 'oppago',
  },

  {
    path: 'AuthAdmOP',
    icon: CreditCard,
    title: 'OPs Auth ADM',
    acceso: 'AuthAdmOP',
  },

  {
    path: 'AuthObraOP',
    icon: CreditCard,
    title: 'OPs Auth Obra',
    acceso: 'AuthObraOP',
  },

  {
    path: 'factura',
    icon: ListAlt,
    title: 'Facturas',
    acceso: 'factura',
  },
  {
    path: 'proveedores',
    icon: LocalShipping,
    title: 'Proveedores',
    acceso: 'proveedores',
  },
  {
    path: 'fideicomiso',
    icon: Apartment,
    title: 'Fideicomisos',
    acceso: 'fideicomiso',
  },
  {
    path: 'rubro',
    icon: MenuBook,
    title: 'Rubros',
    acceso: 'rubro',
  },
/*
  {
    path: 'empresa',
    icon: Business,
    title: 'Empresa',
  },*/
  /*
  {
    path: 'persona',
    icon: PeopleAlt,
    title: 'Personas',
  },*/
  /*
  {
    path: 'OT',
    icon: TrendingUp,
    title: 'test pdf',
    acceso: 'OT',
  },*/
  {
    path: 'cac',
    icon: TrendingUp,
    title: 'CAC',
    acceso: 'cac',
  },
  {
    path: 'dolar',
    icon: AttachMoney,
    title: 'Dólar',
    acceso: 'dolar',
  },

  {
    path: 'usuarios',
    icon: People,
    title: 'Usuarios',
    acceso: 'usuarios',
  },
];
