import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { mostrarCUIT } from 'src/utils/utils';

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
    width: 130,
    // editable: true,
    headerAlign: 'center',
    valueFormatter: ({ value }) => mostrarCUIT(value),
  },
  {
    field: 'telefono',
    headerName: 'Teléfono',
    width: 140,
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
    field: 'CBU',
    headerName: 'CBU',
    width: 110,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'banco',
    headerName: 'Banco',
    width: 120,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'nroCuenta',
    headerName: '# Cuenta',
    width: 140,
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

export function GrillaProveedores({ idSociety }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async id => {
      await deleteMethod(`proveedor/eliminar/${idSociety.id}`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['empresas', idSociety.id]),
    }
  );

  const { data, isLoading, error } = useQuery(['empresas', idSociety.id], () =>
    getMethod(`proveedor/listar/${idSociety.id}`)
  );

  if (isLoading) return 'Cargando...';
  
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    let newData = {
      id: e.id,
      [e.field]: e.value,
    };
    postMethod(`proveedor/modificar/${idSociety.id}`, newData);
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
          CBU: el.CBU,
          banco: el.banco,
          nroCuenta: el.nroCuenta,
          onDelete: () => {
            mutate(el.id);
          },
        }))}
        columns={columns}
        pageSize={100}
        disableSelectionOnClick
        autoHeight
        scrollbarSize
        onCellEditCommit={handleCellModification}
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
