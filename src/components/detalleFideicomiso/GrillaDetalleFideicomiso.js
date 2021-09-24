import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, postMethod, deleteMethod } from 'src/utils/api';

const columns = [
  {
    field: 'codigo',
    headerName: 'Código',
    width: 140,
    editable: false,
    headerAlign: 'center',
    align: 'center'
  },

  {
    field: 'metros',
    headerName: 'Metros',
    width: 130,
    editable: false,
    headerAlign: 'center',
    align: 'right'
  },

  {
    field: 'precioULT',
    headerName: 'Precio',
    width: 150,
    editable: false,
    headerAlign: 'center',
    align: 'right'
  },


  {
    field: 'deleteIcon',
    headerName: '',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: DeleteRow,
  },
];

export function GrillaDetalleFideicomiso() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async id => {
      await deleteMethod(`producto/eliminar/1/1`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['producto', '1']),
    }
  );

  const { data, isLoading, error } = useQuery(['producto', '1'], () =>
    getMethod(`producto/listar/1/1`)
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    console.log(e);
    let newData = {
      id: e.id,
      [e.field]: e.props.value,
    };
    postMethod(`producto/modificar/1/1`, newData);
  }

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={data.map(el => ({
          id: el.id,
        // fideicomisoId: el.fideicomisoId,
          codigo: el.codigo,
          metros: el.metros,
          precioULT: el.precioULT,
          onDelete: () => mutate(el.id),
        }))}
        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        sortModel={[
          {
            field: 'codigo',
            sort: 'asc',
          },
        ]}
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
