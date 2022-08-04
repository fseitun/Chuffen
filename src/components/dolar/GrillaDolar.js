
import * as React from 'react';
import { useState, useContext } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';
import { SocietyContext } from 'src/App';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => mostrarFecha(value),
  },
  {
    field: 'BCRA',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'BCRA',
    width: 130,
    editable: true,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'mep',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'MEP',
    width: 130,
    editable: true,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
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

export function GrillaDolar({loggedUser}) {
  const idSociety = useContext(SocietyContext);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  
  const {
    data: dolarInformation,
    isLoading,
    error,
  } = useQuery(['dolar', idSociety], () => getMethod(`dolar/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idDolar => await deleteMethod(`dolar/eliminar/${idSociety.id}`, { id: idDolar }),
    {
      onMutate: async idDolar => {
        await queryClient.cancelQueries(['dolar', idSociety]);
        const prevData = queryClient.getQueryData(['dolar', idSociety]);
        const newData = prevData.filter(dolar => dolar.id !== idDolar);
        queryClient.setQueryData(['dolar', idSociety], newData);
        return prevData;
      },
      onError: (err, idDolar, context) => queryClient.setQueryData(['dolar', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['dolar', idSociety]),
    }
  );
  // eliminate(1);

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`dolar/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['dolar', idSociety]);
        
        const prevData = queryClient.getQueryData(['dolar', idSociety]);
        
        const newData = [
          ...prevData.filter(dolar => dolar.id !== id),
          { ...prevData.find(dolar => dolar.id === id), [field]: value },
        ];
        
        queryClient.setQueryData(['dolar', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['dolar', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['dolar', idSociety]),
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'fecha',
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
          rows={dolarInformation.map(dolar => ({
            id: dolar.id,
            fecha: dolar.fecha,
            BCRA: dolar.BCRA,
            blue: dolar.blue,            
            mep: dolar.mep,
            descripcion: dolar.descripcion,
            deleteId: dolar.id,
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
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['fecha', 'BCRA','blue', 'mep'] }} />
    </GridToolbarContainer>
  );
}

function onlyNumbers(data) {

  const regex = /^\d{0,3}(\.\d{0,2})?$/;
  const isValid = regex.test(data.props.value.toString());
  const error = !isValid;
  return { ...data.props, error };
}
