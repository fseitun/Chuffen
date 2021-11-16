import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, TextField, Autocomplete } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, deleteMethod, postMethod } from 'src/utils/api';
import { Uploader } from 'src/components/auxiliares/Uploader';
const apiServerUrl = process.env.REACT_APP_API_SERVER;

const columns = function columns(color, setColor, id, setNewLogoFlag) {
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
      field: 'logo',
      headerName: 'Logo',
      width: 150,
      renderCell: passedData => {
        // console.log('passedData:', passedData);
        return passedData.row.logo ? (
          <img
            style={{ display: 'block', margin: 'auto', width: '30%' }}
            src={`${apiServerUrl}sociedades/${id}/${passedData.row.logo}`}
            alt="logo"
          />
        ) : (
          <Uploader fideId={passedData.id} setNewLogoFlag={setNewLogoFlag} />
        );
      },
    },
    {
      field: 'colorElegido',
      headerName: 'Color',
      width: 150,
      editable: true,
      renderCell: ({ row: { colorElegido } }) => (
        <div style={{ width: '100%', height: '100%', background: colorElegido }}></div>
      ),
      renderEditCell: (a, b, c) => {
        const commit = a.api.events.cellEditCommit;
        // console.log(a, b, a.api.events.cellEditCommit);
        return (
          <ColorPicker
            color={color}
            setColor={setColor}
            colorOptions={colors}
            setNewLogoFlag={setNewLogoFlag}
          />
        );
      },
    },
    {
      field: 'deleteIcon',
      headerName: '',
      width: 50,
      headerAlign: 'center',
      align: 'center',
      renderCell: DeleteRow,
    },
  ];
};

const colors = [
  { label: 'Rojo', css: 'red' },
  { label: 'Verde', css: 'green' },
  { label: 'Azul', css: 'blue' },
];

export function GrillaFideicomiso({ idSociety }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [color, setColor] = useState({ label: 'Rojo', css: 'red' });
  // console.log('color:', color);
  const [newLogoFlag, setNewLogoFlag] = useState(false);
  // console.log('newLogoFlag:', newLogoFlag);

  const { mutate } = useMutation(
    async id => {
      await deleteMethod(`fideicomiso/eliminar/${idSociety.id}`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['fideicomiso', idSociety.id]),
    }
  );

  const {
    data: dataFromFideicomisos,
    isLoading,
    error,
  } = useQuery(['fideicomiso', idSociety?.id, newLogoFlag], () =>
    getMethod(`fideicomiso/listar/${idSociety?.id}`)
  );
  // console.log('dataFromFideicomisos:', dataFromFideicomisos);

  const { mutate: changeDataToFideicomiso } = useMutation(
    async newData => {
      console.log('newData', newData);
      return await postMethod(`fideicomiso/modificar/${idSociety?.id}`, newData);
    },
    {
      onMutate: async newColor => {
        // console.log('newColor', newColor);
        await queryClient.cancelQueries(['fideicomiso', idSociety?.id]);

        const previousFideicomisoData = queryClient.getQueryData([
          'fideicomiso',
          idSociety?.id,
          newLogoFlag,
        ]);
        // console.log('previousFideicomisoData', previousFideicomisoData);

        queryClient.setQueryData(['fideicomiso', idSociety?.id, newLogoFlag], oldData => {
          console.log('oldData:', oldData);
          const copyOfOldData = [...oldData];
          // console.log('copyOfOldData:', copyOfOldData);
          const changedFideicomiso = copyOfOldData.find(e => newColor.id === e.id);
          // console.log('changedFideicomiso:', changedFideicomiso);
          // console.log('newData:', newData);
          changedFideicomiso.color = newColor.color;
          // console.log('changedFideicomiso:', changedFideicomiso);
          const newListOfFideicomisos = [
            ...copyOfOldData.filter(e => e.id !== newColor.id),
            changedFideicomiso,
          ];
          // console.log('newListOfFideicomisos:', newListOfFideicomisos);
          return newListOfFideicomisos;
        });

        return { previousFideicomisoData };
      },
      onError: (err, newData, context) => {
        queryClient.setQueryData(
          ['fideicomiso', idSociety?.id, newLogoFlag],
          context.previousFideicomisoData
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(['fideicomiso', idSociety?.id, newLogoFlag]);
      },
    }
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={dataFromFideicomisos?.map(el => ({
          id: el.id,
          nombre: el.nombre,
          fechaInicio: el.fechaInicio,
          fechaFin: el.fechaFin,
          colorElegido: el.color,
          logo: el.logo,
          onDelete: () => mutate(el.id),
        }))}
        columns={columns(color, setColor, idSociety?.id, setNewLogoFlag)}
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
          // console.log(idSociety?.id, color.css);
          changeDataToFideicomiso({
            id: id,
            color: color.css,
          });
        }}
        // onRowDoubleClick={a => {
        // console.log(a);
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
