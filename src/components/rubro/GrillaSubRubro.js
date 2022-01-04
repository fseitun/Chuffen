import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';


const columns = (setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'subRubro',
    headerName: 'SubRubro',
    width: 170,
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

export function GrillaSubRubro({ idSociety, idRubro }) {
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  // console.log(rowIdToDelete);

  const {
    data: subrubroInformation,
    isLoading,
    error,
  } = useQuery(['subrubro', idSociety], () => getMethod(`subrubro/listar/${idSociety.id}/${idRubro}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idSubRubro => await deleteMethod(`subrubro/eliminar/${idSociety.id}`, { id: idSubRubro }),
    {
      onMutate: async idSubRubro => {
        await queryClient.cancelQueries(['subrubro', idSociety]);
        const prevData = queryClient.getQueryData(['subrubro', idSociety]);
        const newData = prevData.filter(subrubro => subrubro.id !== idSubRubro);
        queryClient.setQueryData(['subrubro', idSociety], newData);
        return prevData;
      },
      onError: (err, idSubRubro, context) => queryClient.setQueryData(['subrubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['subrubro', idSociety]),
    }
  );
  // eliminate(1);

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`subrubro/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['subrubro', idSociety]);
        const prevData = queryClient.getQueryData(['subrubro', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(subrubro => subrubro.id !== id),
          { ...prevData.find(subrubro => subrubro.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['subrubro', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['subrubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['subrubro', idSociety]),
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
          rows={subrubroInformation.map(subrubro => ({
            id: subrubro.id,
            subRubro: subrubro.subRubro,
            deleteId: subrubro.id,
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
