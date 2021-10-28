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
    align: 'center',
  },

  {
    field: 'metros',
    headerName: 'Metros',
    type: 'number',
    width: 130,
    editable: true,
    headerAlign: 'center',
    align: 'right',
  },

  {
    field: 'precioULT',
    type: 'number',
    headerName: 'Precio',
    width: 150,
    editable: true,
    headerAlign: 'center',
    align: 'right',
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

export function GrillaDetalleFideicomiso({ idSociety, selectedFideicomisoData }) {
  // console.log('idSociety:', idSociety);
  // console.log('selectedFideicomisoData:', selectedFideicomisoData);
  const {
    data: products,
    isLoading,
    error,
  } = useQuery(['productos', idSociety, selectedFideicomisoData], () =>
    getMethod(`producto/listar/${idSociety?.id}/${selectedFideicomisoData?.id}`)
  );

  const queryClient = useQueryClient();

  const { mutate: deleteProduct } = useMutation(
    async id =>
      await deleteMethod(`producto/eliminar/${idSociety?.id}`, {
        fideicomisoId: selectedFideicomisoData?.id,
        id: id,
      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['productos', idSociety, selectedFideicomisoData]),
    }
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    // console.log('e:', e);
    let newData = {
      id: e.id,
      idFideicomiso: selectedFideicomisoData?.id,
      [e.field]: e.value,
    };
    // console.log('newData:', newData);
    postMethod(`producto/modificar/${idSociety?.id}`, newData);
  }

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={products.map(el => ({
          id: el.id,
          codigo: el.codigo,
          metros: el.metros,
          precioULT: el.precioULT,
          onDelete: () => deleteProduct(el.id),
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
          variant="contained"
          color="secondary"
          size="small"
          onClick={closeToast}
        >
          No quiero borrar
        </Button>
        <Button
          sx={{ p: 1, m: 1 }}
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            deleteRow();
            closeToast();
          }}
        >
          Sí quiero borrar
        </Button>
      </Box>
    ));
  return <Delete onClick={notify} />;
}
