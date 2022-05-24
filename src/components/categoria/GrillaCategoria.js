import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (setIsPromptOpen, setRowIdToDelete) => [

  {
    field: 'id',
    headerName: 'id',
    width: 90,
    editable: false,
    hide: true,
    headerAlign: 'center',
    align: 'left',
  },
  
  {
    field: 'codigo',
    headerName: 'Código',
    width: 130,
    editable: true,
    headerAlign: 'center',
    align: 'left',
  },
  {
    field: 'anexo',
    headerName: 'Impuesto de',
    width: 120,
    editable: true,
    headerAlign: 'center',
    align: 'left',
  },
  {
    field: 'concepto',
    headerName: 'Concepto',
    width: 200,
    editable: true,
    headerAlign: 'center',
    align: 'left',
     
    
  },
  {
    field: 'regimen',
    headerName: 'Régimen',
    width: 200,
    editable: true,
    headerAlign: 'center',
    align: 'left',
     
    
  },
  {
    field: 'inscriptos',
    headerName: 'Inscriptos %',
    width: 180,
    editable: true,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),  
  },
  {
    field: 'noInscriptos',
    headerName: 'No Inscr. HUM y SUC %',
    width: 230,
    editable: true,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),  
  },
  {
    field: 'noInscrptoResto',
    headerName: 'No Inscr. Resto %',
    width: 200,
    editable: true,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),  
  },
  {
    field: 'inscriptosNoRet',
    headerName: 'Inscriptos No Ret. $',
    width: 220,
    editable: true,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),  
  },

  {
    field: 'escalaMonto',
    headerName: 'Escala Monto',
    width: 220,
    editable: true,
    headerAlign: 'center',
    align: 'left',
  },

  {
    field: 'escalaPorcentaje',
    headerName: 'Escala %',
    width: 220,
    editable: true,
    headerAlign: 'center',
    align: 'left',
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

export function GrillaCategoria({ idSociety }) {
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  // const navigate = useNavigate();

  const {
    data: catInfo,
    isLoading,
    error,
  } = useQuery(['categoria', idSociety], () => getMethod(`categoria/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idCategoria => await deleteMethod(`categoria/eliminar/${idSociety.id}`, { id: idCategoria }),
    {
      onMutate: async idCategoria => {
        await queryClient.cancelQueries(['categoria', idSociety]);
        const prevData = queryClient.getQueryData(['categoria', idSociety]);
        const newData = prevData.filter(categoria => categoria.id !== idCategoria);
        queryClient.setQueryData(['categoria', idSociety], newData);
        return prevData;
      },
      onError: (err, idCategoria, context) => queryClient.setQueryData(['categoria', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['categoria', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`categoria/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['categoria', idSociety]);
        const prevData = queryClient.getQueryData(['categoria', idSociety]);
        const newData = [
          ...prevData.filter(categoria => categoria.id !== id),
          { ...prevData.find(categoria => categoria.id === id), [field]: value },
        ];
        queryClient.setQueryData(['categoria', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['categoria', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['categoria', idSociety]),
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'id',
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
          rows={catInfo.map(categoria => ({
            id: categoria.id,
            codigo: categoria.codigo,
            anexo: categoria.anexo,
            concepto: categoria.concepto,
            regimen: categoria.regimen,
            inscriptos: categoria.inscriptos,
            noInscriptos: categoria.noInscriptos,
            noInscrptoResto: categoria.noInscrptoResto,
            inscriptosNoRet: categoria.inscriptosNoRet,
            escalaMonto: categoria.escalaMonto,
            escalaPorcentaje: categoria.escalaPorcentaje,
            deleteId: categoria.id,
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
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['categoria'] }} />
    </GridToolbarContainer>
  );
}
