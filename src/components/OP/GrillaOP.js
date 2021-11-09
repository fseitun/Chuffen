import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, TextField, Autocomplete} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, deleteMethod, postMethod } from 'src/utils/api';

/* const columns = function columns(rubro, setRubro) {
  return [*/

const columns = [
    {
      field: 'createdAt',
      headerName: 'Fecha',
      width: 120,
      type: 'date',
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
    },

    {
      field: 'fideicomiso',
      headerName: 'Fideicomiso',
      width: 160,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'numero',
      headerName: 'Numero',
      width: 130,
      headerAlign: 'center',
      align: 'right',
    },

    {
      field: 'empresa',
      headerName: 'Razón Social',
      width: 160,
      headerAlign: 'center',
      align: 'center',
    },  
    {
      field: 'monto',
      headerName: 'Monto',
      width: 130,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
    },
    {
      field: 'moneda',
      headerName: '',
      width: 70,
      headerAlign: 'center',
      align: 'left',    
    },

    {
      field: 'facturas',
      headerName: 'Facturas',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: arrFacturas,
    },

    {
      field: 'RET_SUSS',
      headerName: 'SUSS',
      width: 120,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
    },
    {
      field: 'RET_GAN',
      headerName: 'SUSS',
      width: 120,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
    },
    {
      field: 'RET_IVA',
      headerName: 'IVA',
      width: 120,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
    },
    {
      field: 'estadoRET',
      headerName: 'Retenciones',
      width: 160,
      headerAlign: 'center',
      align: 'right',    
    },

    {
      field: 'CancelIcon',
      headerName: 'Ap. Obra',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: NonObraAuthRow,
    },

    {
      field: 'DeleteIcon',
      headerName: 'Ap. ADM',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: NonAdmAuthRow,
    },
    {
      field: 'estadoOP',
      headerName: 'Estado',
      width: 140,
      headerAlign: 'center',
      align: 'center',    
    },
    {
      field: 'fondos',
      headerName: 'Fondos',
      width: 140,
      headerAlign: 'center',
      align: 'center',    
    },
    {
      field: 'archivada',
      headerName: 'Archivada',
      width: 140,
      headerAlign: 'center',
      align: 'center',    
    },

    /*

    {
      field: 'rubroId',
      headerName: 'Rubro',
      width: 150,
      editable: true,
      //renderCell: ({ row: { colorElegido } }) => (
      //  <div style={{ width: '100%', height: '100%', background: colorElegido }}></div>
      //),
      renderEditCell: (a, b, c) => {
        const commit = a.api.events.cellEditCommit;
        // console.log(a, b, a.api.events.cellEditCommit);
        return (
          <RubroPicker
            //rubro={rubro}
            //setColor={setColor}
            rubroOptions={rubros}
            //setNewLogoFlag={setNewLogoFlag}
          />
        );
      },
    },*/

    {
      field: 'archivada3',
      headerName: 'Sub Rubro',
      width: 170,
      headerAlign: 'center',
      align: 'center',    
    },
    
    {
      field: 'descripcion',
      headerName: 'Obs.',
      width: 140,
      headerAlign: 'center',
      align: 'center',    
    }, 
  /*];*/
/*};*/
];

const rubros = [
  { label: 1, cass: 'red' },
  { label: 2, cass: 'green' },
  { label: 3, cass: 'blue' },
];

