import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { getMethod, postMethod} from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';
import { Box, Button, IconButton, Collapse, Alert, Avatar} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';
import { darken, lighten } from '@mui/material/styles';
import { useContext } from 'react';
import { EstadosContext} from 'src/App';


const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const columns = (tipo, setIsPromptOpen, setRowIdToDelete) => [

  {
    field: 'estadoId',
    headerName: 'Requiere autorizar en Obra',
    width: 70,
    filterable: false,
    sortable: false,
    hide: (tipo==='obra'),
    editable: false,
    headerAlign: 'center',
    renderCell: ({ value }) => value!==1?'' :<Avatar sx={{ bgcolor: '#39BC44' }} >Ob</Avatar>,
  },
  {
    field: 'id',
    headerName: 'Id',
    width: 55,
    editable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: IrDetalleOP_0
  }, 
  {
    field: 'createdAt',
    headerName: 'Fecha',
    editable: false,
    width: 115,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => mostrarFecha(value),
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
    headerName: 'Nro',
    width: 110,
    editable: false,
    headerAlign: 'center',
    align: 'right',
    renderCell: IrDetalleOP_2,    
  },
  {
    field: 'empresa',
    headerName: 'Razón Social',
    editable: false,
    width: 160,
    headerAlign: 'center',
    align: 'center',
  },  
  {
    field: 'monto',
    headerName: 'Monto',
    editable: false,
    width: 120,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'moneda',
    headerName: 'Moneda',
    editable: false,
    width: 50,
    headerAlign: 'center',
    align: 'left',    
  },
  {
    field: 'formaPago',
    headerName: 'Forma Pago',
    width: 155,
    editable: true,
  },
  {
    field: 'estadoOP', // campo en grilla
    headerName: 'Estado',
    width: 150,
    editable: false,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    headerAlign: 'center',
  },
  {
    field: 'PriceCheckIcon',
    headerName: 'Autorizar',
    width: 155,
    filterable: false,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { authId } }) => (
      <PriceCheckIcon
        onClick={e => {

          setRowIdToDelete(authId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },

];


export function GrillaOpAuth({ idSociety,  loggedUser, tipo }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  const navigate = useNavigate();
  const blue = 0; // trae todas las de la OP

  let str = '';
  if(tipo ==='adm'){
    str = `OP/listar/${idSociety.id}/authADM/nulo/${blue}/0/0/0`;
  }else{
    str = `OP/listar/${idSociety.id}/authObra/nulo/${blue}/0/0/0`;
  }

  const {
    data: opInformation,
    isLoading,
    error,
  } = useQuery(['OP' + tipo, idSociety], () => getMethod(str));
 
  const queryClient = useQueryClient();

  const { mutate: authFila } = useMutation(
 
    async ({ rowIdToDelete, tipo, loggedUser }) =>
    
      await postMethod(`autorizacion/agregar/${idSociety?.id}`, {

        opid : rowIdToDelete,
        documento: 'op',
        tipoAutorizacion: tipo,
        creador: loggedUser.id

      }),
      {
        onSuccess: async () =>
          await queryClient.refetchQueries(['OP' + tipo, idSociety]),
      }

  );

  const { mutate: irDetalle } = useMutation(
    async el =>    
      navigate(`./${el.id}/${el.createdAt}/${el.empresaId}/${el.numero}/${el.fideicomisoId}/${el.fideicomisos[0]?.nombre}/${el.estadoOP}/${el?.auth_adm[0]?.usuarios[0]?.user}/${el?.auth_obra[0]?.usuarios[0]?.user}/${el.confirmada}/${el.blue}/OP Detalle`)

  );
  

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`OP/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['OP' + tipo, idSociety]);
        const prevData = queryClient.getQueryData(['OP' + tipo, idSociety]);
        
        const newData = [
          ...prevData.filter(OP => OP.id !== id),
          { ...prevData.find(OP => OP.id === id), [field]: value },
        ];
        
        queryClient.setQueryData(['OP' + tipo, idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['OP' + tipo, idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['OP' + tipo, idSociety]),
    }
  );
  var estados = useContext(EstadosContext);
  const [selectionModel, setSelectionModel] = useState([]);

  const [open, setOpen] = useState(false);

  // postMethod

  function filtrar(element, tipo){
    if(tipo==='adm'){
      return true;
    }else{ // tipo = 'obra'
       // Estado = Para Autorizar en Obra      
      if(element.estadoOP===1){return true;}else{return false;}
    }

  }

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
        <Prompt message="¿Autorizar fila?" action={() => authFila({rowIdToDelete, tipo, loggedUser})} />

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

        <DataGrid
          rows={opInformation.filter(element =>filtrar(element, tipo)).map(OP => ({
            estadoId: OP.estadoOP,
            id: OP.id,  
            createdAt: OP.createdAt,
            fideicomiso: OP.fideicomisos[0].nombre,
            numero: OP.numero,
            empresa: OP.empresas[0].razonSocial,
            monto: OP.monto,
            moneda: OP.moneda,   
            formaPago: OP.formaPago,   
            estadoOP: estados?.find(estado => estado.id === OP.estadoOP)?.descripcion,
            Color_estadoOP: OP.estadoOP,

            empresaId: OP.empresaId,
            apr_obra: (OP.auth_obra[0]?OP.auth_obra[0].usuarios[0].user:''),
            apr_adm: (OP.auth_adm[0]?OP.auth_adm[0].usuarios[0].user:''),
            authOBRA: (OP.authOBRA? true: false),
            authId: OP.id,
            blue: OP.blue,
            confirmada: OP.confirmada===0? false: true,
            onIrDetalle: () => irDetalle(OP),   
          }))}
          onCellEditCommit={modifyData}
          columns={columns(tipo, setIsPromptOpen, setRowIdToDelete)}

          sortModel={sortModel}
          onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
       
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          pagination

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


<Button onClick={()=>auth_seleccionados(selectionModel, idSociety, tipo, loggedUser, authFila, setOpen)} >
        Autorizar filas Seleccionadas
</Button>


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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['id', 'createdAt', 'fideicomiso', 'numero', 'empresa', 'monto', 'moneda', 'formaPago', 'estadoOP'] }} />
    </GridToolbarContainer>
  );
}


function auth_seleccionados(selectionModel, idSociety, tipo, loggedUser, authFila, setOpen) {
  let err = false;
  let rowIdToDelete = 0;

  for (let i = 0; i < selectionModel.length ; i++) {
    try {      

      rowIdToDelete = selectionModel[i];
      authFila(({rowIdToDelete, tipo, loggedUser}));

      
    } catch (error) {
      err = true;
      console.log(error);

    }
  }



  if(!err){
    setOpen(true);
  }

}


function IrDetalleOP_0(params) {
 
  let path = `${params.row.id}/${params.row.createdAt}/${params.row.empresaId}/${params.row.numero}/${params.row.fideicomiso}/${params.row.Color_estadoOP}/${params.row.apr_adm===''? 'null':params.row.apr_adm}/${params.row.apr_obra===''? 'null':params.row.apr_obra}/${params.row.confirmada? 1:0}/${params.row.blue}/OP Detalle`;
  
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

