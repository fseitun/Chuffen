import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Typography, TextField, Avatar, Autocomplete, Hidden} from '@mui/material';
import { IconButton, Collapse, Alert } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from 'src/utils/usePrompt';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import RepOp from "src/components/reportes/orden_de_pago/orden_de_pago";
import { darken, lighten } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { EstadosContext, RetencionesContext, FondosContext} from 'src/App';


const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);
  

var miOP={};
var fa={};
var idSociedad=0;

const columns = (colVisibles, estados, retenciones, fondos_s, verColumnBlue, puedeEditar, rubros, subRubros, setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'id',
    headerName: 'Id',
    width: 55,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'id').h,
    headerAlign: 'center',
    align: 'center',
    renderCell: IrDetalleOP_0

  }, 
  {
    field: 'blue',
    headerName: 'Blue',
    width: 70,
    editable: false,
    hide: (!verColumnBlue && colVisibles?.find(i => i.c === 'blue').h),    
    headerAlign: 'center',
    renderCell: ({ value }) => value===0?'' :<Avatar sx={{ bgcolor: '#3944BC' }} >B</Avatar>,
  },
  
  {
    field: 'createdAt',
    headerName: 'Fecha',
    width: 120,
    type: 'date',
    editable: false,
    hide: colVisibles?.find(i => i.c === 'createdAt').h,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
  },
  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    width: 160,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'fideicomiso').h,
    headerAlign: 'center',
    align: 'center',
    renderCell: IrDetalleOP_1,
  },
  {
    field: 'numero',
    headerName: 'Numero',
    width: 130,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'numero').h,
    headerAlign: 'center',
    align: 'right',
    renderCell: IrDetalleOP_2,    
  },
  {
    field: 'empresa',
    headerName: 'Razón Social',
    width: 170,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'empresa').h,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'monto',
    headerName: 'Monto',
    width: 130,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'monto').h,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'neto',
    headerName: 'Neto',
    width: 130,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'neto').h,
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
    hide: colVisibles?.find(i => i.c === 'moneda').h,
    headerAlign: 'center',
    align: 'left',    
  },
  {
    field: 'estadoOP',
    headerName: 'Estado',
    width: 150,
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'estadoOP').h,
    renderEditCell: props => <ComboBoxEst estados={estados} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'estadoRET',
    headerName: 'Retenciones',
    width: 150,
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'estadoRET').h,
    renderEditCell: props => <ComboBoxRet retenciones={retenciones} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'facturas',
    headerName: 'Facturas',
    width: 140,
    sortable: false,
    filterable: false,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'facturas').h,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { misFacturas }}) => misFacturas?.map(({numero}) => numero)?.join(', '), 
  },
  {
    field: 'RET_GAN',
    headerName: 'GAN',
    width: 120,
    hide: colVisibles?.find(i => i.c === 'RET_GAN').h,
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
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'RET_IVA').h,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'RET_SUSS',
    headerName: 'SUSS',
    width: 120,    
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'RET_SUSS').h,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'apr_obra',
    headerName: 'Ap. Obra',
    width: 140,
    headerAlign: 'center',
    hide: colVisibles?.find(i => i.c === 'apr_obra').h,
    align: 'center',
    renderCell: NonObraAuthRow,
  },
  {
    field: 'apr_adm',
    headerName: 'Ap. ADM',
    width: 140,
    headerAlign: 'center',
    hide: colVisibles?.find(i => i.c === 'apr_adm').h,
    align: 'center',
    renderCell: NonAdmAuthRow,
  },
  {
    field: 'formaPago',
    headerName: 'Forma Pago',
    width: 160,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'formaPago').h,
  },
  {
    field: 'fondos',
    headerName: 'Fondos',
    width: 150,
    type: 'singleSelect',
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'fondos').h,
    renderEditCell: props => <ComboBoxFon fondos_s={fondos_s} props={props} />,
    headerAlign: 'center',
  },

  {
    field: 'rubroId',
    headerName: 'Rubro',
    width: 140,    
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'rubroId').h,    
    headerAlign: 'center',
    renderEditCell: props => <ComboBox rubros={rubros} props={props} />
  },

  {
    field: 'subrubroId',
    headerName: 'Sub Rubro',
    width: 140,    
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'subrubroId').h,
    headerAlign: 'center',
    renderEditCell: props => <ComboBoxSub subRubros={subRubros} props={props} />
  },  

  {
    field: 'descripcion',
    headerName: 'Detalle',
    width: 140,
    editable: puedeEditar,
    hide: colVisibles?.find(i => i.c === 'descripcion').h,
    headerAlign: 'center',
    align: 'center',    
  }, 
  {
    field: 'archivada',
    headerName: 'Generar',
    width: 140,
    headerAlign: 'center',
    hide: colVisibles?.find(i => i.c === 'archivada').h,
    align: 'center',
    renderCell: DescargarPDF,
  },
  {
    field: 'enviada',
    headerName: 'Enviar',
    width: 90,
    headerAlign: 'center',
    hide: colVisibles?.find(i => i.c === 'enviada').h,
    align: 'center',
    renderCell: EnviarMail,
  },
  {
    field: 'confirmada',
    headerName: 'Conf',
    type: 'boolean',
    width: 120,
    editable: false,
    hide: colVisibles?.find(i => i.c === 'confirmada').h,
    headerAlign: 'center',
  },
  {
    field: 'deleteIcon',
    headerName: ' ',
    hide: (!puedeEditar && colVisibles?.find(i => i.c === 'deleteIcon').h),
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



const apiServerUrl = process.env.REACT_APP_API_SERVER;
export function GrillaOP({ filtFide, filtRS, filtEst, filtTerm, idSociety, loggedUser, opInformation, isLoading, error}) {
  
  idSociedad = idSociety.id;
  var result = {};

  // por ahora se inicializa en el login
  var estados = useContext(EstadosContext);
  var retenciones = useContext(RetencionesContext);
  var fondos_s =  useContext(FondosContext); 

  var puedeEditar = true;
  const accesoOP = loggedUser?.['rol.op'];
  if( accesoOP ==='vista'){puedeEditar =false}

  var blue = 0;
  var verColumnBlue = false;
  if(loggedUser?.['rol.op'] ==='total' || loggedUser?.['rol.op'] ==='blue'){blue= -1; verColumnBlue = true;}  
  var onlyBlue = false;
  if(loggedUser?.['rol.descripcion'] ==='blue'){onlyBlue= true;}

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
      navigate(`./${el.id}/${el.createdAt}/${el.empresaId}/${el.numero}/${el.fideicomisoId}/${el.fideicomisos[0]?.nombre}/${el.estadoOP}/${el?.auth_adm[0]?.usuarios[0]?.user}/${el?.auth_obra[0]?.usuarios[0]?.user}/${el.confirmada}/${el.blue}/OP Detalle`)}
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
    await postMethod(`op/modificar/${idSociety.id}`, formData);

    await queryClient.refetchQueries(['OP', idSociety])
    
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

        mailTo : el.fideicomisos[0]?.mailOP, //idSociety?.mailOP,
        mailaccount : idSociety?.mailaccount,
        mailfromname : idSociety?.mailfromname,
        mailConstructora : idSociety?.mailConstructora,
        fideicomiso : el.fideicomisos[0]?.nombre,
        //fideicomiso : el.fideicomisos[0]?.,        
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

  function filtrar(element, filtFide, filtRS, filtEst, filtTerm, onlyBlue){
    var rta = false;
    if(filtFide === -1 && filtRS === -1 && filtEst === -1){
      rta = true;
    }

    if(filtFide > -1 && filtRS === -1 && filtEst === -1){//fide
      if(element.fideicomisoId===filtFide){rta = true;}//else{rta = false;}
    }
    if(filtFide === -1 && filtRS > -1 && filtEst === -1){// proveedor

      if(element.empresaId===filtRS){rta = true;}//else{rta = false;}
    }
    if(filtFide === -1 && filtRS === -1 && filtEst > -1){//estado
      if(element.estadoOP===filtEst){rta = true;}//else{rta = false;}
    }

    if(filtFide > -1 && filtRS > -1 && filtEst === -1){
      if(element.fideicomisoId===filtFide && element.empresaId===filtRS){rta = true;}//else{rta = false;}
    }
    if(filtFide > -1 && filtRS === -1 && filtEst > -1){
      if(element.fideicomisoId===filtFide && element.estadoOP===filtEst){rta = true;}//else{rta = false;}
    }
    if(filtFide === -1 && filtRS > -1 && filtEst > -1){
      if(element.empresaId===filtRS && element.estadoOP===filtEst){rta = true;}//else{rta = false;}
    }
    if(filtFide > -1 && filtRS > -1 && filtEst > -1){
      if(element.fideicomisoId===filtFide && element.empresaId===filtRS && element.estadoOP===filtEst){rta = true;}//else{rta = false;}
    }

    
    if(onlyBlue && element.blue !== 1){
      rta = false;
    }
    
    // filtrar terminados
    if(((element.confirmada===1 && element.archivada && element.enviada) || (element.estadoOP===6) ) && (filtTerm)){
      rta = false;
    }

    return rta;

  }

  
  var colDefaultVisibles = [
    {c:'id',  h:false},
    {c:'blue',  h:false},
    {c:'createdAt',  h:false},
    {c:'fideicomiso',  h:false},
    {c:'numero',  h:false},
    {c:'empresa',  h:false},
    {c:'monto',  h:false},
    {c:'neto',  h:false},
    {c:'moneda',  h:false},
    {c:'estadoOP',  h:false},
    {c:'estadoRET',  h:false},
    {c:'facturas',  h:false},
    {c:'RET_GAN',  h:true},
    {c:'RET_IVA',  h:true},
    {c:'RET_SUSS',  h:true},
    {c:'apr_obra',  h:false},
    {c:'apr_adm',  h:false},
    {c:'formaPago',  h:false},
    {c:'fondos',  h:false},
    {c:'rubroId',  h:true},
    {c:'subrubroId',  h:true},
    {c:'descripcion',  h:false},
    {c:'archivada',  h:false},
    {c:'enviada',  h:false},
    {c:'confirmada',  h:false},
    {c:'deleteIcon',  h:false}];

  const [colVisibles, setColVisibles] = useState(colDefaultVisibles);

  const change = (col) => { 
    let cols = colVisibles;
    let foundIndex = cols?.findIndex(item => item.c === col.field);
    if(foundIndex>-1){
      cols[foundIndex] = {c:col.field,  h:!col.isVisible};
      setColVisibles(cols);
    }
  };

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'createdAt',
      sort: 'desc',
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
        <ToastContainer /> 

        <Box
          sx={{
            height: 400,
            width: 1,
          // Confirmada
            '& .color_x_estado-conf': {
              bgcolor: (theme) =>
              getBackgroundColor(theme.palette.success.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBackgroundColor(
                  theme.palette.success.main,
                  theme.palette.mode,),},
            },
            // para autorizar
            '& .color_x_estado-auth': {
              bgcolor: (theme) =>
                getBackgroundColor(theme.palette.error.main, theme.palette.mode),
              '&:hover': {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode),},
            },
            // anulada
            '& .color_x_estado-anulado': {
              bgcolor: (theme) =>
                getBackgroundColor(theme.palette.text.primary, theme.palette.mode),
              '&:hover': {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(theme.palette.text.primary, theme.palette.mode),},
            },
               // para pagar
               '& .color_x_estado-parap': {
                bgcolor: (theme) =>
                  getBackgroundColor(theme.palette.warning.light, theme.palette.mode),
                '&:hover': {
                  bgcolor: (theme) =>
                    getHoverBackgroundColor(theme.palette.warning.light, theme.palette.mode),},
              },
            
          }}
        >  

        <Typography align="left" color="textSecondary" variant="h6">
          Rojo: Para autorizar,&nbsp; 
          Amarilla: Para pagar,&nbsp; 
          Verde: Pagada y confirmada,&nbsp; 
          Blanca: ..Otros estados&nbsp;
          | Ocultas: Pagada, confirmada, generada y enviada
        </Typography> 
               
        
        <DataGrid 
          rows={opInformation.filter(element =>filtrar(element, filtFide, filtRS, filtEst, filtTerm, onlyBlue)).map(OP => ({
            
            id: OP?.id,    
            blue: OP?.blue,
            createdAt: OP?.createdAt,
            fideicomisoId: OP?.fideicomisoId,
            fideicomiso: OP?.fideicomisos? OP.fideicomisos[0]?.nombre:'',
            numero: OP?.numero,
            empresaId: OP?.empresaId,
            empresa: OP?.empresas? OP?.empresas[0]?.razonSocial:'',
            monto: OP?.monto, 
            neto: OP?.neto, 
            moneda: OP?.moneda,   
            estadoOP: estados?.find(estado => estado.id === OP.estadoOP)?.descripcion,
            estadoRET: retenciones?.find(retencion => retencion.id === OP.estadoRET)?.descripcion,
            misFacturas: grfacturas?.filter(factura => factura?.OPId === OP.id),
            fondos: fondos_s?.find(fondos => fondos?.id === OP.fondos)?.descripcion,
            descripcion: OP?.descripcion,
            archivada: OP?.archivada,
            enviada: OP?.enviada,
            confirmada: OP?.confirmada===0? false: true,           
                   
            RET_SUSS: OP?.RET_SUSS,
            RET_GAN: OP?.RET_GAN,
            RET_IVA: OP?.RET_IVA,
            apr_obra: OP?.auth_obra? (OP.auth_obra[0]? (OP.auth_obra[0].usuarios? (OP.auth_obra[0].usuarios[0].user):''):''):'',
            apr_adm: OP?.auth_adm? (OP.auth_adm[0]? (OP.auth_adm[0].usuarios? (OP.auth_adm[0].usuarios[0].user):''):''):'',
            filtroRubroID: OP?.rubroId,
            acceso: accesoOP,
            deleteId: OP?.id,
            aprobado_obra: OP?.auth_obra? (OP.auth_obra[0]? (OP.auth_obra[0].usuarios? (OP.auth_obra[0].usuarios[0].user):''):''):'',
            aprobado_adm: OP?.auth_adm? (OP.auth_adm[0]? (OP.auth_adm[0].usuarios? (OP.auth_adm[0].usuarios[0].user):''):''):'',
            
            formaPago: OP?.formaPago,          
            rubroId: rubros?.find(rubro => rubro?.id === OP?.rubroId)?.rubro,
            subrubroId: subRubros?.find(subRubro => subRubro?.id === OP?.subRubroId)?.subRubro,
            Color_estadoOP: OP?.estadoOP,     
            onAuthObra: () => nonAuthObra(OP),
            onAuthAdm: () => nonAuthAdm(OP),
            onEnviar: () => enviarCorreo(OP),
            cargarOP: () => cargar_y_subir_OP(OP),
            esEditable: () => (OP),
            onIrDetalle: () => irDetalle(OP),    
            
          }))}
          onCellEditCommit={modifyData}
          columns={columns(colVisibles, estados, retenciones, fondos_s, verColumnBlue, puedeEditar, rubros, subRubros, setIsPromptOpen, setRowIdToDelete)}
          
          sortModel={sortModel}
          onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
          onColumnVisibilityChange={(model) => change(model)}

          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          pagination

          isCellEditable={(params) => (!params.row.confirmada || accesoOP ==='total')}

          /*disableSelectionOnClick*/
          checkboxSelection
          onSelectionModelChange={setSelectionModel}
               
          autoHeight
          
          scrollbarSize
          components={{
            Toolbar: CustomToolbar,
          }}

          getRowClassName={(params) => `color_x_estado-${params.row.confirmada?'conf':params.row.Color_estadoOP===6? 'anulado':params.row.Color_estadoOP===2? 'parap':params.row.Color_estadoOP===1||params.row.Color_estadoOP===4? 'auth':'regular'}`}
          
          
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
              enviarCorreo_2(miOP.id, miOP?.fideicomisos[0]?.nombre, miOP.numero, miOP.empresas[0]?.razonSocial, miOP.empresas[0]?.enviar_OP_auto, idSociety, miOP?.fideicomisos[0]?.mailOP)
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

