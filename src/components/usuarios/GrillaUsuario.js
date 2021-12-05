import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

import { mostrarFecha } from 'src/utils/utils';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
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
    //renderCell: Passformat,
  },
  {
    field: 'rol_descripcion',
    headerName: 'Rol',
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
    renderCell: ({ row: { deleteId } }) => (
      <DeleteIcon
        onClick={e => {
          // console.log('e', e);
          // console.log('deleteId', deleteId);
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];

export function GrillaUsuario({ idSociety }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  // console.log(rowIdToDelete);

  const {
    data: usuarioInformation,
    isLoading,
    error,
  } = useQuery(['usuario', idSociety], () => getMethod(`usuario/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idUsuario => await deleteMethod(`usuario/eliminar/${idSociety.id}`, { id: idUsuario }),
    {
      onMutate: async idUsuario => {
        await queryClient.cancelQueries(['usuario', idSociety]);
        const prevData = queryClient.getQueryData(['usuario', idSociety]);
        const newData = prevData.filter(usuario => usuario.id !== idUsuario);
        queryClient.setQueryData(['usuario', idSociety], newData);
        return prevData;
      },
      onError: (err, idUsuario, context) => queryClient.setQueryData(['usuario', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['usuario', idSociety]),
    }
  );
  // eliminate(1);

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`usuario/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['usuario', idSociety]);
        const prevData = queryClient.getQueryData(['usuario', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(usuario => usuario.id !== id),
          { ...prevData.find(usuario => usuario.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['usuario', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['usuario', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['usuario', idSociety]),
    }
  );

  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
      <div style={{ width: '100%' }}>
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
        <DataGrid
          rows={usuarioInformation.map(usuario => ({
            id: usuario.id,
            user: usuario.user,
            mail: usuario.mail,
            pass: usuario.pass,
            rol_descripcion: usuario.rol_descripcion,
            deleteId: usuario.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(setIsPromptOpen, setRowIdToDelete)}
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
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function onlyNumbers(data) {
  console.log('data', data);
  const regex = /^\d{0,3}(\.\d{0,2})?$/;
  const isValid = regex.test(data.props.value.toString());
  const error = !isValid;
  return { ...data.props, error };
}

function Passformat(params) {
  //const sendRow = params.row.onIrDetalle;  
  //const empresa = params.row.empresa;
  return '***********';
} 
