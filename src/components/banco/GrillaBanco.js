import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'banco',
    headerName: 'Banco',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: IrDetalleOP_1
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
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];

export function GrillaBanco({ idSociety }) {
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  const navigate = useNavigate();
  
  const {
    data: bancoInformation,
    isLoading,
    error,
  } = useQuery(['banco', idSociety], () => getMethod(`banco/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idBanco => await deleteMethod(`banco/eliminar/${idSociety.id}`, { id: idBanco }),
    {
      onMutate: async idBanco => {
        await queryClient.cancelQueries(['banco', idSociety]);
        const prevData = queryClient.getQueryData(['banco', idSociety]);
        const newData = prevData.filter(banco => banco.id !== idBanco);
        queryClient.setQueryData(['banco', idSociety], newData);
        return prevData;
      },
      onError: (err, idBanco, context) => queryClient.setQueryData(['banco', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['banco', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`banco/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['banco', idSociety]);
        const prevData = queryClient.getQueryData(['banco', idSociety]);
        const newData = [
          ...prevData.filter(banco => banco.id !== id),
          { ...prevData.find(banco => banco.id === id), [field]: value },
        ];
        queryClient.setQueryData(['banco', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['banco', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['banco', idSociety]),
    }
  );

  const { mutate: irDetalle } = useMutation(
    async banco =>    
      navigate(`./${banco.id}/Cuentas de Banco-${banco.banco}`)
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'banco',
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
          
          rows={bancoInformation.map(banco => ({
            id: banco.id,
            banco: banco.banco,
            descripcionLarga: banco.descripcionLarga,
            deleteId: banco.id,
            onIrDetalle: () => irDetalle(banco),  
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
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['banco', 'descripcionLarga'] }} />
    </GridToolbarContainer>
  );
}

function IrDetalleOP_1(params) {
  const sendRow = params.row.onIrDetalle;  
  const banco = params.row.banco;
  return <Button onClick={sendRow} >{banco}  </Button>;
} 

