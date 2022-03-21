import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'rubro',
    headerName: 'Rubro',
    width: 260,
    editable: false,
    headerAlign: 'center',
    align: 'left',
    renderCell: IrDetalleOP_1
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

export function GrillaRubro({ idSociety }) {
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  const navigate = useNavigate();

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
        const newData = [
          ...prevData.filter(rubro => rubro.id !== id),
          { ...prevData.find(rubro => rubro.id === id), [field]: value },
        ];
        queryClient.setQueryData(['rubro', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['rubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['rubro', idSociety]),
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'rubro',
      sort: 'asc',
    },
  ]);

  const { mutate: irDetalle } = useMutation(
    async rubro =>    
      navigate(`./${rubro.id}/Subrubros-${rubro.rubro}`)
      
  );


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
          rows={rubroInformation.map(rubro => ({
            id: rubro.id,
            rubro: rubro.rubro,
            deleteId: rubro.id,
            onIrDetalle: () => irDetalle(rubro),  
          }))}
          onCellEditCommit={modifyData}
        
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
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['rubro'] }} />
    </GridToolbarContainer>
  );
}

function IrDetalleOP_1(params) {
  const sendRow = params.row.onIrDetalle;  
  const rubro = params.row.rubro;
  return <Button onClick={sendRow} >{rubro}  </Button>;
} 
