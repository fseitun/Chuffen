import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ToastContainer } from 'react-toastify';
import { DeleteRow } from 'src/components/auxiliares/DeleteRow';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, postMethod, deleteMethod } from 'src/utils/api';

const columns = [
  // { field: 'id', headerName: 'ID', width: 100 , headerAlign: 'center',},
  {
    field: 'user',
    headerName: 'Usuario',
    width: 170,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'mail',
    headerName: 'Mail',
    width: 220,
    // editable: true,
    headerAlign: 'center',
  },
  {
    field: 'pass',
    headerName: 'Clave',
    width: 150,
    editable: true,
    headerAlign: 'center',
    // renderCell: '*****',
  },
  {
    field: 'rolDescripcion',
    headerName: 'Rol',
    width: 150,
    editable: true,
    headerAlign: 'center',
    // renderCell: '*****',
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

export function GrillaUsuarios({ idSociety }) {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery(['usuarios', idSociety], () => getMethod(`usuario/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idUser => await deleteMethod(`usuario/eliminar/${idSociety.id}`, { id: idUser }),
    {
      onSuccess: async () => await queryClient.refetchQueries(['usuarios', idSociety.id]),
    }
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;
  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={users.map(el => ({
          id: el.id,
          user: el.user,
          mail: el.mail,
          pass: el.pass,
          rolDescripcion: el.pass,
          onDelete: () => eliminate(el.id),
        }))}
        onCellEditCommit={handleCellModification}
        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        scrollbarSize
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );

  function handleCellModification(e) {
    let newData = {
      id: e.id,
      [e.field]: e.props.value,
    };
    postMethod(`usuario/modificar/${idSociety.id}`, newData);
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
}
