import * as React from 'react';
import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button} from '@mui/material';
import { IconButton, Collapse, Alert } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from 'src/utils/usePrompt';
import 'react-toastify/dist/ReactToastify.css';
import { darken, lighten } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';

const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);
  

const columns = (puedeEditar, setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'id',
    width: 120,
    headerName: 'Num',
    renderCell: IrDetalleOP_0   
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
    renderCell: IrDetalleOC_1,
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
    field: 'descripcion1',
    width: 160,
    editable: puedeEditar,
    headerName: 'Descri',
   
  },
  {
    field: 'monto_ARS',
    headerName: 'Tot ARS',
    width: 130,
    editable: false,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'monto_USD',
    headerName: 'Tot UDS',
    width: 130,
    editable: false,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
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


// const apiServerUrl = process.env.REACT_APP_API_SERVER;
export function GrillaOC({ filtFide, filtRS, filtEst, idSociety, loggedUser, ocInformation, isLoading, error}) {

  var puedeEditar = true;
  const accesoOC = loggedUser?.['rol.oc'];
  if( accesoOC ==='vista'){puedeEditar =false}

  const navigate = useNavigate();
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();  

  const queryClient = useQueryClient();

  const { mutate: irDetalle } = useMutation(

    async el => await  getMethod(`oc/mostrar/${idSociety.id}/${el.id}`),
      {onSettled: (el) => { /*queryClient.refetchQueries(['formOC', idSociety]);*/
      navigate(`./${el.id}/OC Detalle`)}
    }
    
  );

  const { mutate: eliminate } = useMutation(
    async idOC => await deleteMethod(`OC/eliminar/${idSociety.id}`, { id: idOC }),
    {
      onMutate: async idOC => {
        await queryClient.cancelQueries(['OC', idSociety]);
        const prevData = queryClient.getQueryData(['OC', idSociety]);
        const newData = prevData.filter(oc => oc.id !== idOC);
        queryClient.setQueryData(['OC', idSociety], newData);
        return prevData;
      },
      onError: (err, idOC, context) => queryClient.setQueryData(['OC', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['OC', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
            await postMethod(`OC/modificar/${idSociety.id}`, {id,[field]: value,}),
            
        {
          onMutate: async ({ field, id, value }) => {
            await queryClient.cancelQueries(['OC', idSociety]);
            const prevData = queryClient.getQueryData(['OC', idSociety]);
            const newData = [
              ...prevData.filter(op => op.id !== id),
              { ...prevData.find(op => op.id === id), [field]: value },
            ];
            queryClient.setQueryData(['OC', idSociety], newData);
            return prevData;
          },
          onError: (err, id, context) => queryClient.setQueryData(['OC', idSociety], context),
          onSettled: () => queryClient.invalidateQueries(['OC', idSociety]),
        }
  );

  // const [selectionModel, setSelectionModel] = useState([]);

  const [open, setOpen] = useState(false);

  function filtrar(element, filtFide, filtRS){
        
    if(filtFide === -1 && filtRS === -1 ){
      return true;
    }

    if(filtFide > -1 && filtRS === -1 ){//fide
      if(element.fideicomisoId===filtFide){return true;}else{return false;}
    }

    if(filtFide === -1 && filtRS > -1 ){// proveedor
      if(element.empresaId===filtRS){return true;}else{return false;}    }

    if(filtFide > -1 && filtRS > -1 ){
      if(element.fideicomisoId===filtFide && element.empresaId===filtRS){return true;}else{return false;}
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
          rows={ocInformation.filter(element =>filtrar(element, filtFide, filtRS)).map(OC => ({
            id: OC.id,    
            // numero: OC.numero,
            fideicomiso: OC.fideicomisos[0]?.nombre,
            empresa: OC.empresas[0]?.razonSocial,
            empresaId: OC.empresaId,
            monto_ARS: OC.monto_ARS,
            monto_USD: OC.monto_USD,
            descripcion1: OC.descripcion1,
            createdAt: OC.createdAt, 
            deleteId: OC.id,

            esEditable: () => (OC),
            onIrDetalle: () => irDetalle(OC),    
            
          }))}
          onCellEditCommit={modifyData}
          columns={columns(puedeEditar, setIsPromptOpen, setRowIdToDelete)}

          disableSelectionOnClick
          /* checkboxSelection */
          /* onSelectionModelChange={setSelectionModel} */
               
          autoHeight
          density={'comfortable'}
          scrollbarSize
          components={{
            Toolbar: CustomToolbar,
          }}

          getRowClassName={(params) => `super-app-theme--false`}          
        >      

        </DataGrid>
  
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

      <GridToolbarExport csvOptions={{ fields: ['createdAt', 'fideicomiso', 'numero','empresa','monto','moneda','RET_SUSS','RET_GAN','RET_IVA','fondos_','retencion', 'aprobado_obra', 'aprobado_adm', 'estado', 'fondos_', 'rubro', 'subrubro','descripcion'] }} />
      
    </GridToolbarContainer>
  );
}

function IrDetalleOP_0(params) {

  let path = `${params.row.id}/OC Detalle`;
  
  return <Button
          component={RouterLink}
          sx={{color: 'primary.main',}}
          to={path}
        >
          <span>{ params.row.id }</span>
        </Button>

} 


function IrDetalleOC_1(params) {

  const sendRow = params.row.onIrDetalle;
  const fideicomiso = params.row.fideicomiso;
  return <Button onClick={sendRow} >{fideicomiso}  </Button>;
} 
