import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, postMethod } from 'src/utils/api';

const columns = [
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
    editable: true,
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
    editable: true,
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
    field: 'deleteIcon',
    headerName: '',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: DeleteRow,
  },

];

export function GrillaDetalleOP({ idSociety, OPId, loggedUser, selectedFacturaData }) {
  
  const {
    data: facturas,    
    /*rowLength: filas,*/
    isLoading,
    error,
  } = useQuery(['facturas', idSociety, selectedFacturaData], () =>
    getMethod(`factura/listar/${idSociety?.id}/opid/7`)
  );

  const queryClient = useQueryClient();

  const { mutate: deleteProduct } = useMutation(
    async id =>
      await postMethod(`factura/modificar/${idSociety?.id}`, {
        //libera la factura con OPId= null
        id: id,
        OPId: null,
      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['facturas', idSociety, selectedFacturaData]),
    }
  );



  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    
    let newData = {
      id: e.id,
     [e.field]: e.value,
    };
    
    postMethod(`factura/modificar/${idSociety?.id}`, newData);
  }

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        
        
        rows={facturas.map(el => ({
          id: el.id,
          empresa:(el.empresas[0]?el.empresas[0].razonSocial:''),
          numero: el.numero,
          link: el.link,
          montoTotal: el.montoTotal,
          moneda: el.moneda,
          detalle: el.detalle,
          txtOC: el.txtOC,
          fechaIngreso: el.fechaIngreso,
          fechaVTO: el.fechaVTO,  
          onDelete: () => deleteProduct(el.id),
        }))}


        columns={columns}
        /*pageSize={25}*/
        /*autoPageSize= {false}*/
        /*Pagination = {false}*/
        /*pagination = {false}*/
        /*checkboxSelection*/
        disableSelectionOnClick
        /*pageSize={500}*/
        rowsPerPageOptions={[100]}
        
        autoHeight
        sortModel={[
          {
            field: 'numero',
            sort: 'asc',
          },
        ]}
        /*scrollbarSize*/
        onCellEditCommit={handleCellModification}
        /*components={{
          Toolbar: CustomToolbar,
        }}*/
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
