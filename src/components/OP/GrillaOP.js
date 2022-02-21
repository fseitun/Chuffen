import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, TextField, Avatar, Autocomplete, Hidden} from '@mui/material';
import { IconButton, Collapse, Alert } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from 'src/utils/usePrompt';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import RepOp from "src/components/reportes/orden_de_pago/orden_de_pago";
import { darken, lighten } from '@mui/material/styles';

const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);
  

var miOP={};
var fa={};
var idSociedad=0;


const columns = (verColumnBlue, puedeEditar, rubros, subRubros, setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'id',
    headerName: 'Num',
    width: 55,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  }, 
  {
    field: 'blue',
    headerName: 'Blue',
    hide: !verColumnBlue,
    width: 70,
    editable: false,
    headerAlign: 'center',
    renderCell: ({ value }) => value===0?'' :<Avatar sx={{ bgcolor: '#3944BC' }} >B</Avatar>,
  },
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
    renderCell: IrDetalleOP_2,    
  },
  {
    field: 'empresa',
    headerName: 'Razón Social',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'center',
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
    field: 'estadoOP', // campo en grilla
    headerName: 'Estado',
    width: 150,
    editable: puedeEditar,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    renderEditCell: props => <ComboBoxEst estados={estados} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'estadoRET', // campo en grilla
    headerName: 'Retenciones',
    width: 150,
    editable: puedeEditar,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    renderEditCell: props => <ComboBoxRet retenciones={retenciones} props={props} />,
    headerAlign: 'center',
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
    field: 'RET_GAN',
    headerName: 'GAN',
    width: 120,
    hide: true,
    editable: puedeEditar,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'RET_IVA',
    headerName: 'IVA',
    width: 120,
    hide: true,
    editable: puedeEditar,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'RET_SUSS',
    headerName: 'SUSS',
    width: 120,
    hide: true,
    editable: puedeEditar,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'retencion',
    hide: true,
  },

  {
    field: 'aprobado_obra',
    hide: true,
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
    field: 'aprobado_adm',
    hide: true,
  },
  {
    field: 'aprobado adm',
    headerName: 'Ap. ADM',
    width: 140,
    headerAlign: 'center',
    align: 'center',
    renderCell: NonAdmAuthRow,
  },
  {
    field: 'estado',
    hide: true,
  },
  {
    field: 'formaPago',
    headerName: 'Forma Pago',
    width: 160,
    editable: false,
  },
  {
    field: 'fondos_',
    hide: true,
  },
  {
    field: 'fondos', // campo en grilla
    headerName: 'Fondos',
    width: 150,
    type: 'singleSelect',
    editable: puedeEditar, //props.row.confirmada,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    renderEditCell: props => <ComboBoxFon fondos_s={fondos_s} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'rubro',
    hide: true,
  },  
  {
    field: 'rubroID',
    headerName: 'Rubro',
    width: 140,
    hide: true,
    editable: puedeEditar,
    renderCell: ({ value }) => value.nombre,
    renderEditCell: props => <ComboBox rubros={rubros} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'subrubro',
    hide: true,
  },
  {
    field: 'subrubroID',
    headerName: 'Sub Rubro',
    width: 140,
    hide: true,
    editable: puedeEditar,
    renderCell: ({ value }) => value.nombre,
    renderEditCell: props => <ComboBoxSub subRubros={subRubros} props={props} />,
    headerAlign: 'center',
  },  

  {
    field: 'descripcion',
    headerName: 'Detalle',
    width: 140,
    editable: puedeEditar,
    headerAlign: 'center',
    align: 'center',    
  }, 
  {
    field: 'archivada',
    headerName: 'Generar',
    width: 140,
    headerAlign: 'center',
    align: 'center',
    renderCell: DescargarPDF,
  },
  {
    field: 'enviada',
    headerName: 'Enviar',
    width: 90,
    headerAlign: 'center',
    align: 'center',
    renderCell: EnviarMail,
  },
  {
    field: 'confirmada',
    headerName: 'Conf',
    type: 'boolean',
    width: 120,
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'deleteIcon',
    headerName: ' ',
    hide: !puedeEditar,
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleteId, confirmada } }) => (
      confirmada? "":<DeleteIcon
        onClick={e => {
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];

// por ahora se inicializa en el login
var estados = JSON.parse(localStorage.getItem("estados"));
var retenciones = JSON.parse(localStorage.getItem("retenciones"));
var fondos_s = JSON.parse(localStorage.getItem("fondos_s"));

const apiServerUrl = process.env.REACT_APP_API_SERVER;
export function GrillaOP({ filtFide, filtRS, filtEst, idSociety, loggedUser, opInformation, isLoading, error}) {
  
  idSociedad = idSociety.id;
  var result = {};

  var puedeEditar = true;
  const accesoOP = loggedUser?.['rol.op'];
  if( accesoOP ==='vista'){puedeEditar =false}

  var blue = 0;
  var verColumnBlue = false;
  if(loggedUser?.['rol.op'] ==='total'){blue= -1; verColumnBlue = true;}  

  const navigate = useNavigate();
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();  

  const queryClient = useQueryClient();

  const { data: rubros } = useQuery(['rubros', idSociety], () =>
    getMethod(`rubro/listar/${idSociety.id}`)
  );

  const { data: subRubros } = useQuery(['subrubros', idSociety], () =>
    getMethod(`subrubro/listar/${idSociety.id}/0`)
  );

  // es un array de facturas para la columna facturas asociada a una OP (OPId)
  const { data: grfacturas } = useQuery(['grfacturas', idSociety.id], async() =>
  await getMethod(`factura/listar/${idSociety.id}/todas/nada/${blue}`));


  const { mutate: irDetalle } = useMutation(

    async el => await  getMethod(`op/mostrar/${idSociety.id}/${el.id}`),
      {onSettled: (el) => { /*queryClient.refetchQueries(['formOP', idSociety]);*/
      navigate(`./${el.id}/${el.createdAt}/${el.empresaId}/${el.numero}/${el.fideicomisos[0]?.nombre}/${el.estadoOP}/${el.confirmada}/${el.blue}`)}
    }
    
  );

  const { mutate: eliminate } = useMutation(
    async idOP => await deleteMethod(`OP/eliminar/${idSociety.id}`, { id: idOP }),
    {
      onMutate: async idOP => {
        await queryClient.cancelQueries(['OP', idSociety]);
        const prevData = queryClient.getQueryData(['OP', idSociety]);
        const newData = prevData.filter(op => op.id !== idOP);
        queryClient.setQueryData(['OP', idSociety], newData);
        return prevData;
      },
      onError: (err, idOP, context) => queryClient.setQueryData(['OP', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['OP', idSociety]),
    }
  );

   /***** generar y subir pdf ***********************************************************************/

  const { mutate: cargar_y_subir_OP } = useMutation(
    async el =>         
        result = await getMethod(`op/mostrarConFacturas/${idSociety.id}/${el.id}`),
    {
      onSuccess: async () =>{
         miOP = result.op;
         fa = {item: result.item};
         getPdfBlob(miOP?.id, miOP?.fideicomisos[0]?.nombre, miOP?.numero, miOP?.empresas[0]?.razonSocial);
        }        
    }     
  );

  async function getPdfBlob(idOP, fideicomiso, numero, nom_empresa){



    let blobPdf = await pdf(NewDocument()).toBlob();
    let formData = new FormData();

    
    var fileName= numero + " OP-" + fideicomiso + "-" +  nom_empresa + ".pdf";

    formData.append('logo', blobPdf);
    formData.append('id', idOP);
    formData.append('fideicomiso', fideicomiso);
    formData.append('numero', numero);
    formData.append('nombreArchivo', fileName);
    formData.append('archivada', 1);    
    postMethod(`op/modificar/${idSociety.id}`, formData);
    
  }

  const NewDocument = () => {
    
    return (
      <RepOp dataOP={miOP} dataFacturas={fa} apiServerUrl={apiServerUrl} idSociedad={idSociety.id} />
    )
  }

  /***** fin generar y subir pdf ************************************************************************/

 
  const { mutate: nonAuthObra } = useMutation(
    async el =>
      await deleteMethod(`autorizacion/eliminar/${idSociety?.id}`, {
        id : el.authOBRA,
        tipoAutorizacion: 'obra',
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

  const { mutate: enviarCorreo } = useMutation(
    async el =>
      await postMethod(`OP/enviarMail/${idSociety?.id}`, {

        mailTo : idSociety?.mailOP,
        mailaccount : idSociety?.mailaccount,
        mailfromname : idSociety?.mailfromname,
        mailConstructora : idSociety?.mailConstructora,
        fideicomiso : el.fideicomisos[0]?.nombre,        
        razonSocial : el.empresas[0]?.razonSocial,
        enviar_OP_auto : el.empresas[0]?.enviar_OP_auto,
        numero : el.numero,
        id : el.id,

      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['OP', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
            await postMethod(`OP/modificar/${idSociety.id}`, {id,[field]: value,}),
            
        {
          onMutate: async ({ field, id, value }) => {
            await queryClient.cancelQueries(['OP', idSociety]);
            const prevData = queryClient.getQueryData(['OP', idSociety]);
            const newData = [
              ...prevData.filter(op => op.id !== id),
              { ...prevData.find(op => op.id === id), [field]: value },
            ];
            queryClient.setQueryData(['OP', idSociety], newData);
            return prevData;
          },
          onError: (err, id, context) => queryClient.setQueryData(['OP', idSociety], context),
          onSettled: () => queryClient.invalidateQueries(['OP', idSociety]),
        }
  );

  const [selectionModel, setSelectionModel] = useState([]);

  const [open, setOpen] = useState(false);

  function filtrar(element, filtFide, filtRS, filtEst){

    if(filtFide === -1 && filtRS === -1 && filtEst === -1){
      return true;
    }

    if(filtFide > -1 && filtRS === -1 && filtEst === -1){//fide
      if(element.fideicomisoId===filtFide){return true;}else{return false;}
    }
    if(filtFide === -1 && filtRS > -1 && filtEst === -1){// proveedor

      if(element.empresaId===filtRS){return true;}else{return false;}
    }
    if(filtFide === -1 && filtRS === -1 && filtEst > -1){//estado
      if(element.estadoOP===filtEst){return true;}else{return false;}
    }

    if(filtFide > -1 && filtRS > -1 && filtEst === -1){
      if(element.fideicomisoId===filtFide && element.empresaId===filtRS){return true;}else{return false;}
    }
    if(filtFide > -1 && filtRS === -1 && filtEst > -1){
      if(element.fideicomisoId===filtFide && element.estadoOP===filtEst){return true;}else{return false;}
    }
    if(filtFide === -1 && filtRS > -1 && filtEst > -1){
      if(element.empresaId===filtRS && element.estadoOP===filtEst){return true;}else{return false;}
    }
    if(filtFide > -1 && filtRS > -1 && filtEst > -1){
      if(element.fideicomisoId===filtFide && element.empresaId===filtRS && element.estadoOP===filtEst){return true;}else{return false;}
    }


  }

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    
    return (

      <div style={{ width: '100%' }}>
        
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
        <ToastContainer /> 

        <Box
          sx={{
            height: 400,
            width: 1,
          
            '& .super-app-theme--true': {
              bgcolor: (theme) =>
              getBackgroundColor(theme.palette.success.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBackgroundColor(
                  theme.palette.success.main,
                  theme.palette.mode,
                ),
            },
            },
            '& .super-app-theme--otra': {
              bgcolor: (theme) =>
                getBackgroundColor(theme.palette.error.main, theme.palette.mode),
              '&:hover': {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode),
              },
            },
          }}
        >         
        
        <DataGrid 
          rows={opInformation.filter(element =>filtrar(element, filtFide, filtRS, filtEst)).map(OP => ({
            id: OP.id,    
            acceso: accesoOP,
            numero: OP.numero,
            empresa: OP.empresas[0]?.razonSocial,
            empresaId: OP.empresaId,
            monto: OP.monto, 
            moneda: OP.moneda,             
            RET_SUSS: OP.RET_SUSS,
            RET_GAN: OP.RET_GAN,
            RET_IVA: OP.RET_IVA,
            rubroId: OP.rubroId,            
            estadoRET: {
              id: OP.estadoRET,
              descripcion: retenciones?.find(retencion => retencion.id === OP.estadoRET)?.descripcion,
            },
            estadoOP: {
              id: OP.estadoOP,
              descripcion: estados?.find(estado => estado.id === OP.estadoOP)?.descripcion,
            },
            blue: OP.blue,
            confirmada: OP.confirmada===0? false: true,
            fondos: {
              id: OP.fondos,
              descripcion: fondos_s?.find(fondos => fondos.id === OP.fondos)?.descripcion,
            },
            fideicomiso: OP.fideicomisos[0]?.nombre,
            archivada: OP.archivada,
            enviada: OP.enviada,
            descripcion: OP.descripcion,
            createdAt: OP.createdAt,   
            rubroID: {
              id: OP.rubroId,
              nombre: rubros?.find(rubro => rubro.id === OP.rubroId)?.rubro,
            },
            subrubroID: {
              id: OP.subrubroId,
              nombre: subRubros?.find(subRubro => subRubro.id === OP.subRubroId)?.subRubro,
            }, 
            apr_obra: (OP.auth_obra[0]?OP.auth_obra[0].usuarios[0].user:''),
            apr_adm: (OP.auth_adm[0]?OP.auth_adm[0].usuarios[0].user:''),
            misFacturas: grfacturas?.filter(factura => factura?.OPId === OP.id),
            deleteId: OP.id,
            /* para exportar*/
            retencion: retenciones?.find(retencion => retencion.id === OP.estadoRET)?.descripcion,
            aprobado_obra: (OP.auth_obra[0]?OP.auth_obra[0].usuarios[0].user:''),
            aprobado_adm: (OP.auth_adm[0]?OP.auth_adm[0].usuarios[0].user:''),
            estado: estados?.find(estado => estado.id === OP.estadoOP)?.descripcion,
            fondos_: fondos_s?.find(fondos => fondos.id === OP.fondos)?.descripcion,  
            formaPago: OP.formaPago,          
            rubro: rubros?.find(rubro => rubro.id === OP.rubroId)?.rubro,
            subrubro: subRubros?.find(subRubro => subRubro.id === OP.subRubroId)?.subRubro,     
            onAuthObra: () => nonAuthObra(OP),
            onAuthAdm: () => nonAuthAdm(OP),
            onEnviar: () => enviarCorreo(OP),
            cargarOP: () => cargar_y_subir_OP(OP),
            esEditable: () => (OP),
            onIrDetalle: () => irDetalle(OP),    
            
          }))}
          onCellEditCommit={modifyData}
          columns={columns(verColumnBlue, puedeEditar, rubros, subRubros, setIsPromptOpen, setRowIdToDelete)}
          isCellEditable={(params) => (!params.row.confirmada || accesoOP ==='total')}

          /*disableSelectionOnClick*/
          checkboxSelection
          onSelectionModelChange={setSelectionModel}
               
          autoHeight
          density={'comfortable'}
          scrollbarSize
          components={{
            Toolbar: CustomToolbar,
          }}

          getRowClassName={(params) => `super-app-theme--${params.row.confirmada}`}
          /*
          style={{
            rowStyle: (params) => ({
              backgroundColor:
                  params.row.confirmada
                  ? "#000"
                  : "#fff"
            })
        }}  */
          
        >      

        </DataGrid>

        <Hidden  smUp={(loggedUser['rol.op'] ==='vista')} >
            <Button onClick={()=>generar_y_enviar(selectionModel, idSociety, setOpen)} >
                Generar y Enviar OPs Seleccionadas
            </Button>
        </Hidden>
  
        <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Acción realizada!
              </Alert>
            </Collapse>  


        </Box>

        

      </div>
    );


}

function generar_y_enviar(selectionModel, idSociety, setOpen) {

    getOPs(selectionModel, idSociety, setOpen);

}

async function getOPs(arr, idSociety, setOpen) {

  for (let i = 0; i < arr.length ; i++) {
    try {      

      let result = await getMethod(`op/mostrarConFacturas/${idSociety.id}/${arr[i]}`);
      let miOP = result.op;
      let fa = {item: result.item};
      if(miOP.estadoOP ===3 && miOP.blue === 0){
            console.log('AAi=', i, 'res: ', miOP.numero);
            const NewDocument = () => {    
              return (
                <RepOp dataOP={miOP} dataFacturas={fa} apiServerUrl={apiServerUrl} idSociedad={idSociety.id} />
              )
            }
            let generado = await getPdfBlob_2(NewDocument, miOP.id, miOP?.fideicomisos[0]?.nombre, miOP.numero, miOP?.empresas[0]?.razonSocial, idSociety);
            console.log(generado);  
            if(generado){
              enviarCorreo_2(miOP.id, miOP?.fideicomisos[0]?.nombre, miOP.numero, miOP.empresas[0]?.razonSocial, miOP.empresas[0]?.enviar_OP_auto, idSociety)
              setOpen(true);
              
            }

      } 
      
    } catch (error) {
      console.log(error);
    }
  }

}

async function getPdfBlob_2(NewDocument, idOP, fideicomiso, numero, nom_empresa, idSociety){

  
  var fileName= numero + " OP-" + fideicomiso + "-" +  nom_empresa + ".pdf";
  let blobPdf = await pdf(NewDocument()).toBlob();
  let formData = new FormData();
  formData.append('logo', blobPdf);
  formData.append('id', idOP);
  formData.append('fideicomiso', fideicomiso);
  formData.append('numero', numero);
  formData.append('nombreArchivo', fileName);
  formData.append('archivada', 1);    
  let rta = await postMethod(`op/modificar/${idSociety.id}`, formData);
  return !!rta
}

async function enviarCorreo_2(idOP, fideicomiso, numero, razonSocial, enviar_OP_auto, idSociety){

  let rta = await postMethod(`OP/enviarMail/${idSociety?.id}`, {

    mailTo : idSociety?.mailOP,
    mailaccount : idSociety?.mailaccount,
    mailfromname : idSociety?.mailfromname,
    mailConstructora : idSociety?.mailConstructora,
    fideicomiso : fideicomiso,        
    razonSocial : razonSocial,
    enviar_OP_auto : enviar_OP_auto,
    numero : numero,
    id : idOP,

  })
  return !!rta
}


function CustomToolbar() {
  return (
    <GridToolbarContainer>

      <GridToolbarExport csvOptions={{ fields: ['createdAt', 'fideicomiso', 'numero','empresa','monto','moneda','RET_SUSS','RET_GAN','RET_IVA','fondos_','retencion', 'aprobado_obra', 'aprobado_adm', 'estado', 'fondos_', 'rubro', 'subrubro','descripcion'] }} />
      
    </GridToolbarContainer>
  );
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
      //disablePortal
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
    
    ...subRubros.filter(subR => subR.rubroId === parseInt(props?.row?.rubroID.id)),
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
      id="combo-box-demo"
      options={subRubros}
      isOptionEqualToValue={(op, val) => op.subRubro === val.subRubro}
      getOptionLabel={option => option.subRubro}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="subRubro" />}
    />
  );
}

function ComboBoxRet({ retenciones, props }) {
  const { id, api, field } = props;

  retenciones = [
    ...retenciones,
    {
      descripcion: '',
    },
  ];
  const [selectedRet, setSelectedRol] = useState({
    descripcion: '',
  });

  return (
    <Autocomplete
      value={selectedRet}
      onChange={async (event, newValue) => {        
        setSelectedRol(newValue);    
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      id="combo-box-demo"
      options={retenciones}
      isOptionEqualToValue={(op, val) => op.descripcion === val.descripcion}
      getOptionLabel={option => option.descripcion}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="Retencion" />}
    />
  );
}

function ComboBoxEst({ estados, props }) {
  const { id, api, field } = props;

  estados = [
    ...estados,
    {
      descripcion: '',
    },
  ];
  const [selectedEst, setSelectedRol] = useState({
    descripcion: '',
  });

  if(props.row.confirmada){
    return (
      <TextField defaultValue={props.row.estadoOP.descripcion }  
      InputProps={{
       readOnly: true,
     }}
    />)
  }else{

  return (
    <Autocomplete
      value={selectedEst}
      onChange={async (event, newValue) => {        
        setSelectedRol(newValue); 
   
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      id="combo-box-demo"
      options={estados}      
      isOptionEqualToValue={(op, val) => op.descripcion === val.descripcion}
      getOptionLabel={option => option.descripcion}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="Estado" />}
    />
  );
    }
}

function ComboBoxFon({fondos_s, props}) {
  const { id, api, field } = props;

  fondos_s = [
    ...fondos_s,
    {
      descripcion: '',
    },
  ];
  const [selectedFon, setSelectedRol] = useState({
    descripcion: '',
  });
  
  if(props.row.confirmada){
    return (
      <TextField defaultValue={props.row.fondos.descripcion }  
      InputProps={{
       readOnly: true,
     }}
    />)
  }else{
    return (<Autocomplete
    value={selectedFon}
    
    onChange={async (event, newValue) => {
      setSelectedRol(newValue); 
      if(newValue?.id > 0){
        api.setEditCellValue({ id, field, value: newValue.id }, event);
        await props.api.commitCellChange({ id, field });
        api.setCellMode(id, field, 'view');
      }
    }}

    id="combo-box-demo"
    options={fondos_s}
    isOptionEqualToValue={(op, val) => op.descripcion === val.descripcion}
    getOptionLabel={option => option.descripcion}
    sx={{ width: 300 }}
    renderInput={params => <TextField {...params} label="Fondos" />}
  />)
  }
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
    if(params.row.acceso ==='total'){
      return <Button onClick={notify} >{apr_obra}  </Button>;
    }else{
      let str = "" + apr_obra;
      return "" + str.toUpperCase();
    }
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
    if(params.row.acceso ==='total'){
      return <Button onClick={notify} >{apr_adm}  </Button>;
    }else{
      let str = "" + apr_adm;
      return "" + str.toUpperCase();
    }
   
  }else{
    return ""
  }

} 

function DescargarPDF(params) {  
  
  var cargarOP = params.row.cargarOP;
  const fideicomiso = params.row.fideicomiso;
  const nom_empresa = params.row.empresa;
  const numero = params.row.numero;
  
  var fileName= numero + " OP-" + fideicomiso + "-" +  nom_empresa + ".pdf";

  const archivada = params.row.archivada;
  const apiServerUrl = process.env.REACT_APP_API_SERVER;

  
  const notify = () =>{
    
    cargarOP();
    
    setTimeout(() => {
    
        toast(({ closeToast}) => (
          
          <Box>
            <Button
              sx={{ p: 1, m: 1 }}
              variant='contained'
              color='secondary'
              size='small'
              onClick={closeToast}>
              
              Cancelar
            </Button>

            <PDFDownloadLink document={<RepOp dataOP={miOP} dataFacturas={fa} apiServerUrl={apiServerUrl} idSociedad={idSociedad} />} fileName={fileName} >
              {({ blob, url, loading, error }) => {
          
                return (loading ? 'Loading document...' : 'Descargar')}
              }
            </PDFDownloadLink> 

            
          </Box>
        )) 
      }, 800);
    };
  
  if(archivada === 0){
    return <Button onClick={notify} >Para Generar</Button>;
  }else{
    return <Button onClick={notify} >Generada</Button>;    
  }

} 

function EnviarMail(params) {

  const enviar = params.row.onEnviar;  
  const enviada = params.row.enviada;
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
            enviar();
            closeToast();
          }}>Enviar
        </Button>
      </Box>
    ));
  
    if(archivada === 0){
      return "";
    }else{
      if(enviada === 0){
        return <Button onClick={notify} >Enviar</Button>;
      
      }else{
        return <Button onClick={notify} >Re enviar</Button>;
      }   
    }
  
} 