async function enviarCorreo_2(idOP, fideicomiso, numero, razonSocial, enviar_OP_auto, idSociety, mailOP){

  let rta = await postMethod(`OP/enviarMail/${idSociety?.id}`, {

    mailTo : mailOP,// mail al contador por fideicomiso
    mailaccount : idSociety?.mailaccount,// desde donde se envia el correo
    mailfromname : idSociety?.mailfromname,
    mailConstructora : idSociety?.mailConstructora,// cuando copia a la contructora
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
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['id', 'createdAt', 'fideicomiso', 'numero','empresa','monto','moneda','RET_SUSS','RET_GAN','RET_IVA','fondos','estadoRET', 'estadoOP', 'apr_obra', 'apr_adm','rubroId', 'subrubroId','descripcion'] }} />
    </GridToolbarContainer>
  );
}


function IrDetalleOP_0(params) {

  let path = `${params.row.id}/${params.row.createdAt}/${params.row.empresaId}/${params.row.numero}/${params.row.fideicomisoId}/${params.row.fideicomiso}/${params.row.Color_estadoOP}/${params.row.apr_adm===''? 'null':params.row.apr_adm}/${params.row.apr_obra===''? 'null':params.row.apr_obra}/${params.row.confirmada? 1:0}/${params.row.blue}/OP Detalle`;
  
  return <Button
          component={RouterLink}
          sx={{color: 'primary.main',}}
          to={path}
        >
          <span>{ params.row.id }</span>
        </Button>

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
    
    ...subRubros.filter(subR => subR.rubroId === parseInt(props?.row?.filtroRubroID)),
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

