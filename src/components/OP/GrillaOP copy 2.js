import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, TextField, Autocomplete} from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (rubros, subRubros, setIsPromptOpen, setRowIdToDelete, setRowIdToObra, setRowIdToADM) => [
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
    field: 'apr_obra',
    headerName: 'Ap. Obra',
    width: 140,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row }) => ( 
      <Button 
        onClick={e => {
          if(row.nonAuthObraId.authOBRA){
          setRowIdToObra(row.nonAuthObraId);
          setIsPromptOpen(true);}
        }
      }
      >{ row?.apr_obra }  </Button>
    ),
  },
  {
    field: 'apr_adm',
    headerName: 'Ap. ADM',
    width: 140,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row }) => ( 
      <Button 
        onClick={e => {
          if(row.nonAuthADMId.authADM){
          setRowIdToADM(row.nonAuthADMId);
          setIsPromptOpen(true);}
        }
      }
      >{ row?.apr_adm }  </Button>
    ),
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
    field: 'enviar enviada',
    headerName: 'Archivada',
    width: 140,
    headerAlign: 'center',
    align: 'center',
    renderCell: EnviarRow,
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
          // setMsg("Eliminar fila");
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];

const retenciones = [  
  { id: 0, descripcion: '-' },
  { id: 1, descripcion: 'OK' },
  { id: 2, descripcion: 'Pendiente' },
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
  const navigate = useNavigate();
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  const [rowIdToObra, setRowIdToObra] = useState();
  const [rowIdToADM, setRowIdToADM] = useState();
  // const [msg, setMsg] = useState();
  // let msg = ""; 
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
      navigate(`./${el.id}/${el.createdAt}/${el.empresaId}/OP_${el.numero}`)

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

  const { mutate: nonAuthADM } = useMutation(
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
    async ({ field, id, value }) =>
      await postMethod(`OP/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
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
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
      <div style={{ width: '100%' }}>

       <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
       <Prompt message="¿Desaprobar en obra?" action={() => nonAuthObra(rowIdToObra)} />
       <Prompt message="¿Desaprobar en ADM?" action={() => nonAuthADM(rowIdToADM)} />
 
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
            nonAuthADMId: OP,
            nonAuthObraId: OP,
            onIrDetalle: () => irDetalle(OP),    
            
          }))}
          onCellEditCommit={modifyData}
          columns={columns(rubros, subRubros, setIsPromptOpen, setRowIdToDelete, setRowIdToObra, setRowIdToADM)}
          disableSelectionOnClick
          autoHeight
          density={'comfortable'}
          scrollbarSize
          onRowDoubleClick={a => {
             return IrADetalleOP(a);
           }}
          components={{
            Toolbar: CustomToolbar,
          }}
          
        >
        

        </DataGrid>
      </div>
    );

    function IrADetalleOP(params) {
      if(1===2){
        navigate(`./${params.row.id}/${params.row.createdAt}/${params.row.empresaId}/OP_${params.row.numero}`);
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
  console.log('props que recibe el combo', props?.row?.rubroID.id);
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
      //disablePortal
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
        
        //console.log(555555555, id, newValue?.id);     
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      //disablePortal
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
        
        //console.log(555555555, id, newValue?.id);     
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
        console.log(555555555, id, newValue?.id);    
        //console.log(555555555, id, newValue?.id);     
        if(newValue?.id > 0){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      //disablePortal
      id="combo-box-demo"
      options={fondos_s}
      isOptionEqualToValue={(op, val) => op.descripcion === val.descripcion}
      getOptionLabel={option => option.descripcion}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="Fondos" />}
    />
  );
}

