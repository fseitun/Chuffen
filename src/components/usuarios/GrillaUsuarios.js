import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { PromptUser, DeleteRow } from 'src/components/auxiliares/DeleteRow';

import { getMethod, postMethod, deleteMethod } from 'src/utils/api';

const columns = (isPromptOpen, setIsPromptOpen) => [
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
    renderCell: rowData => (
      <DeleteRow isPromptOpen={isPromptOpen} setIsPromptOpen={setIsPromptOpen} rowData={rowData} />
    ),
  },
];

export function GrillaUsuarios({ idSociety }) {
  // console.log('idSociety', idSociety);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery(['usuarios', idSociety], () => getMethod(`usuario/listar/${idSociety.id}`));
  // console.log('users', users);

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idUser => await deleteMethod(`usuario/eliminar/${idSociety.id}`, { id: idUser }),
    {
      onMutate: async id => {
        // console.log('eliminando usuario', idUser);
        await queryClient.cancelQueries(['usuarios', idSociety]);
        const prevData = queryClient.getQueryData(['usuarios', idSociety]);
        // console.log('prevData', prevData);
        const newData = prevData.filter(user => user.id !== id);
        queryClient.setQueryData(['usuarios', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['usuarios', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['usuarios', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`usuario/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['usuarios', idSociety]);
        const prevData = queryClient.getQueryData(['usuarios', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(user => user.id !== id),
          { ...prevData.find(user => user.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['usuarios', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['usuarios', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['usuarios', idSociety]),
    }
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={users.map(el => ({
          id: el.id,
          user: el.user,
          mail: el.mail,
          pass: el.pass,
          rolDescripcion: el.pass,
          onDelete: () => eliminate(el.id),
        }))}
        onCellEditCommit={modifyData}
        columns={columns(isPromptOpen, setIsPromptOpen)}
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

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
}
