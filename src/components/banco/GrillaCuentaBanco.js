import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { Typography } from '@mui/material';
import { usePrompt } from 'src/utils/usePrompt';
import { useParams } from 'react-router-dom';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'cuentaBanco',
    headerName: 'Cuenta',
    width: 170,
    editable: true,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'descripcionLarga',
    headerName: 'Descripcion',
    width: 250,
    editable: true,
    headerAlign: 'center',
    align: 'center',
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

export function GrillaCuentaBanco({ idSociety }) {
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  const { idBanco } = useParams();
  // console.log(rowIdToDelete);

  const {
    data: cuentaBancoInformation,
    isLoading,
    error,
  } = useQuery(['cuentabanco', idSociety], () => getMethod(`cuentabanco/listar/${idSociety.id}/${idBanco}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idCuentaBanco => await deleteMethod(`cuentabanco/eliminar/${idSociety.id}`, { id: idCuentaBanco }),
    {
      onMutate: async idCuentaBanco => {
        await queryClient.cancelQueries(['cuentabanco', idSociety]);
        const prevData = queryClient.getQueryData(['cuentabanco', idSociety]);
        const newData = prevData.filter(cuentabanco => cuentabanco.id !== idCuentaBanco);
        queryClient.setQueryData(['cuentabanco', idSociety], newData);
        return prevData;
      },
      onError: (err, idCuentaBanco, context) => queryClient.setQueryData(['cuentabanco', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['cuentabanco', idSociety]),
    }
  );
  // eliminate(1);

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`cuentabanco/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['cuentabanco', idSociety]);
        const prevData = queryClient.getQueryData(['cuentabanco', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(cuentabanco => cuentabanco.id !== id),
          { ...prevData.find(cuentabanco => cuentabanco.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['cuentabanco', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cuentabanco', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['cuentabanco', idSociety]),
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
          rows={cuentaBancoInformation.map(cuentabanco => ({
            id: cuentabanco.id,
            cuentaBanco: cuentabanco.cuentaBanco,
            descripcionLarga: cuentabanco.descripcionLarga,
            deleteId: cuentabanco.id,
          }))}
          onCellEditCommit={modifyData}
        
        compone
          columns={columns(setIsPromptOpen, setRowIdToDelete)}
          pageSize={25}
          disableSelectionOnClick
          autoHeight
         
          scrollbarSize
          components={{
            Toolbar: CustomToolbar,
          }}
        />
        <Typography align="left" color="textPrimary" variant="h5">                        
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Typography>
        <Typography align="left" color="textPrimary" variant="h5">                        
            Para visualizar los cambios en otras pantallas del sistema es necesario salir y volver a loguearse, gracias.
        </Typography>
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
