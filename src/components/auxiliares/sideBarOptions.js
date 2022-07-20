import {
  AttachMoney,
  TrendingUp,
  LocalShipping,
  People,
  MenuBook,
  Apartment,
  ListAlt,
  CreditCard,
  Construction,
  PeopleAlt,
  
} from '@mui/icons-material';
import ListIcon from '@mui/icons-material/List';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

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
    path: 'contrato',
    icon: HandshakeOutlinedIcon,
    title: 'Adhesiones',
    acceso: 'contrato',
  },
  {
    path: 'liquidacion',
    icon: DashboardCustomizeOutlinedIcon,
    title: 'Liquidaciones',
    acceso: 'liquidacion',
  },
  /*{
    path: 'cuotas',
    icon: DashboardCustomizeOutlinedIcon,
    title: 'Cuotas',
    acceso: 'cuotas',
  },*/
  {
    path: 'cobros',
    icon: LocalAtmIcon,
    title: 'Cobros',
    acceso: 'cobros',
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
    path: 'banco',
    icon: AttachMoney,
    title: 'Bancos',
    acceso: 'banco',
  },
  {
    path: 'cac',
    icon: TrendingUp,
    title: 'CAC',
    acceso: 'cac',
  },
  {
    path: 'categoria',
    icon: ListIcon,
    title: 'Categoria',
    acceso: 'categoria',
  },
  {
    path: 'dolar',
    icon: AttachMoney,
    title: 'Dólar',
    acceso: 'dolar',
  },
  {
    path: 'rubro',
    icon: MenuBook,
    title: 'Rubros',
    acceso: 'rubro',
  },
  {
    path: 'usuarios',
    icon: People,
    title: 'Usuarios',
    acceso: 'usuarios',
  },
];
