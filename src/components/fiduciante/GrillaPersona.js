import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarCUIT } from 'src/utils/utils';

const columns = (puedeEditar, setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 220,
    editable: puedeEditar,
    headerAlign: 'center',
  },

  {
    field: 'mail',
    headerName: 'Mail',
    width: 150,
    editable: puedeEditar,
    headerAlign: 'center',
  },
  {
    field: 'telefono',
    headerName: 'Teléfono',
    width: 140,
    editable: puedeEditar,
    headerAlign: 'center',
    /*
    valueFormatter: ({ value }) => {
      if (value) {
        value = value.split('');
        value.splice(2, 0, '-');
        value.splice(7, 0, '-');
        return value.join('');
      }
    },*/
  },

  {
    field: 'CUIT',
    headerName: 'CUIT',
    width: 130,
    editable: true,
    headerAlign: 'center',
    valueFormatter: ({ value }) => mostrarCUIT(value),
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


export function GrillaPersona({loggedUser, idSociety, tipo }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var puedeEditar = true;
  const acceso = loggedUser?.['rol.fidu'];
  if( acceso ==='vista'){puedeEditar =false}

  const {
    data: personaInformation,
    isLoading,
    error,
  } = useQuery(['persona', idSociety], () => getMethod(`persona/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idPersona => await deleteMethod(`persona/eliminar/${idSociety.id}`, { id: idPersona }),
    {
      onMutate: async idPersona => {
        await queryClient.cancelQueries(['persona', idSociety]);
        const prevData = queryClient.getQueryData(['persona', idSociety]);
        const newData = prevData.filter(persona => persona.id !== idPersona);
        queryClient.setQueryData(['persona', idSociety], newData);
        return prevData;
      },
      onError: (err, idPersona, context) => queryClient.setQueryData(['persona', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['persona', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`persona/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['persona', idSociety]);
        const prevData = queryClient.getQueryData(['persona', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(persona => persona.id !== id),
          { ...prevData.find(persona => persona.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['persona', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['persona', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['persona', idSociety]),
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'nombre',
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
          rows={personaInformation.map(persona => ({
            id: persona?.id,
            nombre: persona?.nombre,
            telefono: persona?.telefono,
            mail: persona?.mail,
            CUIT: persona?.CUIT,
            deleteId: persona?.id,
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

/*
function ComboBox({ rubros, props }) {
  const { id, api, field } = props;

  rubros = [
    ...rubros,
    {
      rubro: '',
    },
  ];
  const [selectedRubro, setSelectedRubro] = useState({
    rubro: '',
  });

  return (
    <Autocomplete
      value={selectedRubro}
      onChange={async (event, newValue) => {
        
        setSelectedRubro(newValue);
     
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      // disablePortal
      id="combo-box-demo"
      options={rubros}
      isOptionEqualToValue={(op, val) => op.rubro === val.rubro}
      getOptionLabel={option => option.rubro}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="Rubro" />}
    />
  );
}

function ComboBoxSub({ subRubros, props }, params) {
  const { id, api, field } = props;

  subRubros = [
    
    ...subRubros.filter(subR => subR.rubroId === parseInt(props?.row?.rubro_filtro)),
    {
      subRubro: '',
    },
  ];

  const [selectedsubRubro, setSelectedsubRubro] = useState({
    subRubro: '',
  });

  return (
    <Autocomplete
      value={selectedsubRubro}
      onChange={async (event, newValue) => {
        
        setSelectedsubRubro(newValue);
      
        
        api.setEditCellValue({ id, field, value: newValue.id }, event);
        await props.api.commitCellChange({ id, field });
        api.setCellMode(id, field, 'view');
      }}
      // disablePortal
      id="combo-box-demo"
      options={subRubros}
      isOptionEqualToValue={(op, val) => op.subRubro === val.subRubro}
      getOptionLabel={option => option.subRubro}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="subRubro" />}
    />
  );
}*/

