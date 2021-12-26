import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, TextField, Autocomplete} from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from 'src/utils/usePrompt';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import RepOp from "src/components/reportes/orden_de_pago/orden_de_pago";

var miOP={};
var fa={};
var idSociedad=0;

const columns = (rubros, subRubros, setIsPromptOpen, setRowIdToDelete) => [
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
    field: 'estadoRET', // campo en grilla
    headerName: 'Retenciones',
    width: 150,
    editable: true,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    renderEditCell: props => <ComboBoxRet retenciones={retenciones} props={props} />,
    headerAlign: 'center',
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
  {
    field: 'estadoOP', // campo en grilla
    headerName: 'Estado',
    width: 150,
    editable: true,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    renderEditCell: props => <ComboBoxEst estados={estados} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'fondos', // campo en grilla
    headerName: 'Fondos',
    width: 150,
    type: 'singleSelect',
    editable: true,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    renderEditCell: props => <ComboBoxFon fondos_s={fondos_s} props={props} />,
    headerAlign: 'center',
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
    field: 'descripcion',
    headerName: 'Detalle',
    width: 140,
    editable: true,
    headerAlign: 'center',
    align: 'center',    
  }, 
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
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

const retenciones = [  
  { id: 1, descripcion: '-' },
  { id: 2, descripcion: 'OK' },
  { id: 3, descripcion: 'Pendiente' },
];

const estados = [  
  { id: 0, descripcion: '-' },
  { id: 1, descripcion: 'Para autorizar Obra' },
  { id: 2, descripcion: 'Para pagar' },
  { id: 3, descripcion: 'Pagada' },
  { id: 4, descripcion: 'Para autorizar AC' },
  { id: 5, descripcion: 'Pagado Parcial' },
  { id: 6, descripcion: 'Anulado' },
  { id: 7, descripcion: 'Cargada en Banco' },
];
const fondos_s = [  
  { id: 1, descripcion: '-' },
  { id: 2, descripcion: 'OK cargado' },
];


export function GrillaOP({ idSociety }) {
  
  idSociedad = idSociety.id;
  var result = {};

  const navigate = useNavigate();
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  
  const apiServerUrl = process.env.REACT_APP_API_SERVER
                                                      
  const {
    data: opInformation,
    isLoading,
    error,
  } = useQuery(['OP', idSociety], () => getMethod(`OP/listar/${idSociety.id}/todas/nulo`));

  const queryClient = useQueryClient();

  const { data: rubros } = useQuery(['rubros', idSociety], () =>
    getMethod(`rubro/listar/${idSociety.id}`)
  );

  const { data: subRubros } = useQuery(['subrubros', idSociety], () =>
    getMethod(`subrubro/listar/${idSociety.id}/0`)
  );

  // es un array de facturas para la columna facturas asociada a una OP (OPId)
  const { data: grfacturas } = useQuery(['grfacturas', idSociety.id], async() =>
  await getMethod(`factura/listar/${idSociety.id}/todas/25`));


  const { mutate: irDetalle } = useMutation(
    async el =>    
      navigate(`./${el.id}/${el.createdAt}/${el.empresaId}/${el.numero}/${el.fideicomisos[0]?.nombre}`)

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
         getPdfBlob(miOP?.id, miOP?.fideicomisos[0]?.nombre, miOP?.numero);
        }        
    }     
  );

  async function getPdfBlob(idOP, fideicomiso, numero){

    let blobPdf = await pdf(NewDocument()).toBlob();
    let formData = new FormData();
    formData.append('logo', blobPdf);
    formData.append('id', idOP);
    formData.append('fideicomiso', fideicomiso);
    formData.append('numero', numero);    
    postMethod(`op/modificar/${idSociety.id}`, formData);
    
  }

  const NewDocument = () => {
    
    return (
      <RepOp dataOP={miOP} dataFacturas={fa} apiServerUrl={apiServerUrl} idSociedad={idSociety.id} />
    )
  }
  /***** fin generar y subir pdf ***********************************************************************/

 
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

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>//{
      //if(field!='fico'){
        // console.log([field], id),
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
     // }
    //}
  );
  
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (

      <div style={{ width: '100%' }}>
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
        <ToastContainer /> 
        <DataGrid 
          rows={opInformation.map(OP => ({
            id: OP.id,    
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
            fondos: {
              id: OP.fondos,
              descripcion: fondos_s?.find(fondos => fondos.id === OP.fondos)?.descripcion,
            },
            fideicomiso: OP.fideicomisos[0]?.nombre,
            archivada: OP.archivada,
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
     
            onAuthObra: () => nonAuthObra(OP),
            onAuthAdm: () => nonAuthAdm(OP),
            cargarOP: () => cargar_y_subir_OP(OP),
            onIrDetalle: () => irDetalle(OP),    
            
          }))}
          onCellEditCommit={modifyData}
          columns={columns(rubros, subRubros, setIsPromptOpen, setRowIdToDelete)}
          disableSelectionOnClick
          autoHeight
          density={'comfortable'}
          scrollbarSize
          components={{
            Toolbar: CustomToolbar,
          }}
          
        >
        

        </DataGrid>
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

function ComboBoxFon({ fondos_s, props }) {
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

  return (
    <Autocomplete
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
    />
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

function DescargarPDF(params) {  
  
  var cargarOP = params.row.cargarOP;
  const fideicomiso = params.row.fideicomiso;
  const numero = params.row.numero;
  var nombrePDF = "OP_" +  fideicomiso + "_" + numero + ".pdf";
  const archivada = params.row.archivada;
  const apiServerUrl = process.env.REACT_APP_API_SERVER;

  
  const notify = () =>{
    
    cargarOP();
    // return(
    setTimeout(() => {
    
        toast(({ closeToast}) => (
          // cargarOP()
          <Box>
            <Button
              sx={{ p: 1, m: 1 }}
              variant='contained'
              color='secondary'
              size='small'
              onMouseDownCapture={cargarOP()}
              onClick={closeToast}>
              
              Cancelar
            </Button>

            <PDFDownloadLink document={<RepOp dataOP={miOP} dataFacturas={fa} apiServerUrl={apiServerUrl} idSociedad={idSociedad} />} fileName={nombrePDF} >
              {({ blob, url, loading, error }) => {
          
                return (loading ? 'Loading document...' : 'Descargar')}
              }
            </PDFDownloadLink> 

            
          </Box>
        )) // )
      }, 800);
    };
  
  if(archivada === 0){
    return <Button onClick={notify} >Para Generar</Button>;
  }else{
    return <Button onClick={notify} >Generada</Button>;    
  }

} 


