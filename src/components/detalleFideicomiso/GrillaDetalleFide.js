import * as React from 'react';
import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { useContext } from 'react';
import { TipoProductosContext} from 'src/App';

const columns = (puedeEditar, setIsPromptOpen, setRowIdToDelete) => [

  {
    field: 'id',
    headerName: 'Id',
    width: 55,
    editable: false,
    headerAlign: 'center',
  },  

  {
    field: 'tipo',
    headerName: 'Tipo',
    width: 140,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },
  
  {
    field: 'codigo',
    headerName: 'Unidad',
    width: 140,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },

  {
    field: 'mtCubiertos',
    headerName: 'm² Cubierto',
    type: 'number',
    width: 160,
    editable: true,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  
  {
    field: 'mtSemiCubiertos',
    headerName: 'm² SemiCub.',
    type: 'number',
    width: 160,
    editable: true,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'mtTerraza',
    headerName: 'm² Terraza',
    type: 'number',
    width: 160,
    editable: true,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'mtTotal',
    headerName: 'm² Tot',
    type: 'number',
    width: 160,
    editable: false,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'mtPor',
    headerName: '%',
    type: 'number',
    width: 100,
    editable: false,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'precioULT',
    type: 'number',
    headerName: 'Precio',
    width: 150,
    editable: true,
    headerAlign: 'center',
    align: 'right',
  },

  {
    field: 'descripcion',
    headerName: 'Descri',
    width: 150,
    editable: true,
    headerAlign: 'center',
    align: 'right',
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


export function GrillaDetalleFide({idSociety, loggedUser, dataFide, isLoading, error, refetch }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var tipoProductos = useContext(TipoProductosContext);

  var puedeEditar = true;
  const acceso = loggedUser?.['rol.fidu'];
  if( acceso ==='vista'){puedeEditar =false}

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idProducto => await deleteMethod(`producto/eliminar/${idSociety.id}`, { id: idProducto }),
    {
      onMutate: async idProducto => {
        await queryClient.cancelQueries(['producto', idSociety]);
        
        const prevData = queryClient.getQueryData(['producto', idSociety]);
        /*
        const newData = prevData.filter(producto => producto.id !== idProducto);
        queryClient.setQueryData(['producto', idSociety], newData);*/
        return prevData;
      },
      onError: (err, idProducto, context) => queryClient.setQueryData(['producto', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['producto', idSociety])
        }
        refetch()        
      }
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
    
      await postMethod(`producto/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }), 
    {
      onMutate: async ({ field, id, value }) => {
        
        await queryClient.cancelQueries(['producto', idSociety]);
        const prevData = queryClient.getQueryData(['producto', idSociety]);
        /*
        const newData = [
          ...prevData.filter(producto => producto.id !== id),
          { ...prevData.find(producto => producto.id === id), [field]: value },
        ];
        queryClient.setQueryData(['producto', idSociety], newData);*/
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['producto', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['producto', idSociety])
        }
        refetch()        
      }
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

  function tot(cub, semi, ter){
    
    let rta = (cub?parseFloat(cub):0.0) + (semi?parseFloat(semi):0.0) + (ter?parseFloat(ter):0.0) ;
    return rta;
  }

  function por(cub, semi, ter, metrosFide){
    let metrosUnidad = tot(cub, semi, ter);
    let rta = 0;
    if(metrosUnidad > 0 && parseFloat(metrosFide) > 0){
         rta = Math.round(metrosUnidad /  parseFloat(metrosFide) * 10000) / 100;
    }
    return rta;
  }

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
          rows={dataFide?.item.map(producto => ({
            id: producto?.id,
            codigo: producto?.codigo,
            mtCubiertos: producto?.mtCubiertos,
            mtSemiCubiertos: producto?.mtSemiCubiertos,
            mtTerraza: producto?.mtTerraza,
            mtTotal: tot(producto?.mtCubiertos, producto?.mtSemiCubiertos, producto?.mtTerraza),
            mtPor: por(producto?.mtCubiertos, producto?.mtSemiCubiertos, producto?.mtTerraza, dataFide?.fide?.metros),
            sector: producto?.sector,            
            precioULT: producto?.precioULT,
            tipo: tipoProductos?.find(t => t.id === producto.tipo)?.descripcion,
            descripcion: producto?.descripcion,
            deleteId: producto?.id,
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