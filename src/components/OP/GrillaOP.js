import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, TextField, Autocomplete} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, deleteMethod, postMethod } from 'src/utils/api';

const columns = function columns(estadoRET, setEstadoRET, rubro, setRubro) {
  return [

    {
      field: 'createdAt',
      headerName: 'Fecha',
      width: 120,
      type: 'date',
      editable: false,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
    },

    {
      field: 'fideicomiso',
      headerName: 'Fideicomiso',
      width: 160,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: IrDetalleOP_1,
    },

    {
      field: 'numero',
      headerName: 'Numero',
      width: 130,
      editable: false,
      headerAlign: 'center',
      align: 'right',
      //renderCell: <Button onClick={irDetalle} >{numero}  </Button>
      renderCell: IrDetalleOP_2,
      
    },

    {
      field: 'empresa',
      headerName: 'Razón Social',
      width: 170,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: IrDetalleOP_3,
    },  
    {
      field: 'monto',
      headerName: 'Monto',
      width: 130,
      editable: false,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
    },
    {
      field: 'moneda',
      headerName: '',
      width: 70,
      editable: false,
      headerAlign: 'center',
      align: 'left',    
    },

    {
      field: 'facturas',
      headerName: 'Facturas',
      width: 140,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row: { misFacturas }}) => misFacturas?.map(({numero}) => numero)?.join(', '), 
    },

    {
      field: 'RET_SUSS',
      headerName: 'SUSS',
      width: 120,
      editable: true,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
    },
    {
      field: 'RET_GAN',
      headerName: 'SUSS',
      width: 120,
      editable: true,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
    },
    {
      field: 'RET_IVA',
      headerName: 'IVA',
      width: 120,
      editable: true,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
    },

    {
      field: 'estadoRET_Elegido',
      headerName: 'Retenciones',
      width: 150,
      editable: true,
      renderCell: ({ row: { estadoRET_Elegido } }) => (
        <div style={{ width: '100%', height: '100%', background: estadoRET_Elegido }}></div>
      ),
      renderEditCell: ({ row: { estadoRET_Elegido } }) => (
        <EstadoRETPicker
          originalEstadoRET={retenciones.filter(estadoRET => estadoRET.id === estadoRET_Elegido)[0]}
          estadoRET={estadoRET}
          setEstadoRET={setEstadoRET}
          estadoRETOptions={retenciones}
          /*setFechaInicio={setFechaInicio}
          setNewLogoFlag={setNewLogoFlag}*/
        />
      ),
    },


    {
      field: 'aprobado obra',
      headerName: 'Ap. Obra',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: NonObraAuthRow,
    },

    {
      field: 'aprobado adm',
      headerName: 'Ap. ADM',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: NonAdmAuthRow,
    },
