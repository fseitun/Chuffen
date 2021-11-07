import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
// import { AssignmentTurnedIn } from '@mui/icons-material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, postMethod } from 'src/utils/api';

const columns = [

  {
    field: 'createdAt',
    headerName: 'Fecha',
    editable: false,
    width: 115,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
  },

  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    editable: false,
    width: 155,
    headerAlign: 'center',
    align: 'center',
  },

  {
    field: 'numero',
    headerName: 'Numero',
    editable: false,
    width: 130,
    headerAlign: 'center',
    align: 'right',
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
    width: 125,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'moneda',
    headerName: '',
    editable: false,
    width: 60,
    headerAlign: 'center',
    align: 'left',    
  },

  {
    field: 'PriceCheckIcon',
    headerName: 'Autoriza ADM',
    width: 195,
    headerAlign: 'center',
    align: 'center',
    renderCell: AuthRow,
  },
  
];              
export function GrillaOPAdm({ idSociety }) {

  const { data, isLoading, error } = useQuery(['OP', idSociety.id], () =>
    getMethod(`OP/listar/${idSociety.id}/authADM/nulo`)
  );
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: authProduct } = useMutation(
    async id =>
      await postMethod(`autorizacion/agregar/${idSociety?.id}`, {

        opid : id,
        documento: 'op',
        tipoAutorizacion: 'adm',
        creador: 1

      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['OP', idSociety]),
    }
  );



  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={data.map((el) => ({
          id: el.id,        
          numero: el.numero,
          empresa: el.empresas[0].razonSocial,
          monto: el.monto,
          moneda: el.moneda,         
          fideicomiso: el.fideicomisos[0].nombre,          
          apr_obra: (el.auth_obra[0]?el.auth_obra[0].usuarios[0].user:''),
          apr_adm: (el.auth_adm[0]?el.auth_adm[0].usuarios[0].user:''),
          onAuth: () => authProduct(el.id),
          /*onDelete: () => mutate(el.id),*/
        }))}
        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        sortModel={[
          {
            field: 'numero',
            sort: 'asc',
          },
        ]}
        scrollbarSize
        onRowDoubleClick={(a) => IrAOP(a)}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
  function IrAOP(params) {
    navigate(`./${params.row.nombre}`);
  }
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function AuthRow(params) {
  const authRow = params.row.onAuth;
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
          }}>Aprobar
        </Button>
      </Box>
    ));
  return <PriceCheckIcon onClick={notify} />;
}