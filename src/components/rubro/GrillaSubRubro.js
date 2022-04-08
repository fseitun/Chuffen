import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';


const columns = (setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'subRubro',
    headerName: 'SubRubro',
    width: 260,
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
    
        const newData = [
          ...prevData.filter(subrubro => subrubro.id !== id),
          { ...prevData.find(subrubro => subrubro.id === id), [field]: value },
        ];

        queryClient.setQueryData(['subrubro', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['subrubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['subrubro', idSociety]),
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'subRubro',
      sort: 'asc',
    },
  ]);

  const onSort = (newSort) => {

    if(newSort.length === 0){
      newSort.push(sortModel[0]);
      if(sortModel[0]?.sort === 'asc'){
        newSort[0].sort = 'desc';
      }else{
        newSort[0].sort = 'asc';
      }
    }
    setSortModel(newSort);    
  };

  const [pageSize, setPageSize] = useState(25);

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
          
          sortModel={sortModel}
          onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
       
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          pagination

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
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['subRubro'] }} />
    </GridToolbarContainer>
  );
}