/*
    {
      field: 'estadoOP',
      headerName: 'Estado',
      width: 150,
      editable: true,
      renderCell: ({ row: { estadoOP } }) => (
        <div style={{ width: '100%', height: '100%', background: estadoOP }}></div>
      ),
      renderEditCell: (a, b, c) => {
        const commit = a.api.events.cellEditCommit;
        // console.log(a, b, a.api.events.cellEditCommit);
        return (
          <EstadoOP_Picker
            color={estadoOP}
            setColor={setEstadoOP}
            colorOptions={estadoOPs}
            setNewLogoFlag={setNewLogoFlag}
          />
        );
      },
    },
*/
    {
      field: 'fondos',
      headerName: 'Fondos',
      width: 140,
      editable: true,
      headerAlign: 'center',
      align: 'center',    
    },

    {
      field: 'enviar enviada',
      headerName: 'Archivada',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: EnviarRow,
    },

    {
      field: 'rubroId',
      headerName: 'Rubro',
      width: 150,
      editable: true,
      renderEditCell: (a, b, c) => {
        // const commit = a.api.events.cellEditCommit;
        // console.log(a, b, a.api.events.cellEditCommit);
        return (
          <RubroPicker
            rubro={rubro}
            setRubro={setRubro}
            rubroOptions={rubros}
          />
        );
      },
    },

    {
      field: 'archivada3',
      headerName: 'Sub Rubro',
      width: 170,
      editable: true,
      headerAlign: 'center',
      align: 'center',    
    },
    
    {
      field: 'descripcion',
      headerName: 'Detalle',
      width: 140,
      editable: true,
      headerAlign: 'center',
      align: 'center',    
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


const rubros = [
  { id: 1, rubro: 'Obra' },
  { id: 3, rubro: 'Tierra y gastos' },
  { id: 4, rubro: 'eqwweq' },
];

// dropdown retenciones
const retenciones = [
  { id: 0, descri: '' , css: 'white'},
  { id: 1, descri: 'Ok', css: 'DarkGreen'},
  { id: 2, descri: 'Pendiente', css: 'pink'},
];

// dropdown estado
/*
const estadoOPs = [
  { id: 1, descri: '' , css: ''},
  { id: 2, descri: 'Para autorizar Obra', css: 'red'},
  { id: 3, descri: 'Para autorizar AC', css: 'red'},
  { id: 4, descri: 'Para pagar', css: ''},
  { id: 5, descri: 'Pagado Parcial', css: ''},
  { id: 6, descri: 'Pagada', css: 'green'},
  //{ id: 7, descri: 'Anulado', css: 'black'},
  { id: 8, descri: 'Cargada en Banco', css: ''},
];*/

// dropdown fondos
/*
const fondos = [
  { id: 1, descri: '' , css: ''},
  { id: 2, descri: 'Ok cargado', css: ''},
];*/


export function GrillaOP({ idSociety }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rubro, setRubro] = useState({});
  const [estadoRET, setEstadoRET] = useState(null);

  // es un array de facturas para la columna facturas asociada a una OP (OPId)
  const { data: grfacturas } = useQuery(['grfacturas', idSociety.id], async() =>
  await getMethod(`factura/listar/${idSociety.id}/todas/25`));


  const { mutate: deleteProduct } = useMutation(
    async id =>
      await deleteMethod(`OP/eliminar/${idSociety?.id}`, {
        id: id,
      }),
    {
      onSuccess: async () =>
      await queryClient.refetchQueries(['OP', idSociety.id]),
    }
  );

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
   
  const { mutate: enviaOP } = useMutation(
    async el =>
      await postMethod(`OP/modificar/${idSociety?.id}`, {

        id : el.id,
        archivada: 1

      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['OP', idSociety.id]),
    }
  );

  const { mutate: irDetalle } = useMutation(
    async el =>

    
      navigate(`./${el.id}/${el.createdAt}/${el.empresaId}/${el.numero}`)
    /*
      await postMethod(`OP/modificar/${idSociety?.id}`, {

        id : el.id,
        archivada: 1

      }),*/
    /*{
      onSuccess: async () =>
        await queryClient.refetchQueries(['OP', idSociety.id]),
    }*/
  );



  const { data, isLoading, error } = useQuery(['OP', idSociety.id], () =>
    getMethod(`OP/listar/${idSociety.id}/todas/nulo`)
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    
    let newData = {
      id: e.id,
     [e.field]: e.value,
    };
    
    postMethod(`OP/modificar/${idSociety?.id}`, newData);
  }

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={data.map((el) => ({
          id: el.id,      
          numero: el.numero,
          empresa: el.empresas[0]?.razonSocial,
          empresaId: el.empresaId,
          monto: el.monto, 
          moneda: el.moneda, 
          RET_SUSS: el.RET_SUSS,
          RET_GAN: el.RET_GAN,
          RET_IVA: el.RET_IVA,
          rubroId: el.rubroId,
          estadoRET_Elegido: el.estadoRET,
          fideicomiso: el.fideicomisos[0]?.nombre,
          estadoOP: el.estadoOP,
          fondos: el.fondos,
          archivada: el.archivada,
          descripcion: el.descripcion,
          createdAt: el.createdAt,   
          apr_obra: (el.auth_obra[0]?el.auth_obra[0].usuarios[0].user:''),
          apr_adm: (el.auth_adm[0]?el.auth_adm[0].usuarios[0].user:''),
          misFacturas: grfacturas?.filter(factura => factura?.OPId === el.id),
          
          onAuthAdm: () => nonAuthAdm(el),
          onAuthObra: () => nonAuthObra(el),
          onEnviar: () => enviaOP(el),
          onIrDetalle: () => irDetalle(el),          
          onDelete: () => deleteProduct(el.id),

        }))}

        columns={columns(rubro, setEstadoRET, setRubro, idSociety?.id)}
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
        onCellEditCommit={handleCellModification}
    
        onRowDoubleClick={a => {
          // console.log(a);
           return IrADetalleOP(a);
         }}

        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
  
  function IrADetalleOP(params) {
    if(1===2){
      navigate(`./${params.row.id}/${params.row.createdAt}/${params.row.empresaId}/${params.row.numero}`);
    }
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
  
  if(apr_obra !== ""){
    return <Button onClick={notify} >{apr_obra}  </Button>;
  }else{
    return ""
  }
} 

function NonAdmAuthRow(params) {

  const authRow = params.row.onAuthAdm;  
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
  
  if(apr_adm !== ""){
    return <Button onClick={notify} >{apr_adm}  </Button>;
  }else{
    return ""
  }

} 

function EnviarRow(params) {

  const sendRow = params.row.onEnviar;  
  const archivada = params.row.archivada;
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
            sendRow();
            closeToast();
          }}>Enviar
        </Button>
      </Box>
    ));
  
  if(archivada === 0){
    return <Button onClick={notify} >Para Enviar  </Button>;
  }else{
    return "Enviada"
  }
} 

