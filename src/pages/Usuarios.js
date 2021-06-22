import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar'; // pendiente corregir src
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import DatagridUsuarios from 'src/components/usuarios/DatagridUsuarios';

const queryClient = new QueryClient();

export default function ListaDeUsuarios() {
  return (
    <QueryClientProvider client={queryClient}>
      <BuscarUsuarios />
    </QueryClientProvider>
  );
}

function BuscarUsuarios() {
  const api = () =>
    fetch('http://localhost:3000/usuario/listar/1').then((res) => res.json());

  const { isLoading, error, data } = useQuery('buscarUsuarios', api);

  if (isLoading) return 'Cargando...';

  if (error) return `Hubo un error: ${error.message}`;

  const filas = data.map((el) => ({ id: el.id, mail: el.mail, user: el.user }));

  return (
    <>
      <Helmet>
        <title>Usuarios | TSF Desarrollos</title>
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
            <DatagridUsuarios usuarios={filas} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
