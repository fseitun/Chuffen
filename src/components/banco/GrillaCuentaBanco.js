import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { Autocomplete, TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { usePrompt } from 'src/utils/usePrompt';
import { useParams } from 'react-router-dom';

const columns = (fideicomisos, setIsPromptOpen, setRowIdToDelete) => [
  
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
    field: 'fideicomisoId',
    headerName: 'Fideicomiso',
    width: 150,
    editable: true,
    renderEditCell: props => <ComboBox fideicomisos={fideicomisos} props={props} />,
    headerAlign: 'center',
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

export function GrillaCuentaBanco({ idSociety, fideicomisos }) {
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  const { idBanco } = useParams();

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
        
        const newData = [
          ...prevData.filter(cuentabanco => cuentabanco.id !== id),
          { ...prevData.find(cuentabanco => cuentabanco.id === id), [field]: value },
        ];
        
        queryClient.setQueryData(['cuentabanco', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cuentabanco', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['cuentabanco', idSociety]),
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'cuentaBanco',
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
          sortModel={sortModel}
          rows={cuentaBancoInformation.map(cuentabanco => ({
            id: cuentabanco.id,
            cuentaBanco: cuentabanco.cuentaBanco,
            fideicomisoId: fideicomisos?.find(f => f.id === cuentabanco.fideicomisoId)?.nombre,
            descripcionLarga: cuentabanco.descripcionLarga,
            deleteId: cuentabanco.id,
          }))}
          onCellEditCommit={modifyData}
      
          columns={columns(fideicomisos, setIsPromptOpen, setRowIdToDelete)}
          
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
      <GridToolbarExport csvOptions={{ fields: ['cuentaBanco', 'descripcionLarga'] }} />
    </GridToolbarContainer>
  );
}


function ComboBox({ fideicomisos, props }) {
  const { id, api, field } = props;
  
  fideicomisos = [
    ...fideicomisos,
    /*{
      nombre: 'AAA',
    },*/
  ];
  const [_selected, setSelected] = useState({
    nombre: '...', id: id
  });

  if(props.row.confirmada){
    return (
      <TextField defaultValue={props.row.fideicomiso.nombre }  
      InputProps={{
       readOnly: true,
     }}
    />)
  }else{

  return (
    <Autocomplete
      value={_selected}
      onChange={async (event, newValue) => {        
        setSelected(newValue); 
   
        if(newValue?.id){
          
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      id="combo-box-demo"
      options={fideicomisos}      
      isOptionEqualToValue={(fi, val) => fi.nombre === val.nombre}
      getOptionLabel={option => option.nombre}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="Fideicomiso" />}
    />
  );
    }
}