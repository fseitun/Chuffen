import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { mostrarFecha } from 'src/utils/utils';
import { DeleteRow } from 'src/components/auxiliares/DeleteRow';

const columns = [
  {
    field: 'empresa',
    headerName: 'Razon Social',
    width: 170,
    editable: true,
    headerAlign: 'center',
  },

  {
    field: 'numero',
    headerName: 'Número',
    width: 170,
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
    field: 'fechaIngreso',
    headerName: 'Ingreso',
    width: 150,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => mostrarFecha(value),
  },
  {
    field: 'fechaVTO',
    headerName: 'FechaVTO',
    width: 150,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => mostrarFecha(value),
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

export function GrillaFactura({ idSociety }) {
  // console.log('idSociety:', idSociety);
  // console.log('selectedFideicomisoData:', selectedFideicomisoData);
  const {
    data: products,
    isLoading,
    error,
  } = useQuery(['facturas', idSociety], () => getMethod(`factura/listar/${idSociety?.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idFactura => {
      console.log('mutanting from reactQuery', 'id:', idFactura);
      return await deleteMethod(`factura/eliminar/${idSociety?.id}`, {
        fideicomisoId: idSociety?.id,
        id: idFactura,
      }); //TODO corregir método de eliminación
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['facturas', idSociety]),
    }
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;
  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={products.map(el => ({
          id: el.id,
          empresaId: el.empresaId,
          empresa: el.empresas[0].razonSocial,
          numero: el.numero,
          montoTotal: el.montoTotal,
          fechaIngreso: el.fechaIngreso,
          fechaVTO: el.fechaVTO,
          onDelete: () => eliminate(el.id),
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

  function handleCellModification(e) {
    // console.log('e:', e);
    let newData = {
      id: e.id,
      [e.field]: e.value,
    };
    console.log('newData:', newData);
    postMethod(`factura/modificar/${idSociety?.id}`, newData);
  }
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
