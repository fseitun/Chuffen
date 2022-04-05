import * as React from 'react';
import { useState } from 'react';
import { Button} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { NavLink as RouterLink } from 'react-router-dom';

const columns = (puedeEditar, setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'id',
    headerName: 'Id',
    width: 55,
    editable: false,
    headerAlign: 'center',
    renderCell: IrDetalleOP_0
  },
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 155,
    editable: puedeEditar,
    headerAlign: 'center',
    renderCell: IrDetalleOP_1
  },
  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    width: 160,
    editable: false,
    headerAlign: 'center',
    align: 'left',
  }, 
  {
    field: 'fiduciante',
    headerName: 'Fiduciante',
    width: 170,
    editable: false,
    headerAlign: 'center',
  },
 
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    hide: !puedeEditar,
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


export function GrillaContrato({idSociety, loggedUser }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  const {
    data: dataContrato,
    isLoading,
    error,
    refetch,
  } = useQuery(['contrato', idSociety], () => getMethod(`contrato/listar/${idSociety.id}/0`));


  var puedeEditar = true;
  const acceso = loggedUser?.['rol.contrato'];
  if( acceso ==='vista'){puedeEditar =false}

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idContrato => await deleteMethod(`contrato/eliminar/${idSociety.id}`, { id: idContrato }),
    {
      onMutate: async idContrato => {
        await queryClient.cancelQueries(['contrato', idSociety]);
        
        const prevData = queryClient.getQueryData(['contrato', idSociety]);
        return prevData;
      },
      onError: (err, idContrato, context) => queryClient.setQueryData(['contrato', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['contrato', idSociety])
        }
        refetch()        
      }
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
    
      await postMethod(`contrato/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }), 
    {
      onMutate: async ({ field, id, value }) => {
        console.log(field, id, value, idSociety);
        await queryClient.cancelQueries(['contrato', idSociety]);
        const prevData = queryClient.getQueryData(['contrato', idSociety]);
        /*
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(contrato => contrato.id !== id),
          { ...prevData.find(contrato => contrato.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['contrato', idSociety], newData);*/
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['contrato', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['contrato', idSociety])
        }
        refetch()        
      }
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'id',
      sort: 'desc',
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
          rows={dataContrato?.map(contrato => ({
            id: contrato?.id,
            nombre: contrato?.nombre,
            fideicomiso: (contrato?.fideicomisos? contrato?.fideicomisos[0]?.nombre:''),            
            fiduciante:(contrato?.empresaId>0? contrato?.empresas[0]?.razonSocial:contrato?.personas? contrato?.personas[0]?.nombre:""), 
            deleteId: contrato?.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(puedeEditar, setIsPromptOpen, setRowIdToDelete)}
          
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
      <GridToolbarExport csvOptions={{ fields: ['nombre', 'mail', 'telefono'] }} />
    </GridToolbarContainer>
  );
}

function IrDetalleOP_0(params) {

  let path = `${params.row.id}/Detalle Contrato`;
  
  return <Button
          component={RouterLink}
          sx={{color: 'primary.main',}}
          to={path}
        >
          <span>{ params.row.id }</span>
        </Button>

} 

function IrDetalleOP_1(params) {

  let path = `${params.row.id}/Detalle Contrato`;
  
  return <Button
          component={RouterLink}
          sx={{color: 'primary.main',}}
          to={path}
        >
          <span>{ params.row.nombre }</span>
        </Button>

} 