export function GrillaOP({ idSociety }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rubro, setRubro] = useState({ label: 2, cass: 'red' });
  //const [color, setColor] = useState({ label: 'Rojo', css: 'red' });

  const { data: facturas } = useQuery(
    ['facturas'],
    () => getMethod(`factura/listar/${idSociety.id}/todas/0`));

  const { mutate: nonAuthObra } = useMutation(
    async el =>
      await deleteMethod(`autorizacion/eliminar/${idSociety?.id}`, {

        id : el.authOBRA,
        tipoAutorizacion: 'en obra',
        opid : el.id,

      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['OP', idSociety]),
    }
  );

  const { mutate: nonAuthAdm } = useMutation(
    async el =>
      await deleteMethod(`autorizacion/eliminar/${idSociety?.id}`, {

        id : el.authADM,
        tipoAutorizacion: 'adm',
        opid : el.id,

      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['OP', idSociety]),
    }
  );


  const { mutate } = useMutation(
    async (id) => {
      await deleteMethod(`OP/eliminar/${idSociety.id}`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['OP', idSociety.id]),
    }
  );

  const { data, isLoading, error } = useQuery(['OP', idSociety.id], () =>
    getMethod(`OP/listar/${idSociety.id}/todas/nulo`)
  );
  // console.log(data);

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={data.map((el) => ({
          id: el.id,      
          numero: el.numero,
          empresa: el.empresas[0].razonSocial,
          monto: el.monto,
          moneda: el.moneda,
          RET_SUSS: el.RET_SUSS,
          RET_GAN: el.RET_GAN,
          RET_IVA: el.RET_IVA,
          rubroId: el.rubroId,
          estadoRET: el.estadoRET,
          fideicomiso: el.fideicomisos[0].nombre,
          estadoOP: el.estadoOP,
          fondos: el.fondos,
          archivada: el.archivada,
          descripcion: el.descripcion,
          createdAt: el.createdAt,   
         //  auth_obra_id: (el.auth_obra[0]?el.auth_obra[0].id:''),        
          apr_obra: (el.auth_obra[0]?el.auth_obra[0].usuarios[0].user:''),
          // auth_adm_id: (el.auth_adm[0]?el.auth_adm[0].id:''),   
          apr_adm: (el.auth_adm[0]?el.auth_adm[0].usuarios[0].user:''),
          facturas: () => arrFacturas(el, facturas),
          onAuthAdm: () => nonAuthAdm(el),
          onAuthObra: () => nonAuthObra(el),
          /*onDelete: () => mutate(el.id),*/
        }))}
        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        sortModel={[
          {
            field: 'numero',
            sort: 'asc',
          },
        ]}
        scrollbarSize
        onRowDoubleClick={(a) => IrAOP(a)}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
  function IrAOP(params) {
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



function NonObraAuthRow(params) {
  const authRow = params.row.onAuthObra;
  //apr_adm: (el.auth_adm[0]?el.auth_adm[0].usuarios[0].user:''),
  const apr_obra = params.row.apr_obra;
  const notify = () =>
    toast(({ closeToast }) => (
      <Box>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={closeToast}>
          Cancelar
        </Button>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={() => {
            authRow();
            closeToast();
          }}>Desaprobar Obra
        </Button>
      </Box>
    ));
  //return <CancelIcon onClick={notify} />;
  if(apr_obra != ""){
    return <Button onClick={notify} >{apr_obra}  </Button>;
  }else{
    return ""
  }
} 

function NonAdmAuthRow(params) {
  const authRow = params.row.onAuthAdm;
  //apr_adm: (el.auth_adm[0]?el.auth_adm[0].usuarios[0].user:''),
  const apr_adm = params.row.apr_adm;
  const notify = () =>
    toast(({ closeToast }) => (
      <Box>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={closeToast}>
          Cancelar
        </Button>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={() => {
            authRow();
            closeToast();
          }}>Desaprobar Adm
        </Button>
      </Box>
    ));
  //return <CancelIcon onClick={notify} />;
  if(apr_adm != ""){
    return <Button onClick={notify} >{apr_adm}  </Button>;
  }else{
    return ""
  }
} 

function arrFacturas(params, facturas) {
  const id = params.row.id;

    let aa = facturas;
    return 'numero';//this.facturas[0].numero;
  //}
} 

function RubroPicker({ rubro, setRubro, rubroOptions }) {
  // console.log('colorOptions', colorOptions);
  return (
    <Autocomplete
      value={rubro}
      onChange={(event, newValue) => {
        setRubro(newValue);
      }}
      options={rubroOptions}
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      renderInput={params => <TextField {...params} />}
      renderOption={(props, option, c) => {
        // console.log(props, option, c);
        return (
          <div {...props} >
            {option.label}
          </div>
        );
      }}
    />
  );
}