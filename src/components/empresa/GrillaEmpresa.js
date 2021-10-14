import React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { Button, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, postMethod, deleteMethod } from 'src/utils/api';

const columns = [
  // { field: 'id', headerName: 'ID', width: 100 , headerAlign: 'center',},
  {
    field: 'razonSocial',
    headerName: 'Razón Social',
    width: 170,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'CUIT',
    headerName: 'CUIT',
    width: 150,
    // editable: true,
    headerAlign: 'center',
    valueFormatter: ({ value }) => {
      value = value.split('');
      value.splice(2, 0, '-');
      value.splice(5, 0, '.');
      value.splice(9, 0, '.');
      value.splice(13, 0, '-');
      return value.join('');
    },
  },
  {
    field: 'telefono',
    headerName: 'Teléfono',
    width: 150,
    editable: true,
    headerAlign: 'center',
    valueFormatter: ({ value }) => {
      if (value) {
        value = value.split('');
        value.splice(2, 0, '-');
        value.splice(7, 0, '-');
        return value.join('');
      }
    },
  },
  {
    field: 'mail',
    headerName: 'Mail',
    width: 150,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: DeleteRow,
  },
];

export function GrillaEmpresa({ idSociedad }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async id => {
      await deleteMethod(`empresa/eliminar/${idSociedad}`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['empresas', idSociedad]),
    }
  );

  const { data, isLoading, error } = useQuery(['empresas', idSociedad], () =>
    getMethod(`empresa/listar/${idSociedad}`)
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    let newData = {
      id: e.id,
      [e.field]: e.props.value,
    };
    postMethod(`empresa/modificar/${idSociedad}`, newData);
  }

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={data.map(el => ({
          id: el.id,
          razonSocial: el.razonSocial,
          CUIT: el.CUIT,
          mail: el.mail,
          telefono: el.telefono,
          cuentaBancariaId: el.cuentaBancariaId,
          onDelete: () => {
            mutate(el.id);
          },
        }))}
        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        scrollbarSize
        onEditCellChange={handleCellModification}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function DeleteRow(params) {
  const deleteRow = params.row.onDelete;
  const notify = () =>
    toast(({ closeToast }) => (
      <Box>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={closeToast}>
          No quiero borrar
        </Button>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={() => {
            deleteRow();
            closeToast();
          }}>
          Sí quiero borrar
        </Button>
      </Box>
    ));
  return <Delete onClick={notify} />;
}
