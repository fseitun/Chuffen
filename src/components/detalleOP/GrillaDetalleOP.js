import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, postMethod } from 'src/utils/api';

// const columns = [
const columns = (puedeEditar, verEliminar) => [
  {
    field: 'empresa',
    headerName: 'Proveedor',
    width: 170,
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'detalle',
    headerName: 'Detalle',
    width: 175,
    editable: puedeEditar,
    headerAlign: 'center',
  },
  {
    field: 'numero',
    headerName: 'Nro Factura',
    width: 185,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'txtOC',
    headerName: 'Nro OC',
    width: 130,
    editable: puedeEditar,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'montoTotal',
    headerName: 'Importe',
    width: 130,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'link2',
    headerName: '',
    width: 20,
    editable: false,
    headerAlign: 'center',
    renderCell:  ({ row: { link } }) => (
      <a href={ link }  rel="noreferrer" target="_blank" >ver</a>)
  },
  {
    field: 'deleteIcon',
    headerName: '',
    hide: !verEliminar,
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: DeleteRow,
  },

];

export function GrillaDetalleOP({ idSociety, OPId, loggedUser, selectedFacturaData, refetch }) {
  
  const queryClient = useQueryClient();

  var puedeEditar = true;
  const accesoOP = loggedUser?.['rol.op'];
  const blue = -1; // trae todas las de la OP
  if( accesoOP ==='vista'){puedeEditar =false}

  var verEliminar = true;
  if(loggedUser?.['rol.op'] ==='parcial' || loggedUser?.['rol.op'] ==='vista'){verEliminar =false}

  const {
    data: facturas,    
    isLoading,
    error,
  } = useQuery(['facturas', idSociety, selectedFacturaData], () =>
    getMethod(`factura/listar/${idSociety?.id}/opid/${OPId}/${blue}`)
  );

  const { mutate: deleteProduct } = useMutation(
    async id =>
      await postMethod(`factura/modificar/${idSociety?.id}`, {
        //libera la factura con OPId= null
        id: id,
        OPId: null,
      }),
    {
      
      onSuccess: async ()=> {
        if (idSociety.id > 0) {
            await queryClient.refetchQueries(['facturas', idSociety, selectedFacturaData])
        }
        refetch()
        
      }
    }
  );


 // await queryClient.refetchQueries(['facturas', idSociety, selectedFacturaData]), 


  function handleCellModification(e) {
    
    let newData = {
      id: e.id,
     [e.field]: e.value,
    };    
    postMethod(`factura/modificar/${idSociety?.id}`, newData);
    
  }


  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        
        
        rows={facturas.map(el => ({
          id: el.id,
          empresa:(el.empresas[0]?el.empresas[0].razonSocial:''),
          confirmada:(el.OPs[0]?el.OPs[0].confirmada:0),
          numero: el.numero,
          link: el.link,
          link2: el.link,
          montoTotal: el.montoTotal,
          moneda: el.moneda,
          detalle: el.detalle,
          txtOC: el.txtOC,
          fechaIngreso: el.fechaIngreso,
          fechaVTO: el.fechaVTO,  
          onDelete: () => deleteProduct(el.id),
        }))}

        columns={columns(puedeEditar, verEliminar)}
        isCellEditable={(params) => (!params.row.confirmada || accesoOP ==='total')}
        disableSelectionOnClick           
        autoHeight   
        onCellEditCommit={handleCellModification}
     
      />
    </div>
  );
}




function DeleteRow(params) {
  const deleteRow = params.row.onDelete;
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
  return <Delete onClick={notify} />;
}
