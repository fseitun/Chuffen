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
  Construction,
  // Business,
  PeopleAlt,
  /*MonetizationOn,
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
    path: 'OC',
    icon: Construction,
    title: 'OCs',
    acceso: 'orden_compra',
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
    path: 'fiduciantes',
    icon: PeopleAlt,
    title: 'Fiduciantes',
    acceso: 'fiduciante',
  },
  {
    path: 'rubro',
    icon: MenuBook,
    title: 'Rubros',
    acceso: 'rubro',
  },
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
    path: 'banco',
    icon: AttachMoney,
    title: 'Bancos',
    acceso: 'banco',
  },

  {
    path: 'usuarios',
    icon: People,
    title: 'Usuarios',
    acceso: 'usuarios',
  },
];
