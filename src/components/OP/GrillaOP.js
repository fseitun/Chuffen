import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, deleteMethod } from 'src/utils/api';

const columns = [
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 200,
    headerAlign: 'center',
    align: 'left',
  },

  {
    field: 'fechaInicio',
    headerName: 'Inicio',
    width: 170,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
      new Date(value).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
  },

  {
    field: 'fechaFin',
    headerName: 'Finalización',
    width: 170,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
      new Date(value).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
  },
  //TODO: trabajar concepto desarrollado en https://codesandbox.io/s/ecstatic-ganguly-zi67p?file=/src/App.js
  {
    field: 'color',
    headerName: 'Color',
    width: 150,
    headerAlign: 'center',
    renderCell: ({ value }) => <div style={{ width: '100%', height: '100%', background: value }} />,
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
export function GrillaOP({ idSociety }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async (id) => {
      await deleteMethod(`OP/eliminar/${idSociety.id}`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['OP', idSociety.id]),
    }
  );

  const { data, isLoading, error } = useQuery(['OP', idSociety.id], () =>
    getMethod(`OP/listar/${idSociety.id}`)
  );
  // console.log(data);

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={data.map((el) => ({
          id: el.id,
          nombre: el.nombre,
          fechaInicio: el.fechaInicio,
          fechaFin: el.fechaFin,
          color: el.color,
          onDelete: () => mutate(el.id),
        }))}
        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        sortModel={[
          {
            field: 'nombre',
            sort: 'asc',
          },
        ]}
        scrollbarSize
        onRowDoubleClick={(a) => IrAOP(a)}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
  function IrAOP(params) {
    navigate(`./${params.row.nombre}`);
  }
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
