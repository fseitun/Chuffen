import * as React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
// import { Delete as DeleteIcon } from '@mui/icons-material';
import { TextField, Autocomplete } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
// import { mostrarFecha } from 'src/utils/utils';
import { Uploader } from 'src/components/auxiliares/Uploader';
const apiServerUrl = process.env.REACT_APP_API_SERVER;

const columns = (color, setColor, id,  setNewLogoFlag, setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 200,
    headerAlign: 'center',
    align: 'left',
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
    field: 'cloud',
    headerName: 'Cloud',
    editable: true,
    width: 200,
    headerAlign: 'center',
    align: 'left',
  },

  {
    field: 'logo',
    headerName: 'Logo',
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

  /*
  {
    field: 'logo',
    headerName: 'Logo',
    width: 150,
    renderCell: passedData =>
      passedData.row.logo ? (
        <img
          style={{ display: 'block', margin: 'auto', width: '30%' }}
          src={`${apiServerUrl}sociedades/${id}/${passedData.row.logo}`}
          alt="logo"
        />
      ) : (
        <Uploader fideId={passedData.id} setNewLogoFlag={setNewLogoFlag} />
      ),
  },*/
  {
    field: 'colorElegido',
    headerName: 'Color',
    width: 150,
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
        setNewLogoFlag={setNewLogoFlag}
      />
    ),
  },
  /*
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleteId } }) => (
      <DeleteIcon
        onClick={e => {
          // console.log('e', e);
          // console.log('deleteId', deleteId);
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },*/
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
  //const [fechaInicio, setFechaInicio] = useState(null);
  const [newLogoFlag, setNewLogoFlag] = useState(false);
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  // console.log(rowIdToDelete);

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
  // eliminate(1);

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
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(fideicomiso => fideicomiso.id !== id),
          { ...prevData.find(fideicomiso => fideicomiso.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['fideicomiso', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['fideicomiso', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['fideicomiso', idSociety]),
    }
  );

  
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
            deleteId: fideicomiso.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(color, setColor, idSociety?.id, setNewLogoFlag, setIsPromptOpen, setRowIdToDelete)}
          pageSize={25}
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
      <GridToolbarExport />
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
        // console.log(props, option, c);
        return (
          <div {...props} style={{ background: option?.css }}>
            {option.label}
          </div>
        );
      }}
    />
  );
}
