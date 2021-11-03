import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { mostrarFecha } from 'src/utils/utils';

const columns = [
  {
    field: 'empresa',
    headerName: 'Razon Social',
    width: 170,
    editable: false,
    headerAlign: 'center',
  },

  {
    field: 'numero',
    headerName: 'Número',
    width: 155,
    editable: true,
    headerAlign: 'center',
  },

  {
    field: 'montoTotal',
    headerName: 'Monto',
    width: 130,
    editable: true,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'link',
    headerName: 'Link',
    width: 155,
    editable: true,
    headerAlign: 'center',
    renderCell:  ({ row: { link } }) => (
      <a href={ link }  target="_blank" >{ link }</a>)
  },

  {
    field: 'fechaIngreso',
    headerName: 'Ingreso',
    width: 145,
    type: 'date',
    editable: false,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => mostrarFecha(value),
  },
  {
    field: 'fechaVTO',
    headerName: 'VTO',
    width: 155,
    type: 'date',
    editable: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: fFecha,
    
  },

  /*
  {
    field: 'montoTotal',
    headerName: 'otra',
    width: 150,
    headerAlign: 'center',
    align: 'center',
    renderCell: fmartin,
  },*/

  {
    field: 'deleteIcon',
    headerName: '',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: DeleteRow,
  },
];

export function GrillaFactura({ idSociety, selectedFacturaData }) {

  const {
    data: products,
    isLoading,
    error,
  } = useQuery(['facturas', idSociety, selectedFacturaData], () =>
    getMethod(`factura/listar/${idSociety?.id}`)
  );

  const queryClient = useQueryClient();

  const { mutate: deleteProduct } = useMutation(
    async id =>
      await deleteMethod(`factura/eliminar/${idSociety?.id}`, {
        //fideicomisoId: selectedFacturaData?.id,
        id: id,
      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['facturas', idSociety, selectedFacturaData]),
    }
  );



  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    // console.log('e:', e);
    let newData = {
      id: e.id,
      // idFideicomiso: selectedFacturaData?.id,
      [e.field]: e.value,
    };
    // console.log('newData:', newData);
    postMethod(`factura/modificar/${idSociety?.id}`, newData);
  }

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        
        
        rows={products.map(el => ({
          id: el.id,
          // empresaId: el.empresaId,
          empresa:(el.empresas[0]?el.empresas[0].razonSocial:''),
          numero: el.numero,
          link: el.link,
          montoTotal: el.montoTotal,
          fechaIngreso: el.fechaIngreso,
          fechaVTO: el.fechaVTO,  
          onDelete: () => deleteProduct(el.id),
        }))}


        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        sortModel={[
          {
            field: 'fechaIngreso',
            sort: 'asc',
          },
        ]}
        scrollbarSize
        onCellEditCommit={handleCellModification}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
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

function fFecha(params) {
  let fechaVTO = null; 
  if(params.row.fechaVTO){
    fechaVTO = mostrarFecha(params.row.fechaVTO);
  }else{
    fechaVTO = '';
  }

  return fechaVTO;
}

/*
function fmartin() {
  console.log(3333);
  return 2222;
}*/