function IrDetalleOP_1(params) {
  const sendRow = params.row.onIrDetalle;  
  const fideicomiso = params.row.fideicomiso;
  return <Button onClick={sendRow} >{fideicomiso}  </Button>;
} 
function IrDetalleOP_2(params) {
  const sendRow = params.row.onIrDetalle;  
  const numero = params.row.numero;
  return <Button onClick={sendRow} >{numero}  </Button>;
} 
function IrDetalleOP_3(params) {
  const sendRow = params.row.onIrDetalle;  
  const empresa = params.row.empresa;
  return <Button onClick={sendRow} >{empresa}  </Button>;
} 
function DeleteRow(params) {
  const deleteRow = params.row.onDelete;
  const archivada = params.row.archivada;
  const notify = () =>
    toast(({ closeToast }) => (
      <Box>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={closeToast}>
          No quiero borrar
        </Button>
        <Button
          sx={{ p: 1, m: 1 }}
          variant='contained'
          color='secondary'
          size='small'
          onClick={() => {
            deleteRow();
            closeToast();
          }}>
          Sí quiero borrar
        </Button>
      </Box>
    ));
  
  if(archivada === 0){
    return <Delete onClick={notify} />;
  }else{
    return ""
  }

}

function RubroPicker({ rubro, setRubro, rubroOptions }) {
  
  return (
    <Autocomplete
      value={rubro}
      onChange={(event, newValue) => {
        setRubro(newValue);
      }}
      options={rubroOptions}
      sx={{ width: 300 }}
      getOptionLabel={option => option.rubro}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={params => <TextField {...params} />}
      renderOption={(props, option, c) => {
        
        return (
          <div {...props} >
            {option.rubro}
          </div>
        );
      }}
    />
  );
}


function EstadoRETPicker({ estadoRET, setEstadoRET, estadoRETOptions, originalEstadoRET }) {
  useEffect(
    () =>
    setEstadoRET(previousState =>
        originalEstadoRET?.id !== previousState?.id ? originalEstadoRET : previousState
      ),
    [originalEstadoRET, setEstadoRET]
  );
  return (
    <Autocomplete
      value={estadoRET}
      onChange={(event, newValue) => {
        setEstadoRET(newValue);
      }}
      options={estadoRETOptions}
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={params => <TextField style={{ background: estadoRET?.css }} {...params} />}
      renderOption={(props, option, c) => {

        return (
          <div {...props} style={{ background: option?.css }}>
            {option.descri}
          </div>
        );
      }}
    />
  );
}