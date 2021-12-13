import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { Box, Button, Autocomplete, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { mostrarCUIT } from 'src/utils/utils';

function columns(rubros, subRubros, changeProveedor) {
  return [
    // { field: 'id', headerName: 'ID', width: 100 , headerAlign: 'center',},
    {
      field: 'razonSocial',
      headerName: 'Razón Social',
      width: 170,
      editable: true,
      headerAlign: 'center',
    },
    {
      field: 'CUIT',
      headerName: 'CUIT',
      width: 130,
      // editable: true,
      headerAlign: 'center',
      valueFormatter: ({ value }) => mostrarCUIT(value),
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      width: 140,
      editable: true,
      headerAlign: 'center',
      valueFormatter: ({ value }) => {
        if (value) {
          value = value.split('');
          value.splice(2, 0, '-');
          value.splice(7, 0, '-');
          return value.join('');
        }
      },
    },
    {
      field: 'mail',
      headerName: 'Mail',
      width: 150,
      editable: true,
      headerAlign: 'center',
    },
    {
      field: 'CBU',
      headerName: 'CBU',
      width: 110,
      editable: true,
      headerAlign: 'center',
    },
    {
      field: 'banco',
      headerName: 'Banco',
      width: 120,
      editable: true,
      headerAlign: 'center',
    },
    {
      field: 'nroCuenta',
      headerName: '# Cuenta',
      width: 140,
      editable: true,
      headerAlign: 'center',
    },

    {
      field: 'rubroID',
      headerName: 'Rubro',
      width: 140,
      editable: true,
      renderCell: ({ value }) => value.nombre,
      renderEditCell: props => <ComboBox rubros={rubros} props={props} />,
      headerAlign: 'center',
    },

    {
      field: 'subrubroID',
      headerName: 'Sub Rubro',
      width: 140,
      editable: true,
      renderCell: ({ value }) => value.nombre,
      renderEditCell: props => <ComboBoxSub subRubros={subRubros} props={props} />,
      headerAlign: 'center',
    },
    {
      field: 'deleteIcon',
      headerName: ' ',
      width: 50,
      headerAlign: 'center',
      align: 'center',
      renderCell: DeleteRow,
    },
  ];
}

export function GrillaProveedor({ idSociety }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async id => {
      await deleteMethod(`proveedor/eliminar/${idSociety.id}`, id);
    },
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['empresas', idSociety.id]),
    }
  );

  const {
    data: infoProveedores,
    isLoading,
    error,
  } = useQuery(['proveedores', idSociety], () =>
    getMethod(`proveedor/listar/${idSociety.id}`)
  );


  const { data: rubros } = useQuery(['rubros', idSociety], () =>
    getMethod(`rubro/listar/${idSociety.id}`)
  );


    const { data: subRubros } = useQuery(['subrubros', idSociety], () =>
    getMethod(`subrubro/listar/${idSociety.id}/0`)
  );

  const { mutate: changeProveedor } = useMutation(
    async ({ field, value, id }) => {
      const payload = {
        id,
        [field]: value,
      };
      await postMethod(`proveedor/modificar/${idSociety.id}`, payload);
    },
    {
      onMutate: async ({ field, value, id }) => {
       
        await queryClient.cancelQueries(['proveedores', idSociety]);
        const prevData = queryClient.getQueryData(['proveedores', idSociety]);
        
        const newData = [
          ...prevData.filter(proveedor => proveedor.id !== id),
          {
            ...prevData.find(proveedor => proveedor.id === id),
            [field]: value,
          },
        ];

        await queryClient.setQueryData(['proveedores', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) =>
        queryClient.setQueryData(['proveedores', idSociety], context),
      onSettled: () =>
        queryClient.invalidateQueries(['proveedores', idSociety]),
    }
  );



  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;
  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={infoProveedores.map(el => ({
          id: el.id,
          rubroID: {
            id: el.rubroId,
            nombre: rubros?.find(rubro => rubro.id === el.rubroId)?.rubro,
          },
          subrubroID: {
            id: el.subrubroId,
            nombre: subRubros?.find(subRubro => subRubro.id === el.subrubroId)?.subRubro,
          },
        
          razonSocial: el.razonSocial,
          CUIT: el.CUIT,
          mail: el.mail,
          telefono: el.telefono,
          CBU: el.CBU,
          banco: el.banco,
          nroCuenta: el.nroCuenta,
          onDelete: () => {
            mutate(el.id);
          },
        }))}
        columns={columns(rubros, subRubros, changeProveedor)}
        pageSize={100}
        disableSelectionOnClick
        autoHeight
        scrollbarSize
        onCellEditCommit={data => changeProveedor(data)}
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
      disablePortal
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
  const { id, api, field, row } = props;
  console.log('props que recibe el combo', props?.row?.rubroID.id);
  subRubros = [
    
    ...subRubros.filter(subR => subR.rubroId == parseInt(props?.row?.rubroID.id)),
    {
      subRubro: '',
    },
  ];
  // console.log('AAAAA',subRubros);
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
      disablePortal
      id="combo-box-demo"
      options={subRubros}
      isOptionEqualToValue={(op, val) => op.subRubro === val.subRubro}
      getOptionLabel={option => option.subRubro}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="subRubro" />}
    />
  );
}
