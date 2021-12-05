import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'rubro',
    headerName: 'Rubro',
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

export function GrillaRubro({ idSociety }) {
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  const navigate = useNavigate();
  // console.log(rowIdToDelete);

  const {
    data: rubroInformation,
    isLoading,
    error,
  } = useQuery(['rubro', idSociety], () => getMethod(`rubro/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idRubro => await deleteMethod(`rubro/eliminar/${idSociety.id}`, { id: idRubro }),
    {
      onMutate: async idRubro => {
        await queryClient.cancelQueries(['rubro', idSociety]);
        const prevData = queryClient.getQueryData(['rubro', idSociety]);
        const newData = prevData.filter(rubro => rubro.id !== idRubro);
        queryClient.setQueryData(['rubro', idSociety], newData);
        return prevData;
      },
      onError: (err, idRubro, context) => queryClient.setQueryData(['rubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['rubro', idSociety]),
    }
  );
  // eliminate(1);

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`rubro/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['rubro', idSociety]);
        const prevData = queryClient.getQueryData(['rubro', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(rubro => rubro.id !== id),
          { ...prevData.find(rubro => rubro.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['rubro', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['rubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['rubro', idSociety]),
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
          rows={rubroInformation.map(rubro => ({
            id: rubro.id,
            rubro: rubro.rubro,
            deleteId: rubro.id,
          }))}
          onCellEditCommit={modifyData}
          onRowDoubleClick={a => {
          // console.log(a);
           return IrASubrubro(a);
         }}
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
    function IrASubrubro(params) {
      navigate(`./${params.row.id}/Subrubros-${params.row.rubro}`);
    }
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
