import React from 'react';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const orders = [
  {
    id: uuid(),
    ref: '3-1034',
    amount: 1054605.12,
    customer: {
      name: 'Hormigones Avellaneda'
    },
    createdAt: 1616337400000,
    status: 'OP aprobada'
  },
  {
    id: uuid(),
    ref: '3-0015',
    amount: 25.1,
    customer: {
      name: 'Jorge Construcciones'
    },
    createdAt: 1617337400000,
    status: 'Pendiente'
  },
  {
    id: uuid(),
    ref: '3-0215',
    amount: 10.99,
    customer: {
      name: 'Ferrum'
    },
    createdAt: 1620237400000,
    status: 'Pendiente'
  },
  {
    id: uuid(),
    ref: '3-9813',
    amount: 96.43,
    customer: {
      name: 'Carpinterías 3M'
    },
    createdAt: 1619337400000,
    status: 'Pendiente'
  },
  {
    id: uuid(),
    ref: '4-0015',
    amount: 32.54,
    customer: {
      name: 'Corralón el Trébol'
    },
    createdAt: 1618337400000,
    status: 'Pendiente'
  },
  {
    id: uuid(),
    ref: '3-0076',
    amount: 16.76,
    customer: {
      name: 'Acelor'
    },
    createdAt: 1614337400000,
    status: 'Cheque rechazado'
  }
];

const LatestOrders = (props) => (
  <Card {...props}>
    <CardHeader title="Facturas Impagas" />
    <Divider />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>nº</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    Fecha
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow hover key={order.id}>
                <TableCell>{order.ref}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>
                  {moment(order.createdAt).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>
                  <Chip color="primary" label={order.status} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box>
  </Card>
);

export default LatestOrders;
