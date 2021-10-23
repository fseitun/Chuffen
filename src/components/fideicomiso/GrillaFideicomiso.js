import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, TextField, Autocomplete } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, deleteMethod, postMethod } from 'src/utils/api';

const columns = function columns(color, setColor) {
  return [
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
      field: 'deleteIcon',
      headerName: '',
      width: 50,
      headerAlign: 'center',
      align: 'center',
      renderCell: DeleteRow,
    },
    {
      field: 'colorElegido',
      headerName: 'Color',
      width: 150,
      editable: true,
      renderCell: ({ row: { colorElegido } }) =>
        true ? <div style={{ width: '100%', height: '100%', background: colorElegido }}></div> : 1,
      renderEditCell: (a, b, c) => {
        const commit = a.api.events.cellEditCommit;
        // console.log(a, b, a.api.events.cellEditCommit);
        return <ColorPicker color={color} setColor={setColor} colorOptions={colors} />;
      },
    },
  ];
};

const colors = [
  { label: 'Rojo', css: 'red' },
  { label: 'Verde', css: 'green' },
];

export function GrillaFideicomiso({ idSociety }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [color, setColor] = useState({ label: 'Rojo', css: 'red' });
  // console.log('color:', color);
  const { mutate } = useMutation(
    async id => {
      await deleteMethod(`fideicomiso/eliminar/${idSociety.id}`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['fideicomiso', idSociety.id]),
    }
  );

  const { data, isLoading, error } = useQuery(['fideicomiso', idSociety?.id], () =>
    getMethod(`fideicomiso/listar/${idSociety?.id}`)
  );
  console.log('data:', data);

  const { mutate: changeDataToFideicomiso } = useMutation(
    async newData => await postMethod(`fideicomiso/modificar/${idSociety?.id}`, newData),
    {
      onMutate: async newData => {
        await queryClient.cancelQueries(['fideicomiso', idSociety?.id]);
        const previousData = queryClient.getQueryData(['fideicomiso', idSociety?.id]);
        queryClient.setQueryData(['fideicomiso', idSociety?.id], oldData => {
          const copyOfOldData = [...oldData];
          console.log('copyOfOldData:', copyOfOldData);
          const changedFideicomiso = copyOfOldData.find(e => newData.id === e.id);
          console.log('changedFideicomiso:', changedFideicomiso);
          console.log('newData:', newData);
          changedFideicomiso.color = newData.color;
          console.log('changedFideicomiso:', changedFideicomiso);
          const newListOfFideicomisos = [
            ...copyOfOldData.filter(e => e.id !== newData.id),
            changedFideicomiso,
          ];
          console.log('newListOfFideicomisos:', newListOfFideicomisos);
          return newListOfFideicomisos;
        });
        return { previousData };
      },
      onError: (err, newData, context) => {
        queryClient.setQueryData(['fideicomiso', idSociety?.id], context.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['fideicomiso', idSociety?.id]);
      },
    }
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={data?.map(el => ({
          id: el.id,
          nombre: el.nombre,
          fechaInicio: el.fechaInicio,
          fechaFin: el.fechaFin,
          colorElegido: el.color,
          onDelete: () => mutate(el.id),
        }))}
        columns={columns(color, setColor)}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        sortModel={[
          {
            field: 'nombre',
            sort: 'asc',
          },
        ]}
        scrollbarSize
        onCellEditCommit={({ id }) => {
          console.log(idSociety?.id, color.css);
          changeDataToFideicomiso({
            id: id,
            color: color.css,
          });
        }}
        // onRowDoubleClick={a => {
        //   console.log(a);
        //   return IrAFideicomiso(a);
        // }}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
  function IrAFideicomiso(params) {
    navigate(`./${params.row.nombre}`);
  }
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function DeleteRow(params) {
  const deleteRow = params.row.onDelete;
  const notify = () =>
    toast(({ closeToast }) => (
      <Box>
        <Button
          sx={{ p: 1, m: 1 }}
          variant="contained"
          color="secondary"
          size="small"
          onClick={closeToast}
        >
          No quiero borrar
        </Button>
        <Button
          sx={{ p: 1, m: 1 }}
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            deleteRow();
            closeToast();
          }}
        >
          Sí quiero borrar
        </Button>
      </Box>
    ));
  return <Delete onClick={notify} />;
}

function ColorPicker({ color, setColor, colorOptions }) {
  // console.log('colorOptions', colorOptions);
  return (
    <Autocomplete
      value={color}
      onChange={(event, newValue) => {
        setColor(newValue);
      }}
      disablePortal
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
/*TODO diente arreglar el doble click en row*/
