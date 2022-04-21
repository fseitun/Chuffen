import { useQueryClient, useMutation } from 'react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postMethod } from 'src/utils/api';
import { useContext } from 'react';
import { TiposContext} from 'src/App';

// const columns = [
const columns = (puedeEditar, verEliminar) => [
  {
    field: 'tipo', // campo en grilla
    headerName: 'Tipo de Comp.',
    width: 170,
    // type: 'singleSelect',
    editable: false,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    // renderEditCell: props => <ComboBoxFon fondos_s={fondos_s} props={props} />,
    headerAlign: 'center',
  },
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
    field: 'es_ajuste',
    headerName: 'M. Costo',
    type: 'boolean',
    width: 150,
    editable: false,
    headerAlign: 'center',
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

export function GrillaDetalleOP({ idSociety, OPId, loggedUser, selectedFacturaData, facturas, isLoading, error, refetch }) {
  
  const queryClient = useQueryClient();
  var tipos = useContext(TiposContext);
  var puedeEditar = true;
  const accesoOP = loggedUser?.['rol.op'];

  if( accesoOP ==='vista'){puedeEditar =false}

  var verEliminar = true;
  if(loggedUser?.['rol.op'] ==='parcial' || loggedUser?.['rol.op'] ==='vista'){verEliminar =false}

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
          // confirmada:(el.OPs[0]?el?.OPs[0]?.confirmada:0),
          numero: el.numero,
          tipo: {
            id: el.tipo,
            descripcion: tipos?.find(tipo => tipo.id === el.tipo)?.descripcion,
          },
          link: el.link,
          link2: el.link,
          montoTotal: el.montoTotal, // parseInt(el.tipo)===2? (-1 * el.montoTotal):el.montoTotal,
          moneda: el.moneda,
          es_ajuste: el.es_ajuste,
          detalle: el.detalle,
          txtOC: el.txtOC,
          fechaIngreso: el.fechaIngreso,
          fechaVTO: el.fechaVTO,  
          onDelete: () => deleteProduct(el.id),
        }))}

        columns={columns(puedeEditar, verEliminar)}
        // isCellEditable={(params) => (!params.row.confirmada || accesoOP ==='total')}
        disableSelectionOnClick           
        autoHeight   
        onCellEditCommit={handleCellModification}
        /*hideFooterSelectedRowCount*/
     
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
