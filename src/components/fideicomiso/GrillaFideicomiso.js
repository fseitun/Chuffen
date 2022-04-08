import * as React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { TextField, Autocomplete, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { NavLink as RouterLink } from 'react-router-dom';
const apiServerUrl = process.env.REACT_APP_API_SERVER;

const columns = (color, setColor, id,  setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 200,
    headerAlign: 'center',
    align: 'left',
    renderCell: IrDetalleOP_0
  },
  {
    field: 'fechaInicio',
    headerName: 'Inicio',
    editable: true,
    width: 170,
    type: 'date',
    headerAlign: 'center',      
    align: 'center',
    valueFormatter: ({ value }) =>
      new Date(value).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
    
  },
  {
    field: 'fechaFin',
    headerName: 'Finalización',
    editable: true,
    width: 170,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
      new Date(value).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
  },
  {
    field: 'mailOP',
    headerName: 'Mail Contador',
    width: 200,
    editable: true,
    headerAlign: 'center',
    align: 'left',
  },
  {
    field: 'logo',
    headerName: 'Logo',
    sortable: false,
    width: 150,
    renderCell: passedData =>
      passedData.row.logo ? (
        <img
          style={{ display: 'block', margin: 'auto', width: '30%' }}
          src={`${apiServerUrl}sociedades/${id}/${passedData.row.logo}`}
          alt="logo"
        />
      ): (""), 
  },

  {
    field: 'colorElegido',
    headerName: 'Color',
    width: 150,
    sortable: false,
    editable: false,
    renderCell: ({ row: { colorElegido } }) => (
      <div style={{ width: '100%', height: '100%', background: colorElegido }}></div>
    ),
    renderEditCell: ({ row: { colorElegido } }) => (
      <ColorPicker
        originalColor={colors.filter(color => color.css === colorElegido)[0]}
        color={color}
        setColor={setColor}
        colorOptions={colors}
      />
    ),
  },

];

const colors = [
  { label: 'red', css: 'red' },
  { label: 'DarkGreen', css: 'DarkGreen' },
  { label: 'MidnightBlue', css: 'MidnightBlue' },
  { label: 'black', css: 'black' },
  { label: 'Salmon', css: 'LightSalmon' },
  { label: 'Khaki', css: 'Khaki' },
  { label: 'Bisque', css: 'Bisque' },
  { label: 'Plum', css: 'Plum' },
  { label: 'Orchid', css: 'Orchid' },
  { label: 'Chocolate', css: 'Chocolate' },
  { label: 'LightSteelBlue', css: 'LightSteelBlue' },  
  { label: 'orange', css: 'orange' },
  { label: 'green', css: 'green' }
 
];

export function GrillaFideicomiso({ idSociety }) {

  const [color, setColor] = useState(null);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  //const navigate = useNavigate();

  const {
    data: fideicomisoInformation,
    isLoading,
    error,
  } = useQuery(['fideicomiso', idSociety], () => getMethod(`fideicomiso/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idFideicomiso => await deleteMethod(`fideicomiso/eliminar/${idSociety.id}`, { id: idFideicomiso }),
    {
      onMutate: async idFideicomiso => {
        await queryClient.cancelQueries(['fideicomiso', idSociety]);
        const prevData = queryClient.getQueryData(['fideicomiso', idSociety]);
        const newData = prevData.filter(fideicomiso => fideicomiso.id !== idFideicomiso);
        queryClient.setQueryData(['fideicomiso', idSociety], newData);
        return prevData;
      },
      onError: (err, idFideicomiso, context) => queryClient.setQueryData(['fideicomiso', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['fideicomiso', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`fideicomiso/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['fideicomiso', idSociety]);
        const prevData = queryClient.getQueryData(['fideicomiso', idSociety]);

        const newData = [
          ...prevData.filter(fideicomiso => fideicomiso.id !== id),
          { ...prevData.find(fideicomiso => fideicomiso.id === id), [field]: value },
        ];

        queryClient.setQueryData(['fideicomiso', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['fideicomiso', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['fideicomiso', idSociety]),
    }
  );
/*
  function IrAFideicomiso(params) {
    navigate(`./${params.row.nombre}`);
  }*/

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
          rows={fideicomisoInformation.map(fideicomiso => ({
            id: fideicomiso.id,
            nombre: fideicomiso.nombre,
            fechaInicio: fideicomiso.fechaInicio,
            fechaFin: fideicomiso.fechaFin,
            colorElegido: fideicomiso.color,
            logo: fideicomiso.logo,
            cloud: fideicomiso.cloud,
            mailOP: fideicomiso.mailOP,
            deleteId: fideicomiso.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(color, setColor, idSociety?.id, setIsPromptOpen, setRowIdToDelete)}
          
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

function IrDetalleOP_0(params) {
  // navigate(`./${params.row.nombre}`);
  let path = `./${params.row.id}/${params.row.nombre}`;
  
  return <Button
          component={RouterLink}
          sx={{color: 'primary.main',}}
          to={path}
        >
          <span>{ params.row.nombre }</span>
        </Button>

} 


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['nombre','fechaInicio','fechaFin'] }} />
    </GridToolbarContainer>
  );
}




function ColorPicker({ color, setColor, colorOptions, originalColor }) {
  useEffect(
    () =>
      setColor(previousStateColor =>
        originalColor?.css !== previousStateColor?.css ? originalColor : previousStateColor
      ),
    [originalColor, setColor]
  );
  return (
    <Autocomplete
      value={color}
      onChange={(event, newValue) => {
        setColor(newValue);
      }}
      options={colorOptions}
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      renderInput={params => <TextField style={{ background: color?.css }} {...params} />}
      renderOption={(props, option, c) => {
        
        return (
          <div {...props} style={{ background: option?.css }}>
            {option.label}
          </div>
        );
      }}
    />
  );
}
