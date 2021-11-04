import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMethod, deleteMethod } from 'src/utils/api';

const columns = [

  {
    field: 'createdAt',
    headerName: 'Fecha',
    width: 120,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
  },

  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    width: 160,
    headerAlign: 'center',
    align: 'center',
  },

  {
    field: 'numero',
    headerName: 'Numero',
    width: 130,
    headerAlign: 'center',
    align: 'right',
  },

  {
    field: 'empresa',
    headerName: 'Razón Social',
    width: 160,
    headerAlign: 'center',
    align: 'center',
  },  
  {
    field: 'montoTotal',
    headerName: 'Monto',
    width: 130,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'moneda',
    headerName: '',
    width: 70,
    headerAlign: 'center',
    align: 'left',    
  },

  {
    field: 'RET_SUSS',
    headerName: 'SUSS',
    width: 120,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'RET_GAN',
    headerName: 'SUSS',
    width: 120,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'RET_IVA',
    headerName: 'IVA',
    width: 120,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),    
  },
  {
    field: 'estadoRET',
    headerName: 'Retenciones',
    width: 160,
    headerAlign: 'center',
    align: 'right',    
  },


  {
    field: 'apr_obra',
    headerName: 'Ap. Obra',
    width: 140,
    headerAlign: 'center',
    align: 'center',    
  },
  {
    field: 'apr_adm',
    headerName: 'Ap. ADM',
    width: 140,
    headerAlign: 'center',
    align: 'center',    
  },  
  {
    field: 'estadoOP',
    headerName: 'Estado',
    width: 140,
    headerAlign: 'center',
    align: 'center',    
  },
  {
    field: 'fondos',
    headerName: 'Fondos',
    width: 140,
    headerAlign: 'center',
    align: 'center',    
  },
  {
    field: 'archivada',
    headerName: 'Archivada',
    width: 140,
    headerAlign: 'center',
    align: 'center',    
  },
  {
    field: 'descripcion',
    headerName: 'Obs.',
    width: 140,
    headerAlign: 'center',
    align: 'center',    
  },
  

  /*
  {
    field: 'deleteIcon',
    headerName: '',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: DeleteRow,
  },*/
];
export function GrillaOP({ idSociety }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async (id) => {
      await deleteMethod(`OP/eliminar/${idSociety.id}`, id);
    },
    {
      onSuccess: async () => await queryClient.refetchQueries(['OP', idSociety.id]),
    }
  );

  const { data, isLoading, error } = useQuery(['OP', idSociety.id], () =>
    getMethod(`OP/listar/${idSociety.id}/todas/nulo`)
  );
  // console.log(data);

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
          montoTotal: el.montoTotal,
          moneda: el.moneda,
          RET_SUSS: el.RET_SUSS,
          RET_GAN: el.RET_GAN,
          RET_IVA: el.RET_IVA,
          estadoRET: el.estadoRET,
          fideicomiso: el.fideicomisos[0].nombre,
          estadoOP: el.estadoOP,
          fondos: el.fondos,
          archivada: el.archivada,
          descripcion: el.descripcion,
          createdAt: el.createdAt,          
          apr_obra: (el.auth_obra[0]?el.auth_obra[0].usuarios[0].user:''),
          apr_adm: (el.auth_adm[0]?el.auth_adm[0].usuarios[0].user:''),
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

function DeleteRow(params) {
  const deleteRow = params.row.onDelete;
  const notify = () =>
    toast(({ closeToast }) => (
      <Box>
        <Button
          sx={{ p: 1, m: 1 }}
          variant="contained"
          color="secondary"
          size="small"
          onClick={closeToast}
        >
          No quiero borrar
        </Button>
        <Button
          sx={{ p: 1, m: 1 }}
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            deleteRow();
            closeToast();
          }}
        >
          Sí quiero borrar
        </Button>
      </Box>
    ));
  return <Delete onClick={notify} />;
}
