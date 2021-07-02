import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar'; // pendiente corregir src
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import DatagridProveedores from 'src/components/proveedores/DatagridProveedores';

const queryClient = new QueryClient();

export default function ListaDeProveedores() {
  return (
    <QueryClientProvider client={queryClient}>
      <BuscarProveedores />
    </QueryClientProvider>
  );
}

function BuscarProveedores() {
  const api = () =>
    fetch('http://localhost:3000/proveedor/listar/1').then((res) => res.json());

  const { isLoading, error, data } = useQuery('buscarProveedores', api);

  if (isLoading) return 'Cargando...';

  if (error) return `Hubo un error: ${error.message}`;

  const filas = data.map((el) => ({
    razonSocial: el.razonSocial,
    CUIT: el.CUIT,
    mail: el.mail,
    telefono: el.telefono,
    telefono2: el.telefono2,
    Descripcion: el.Descripcion,
    cuentaBancariaId: el.cuentaBancariaId
  }));

  return (
    <>
      <Helmet>
        <title>Proveedores | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar />
          <Box sx={{ pt: 3 }}>
            <DatagridProveedores proveedores={filas} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
