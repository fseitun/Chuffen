import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Button} from '@mui/material';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { useNavigate } from 'react-router-dom';
import { getMethod, postMethod} from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'createdAt',
    headerName: 'Fecha',
    editable: false,
    width: 120,
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
    field: 'formaPago',
    headerName: 'Forma Pago',
    width: 160,
    editable: true,
  },
  {
    field: 'PriceCheckIcon',
    headerName: 'Autorizar',
    width: 160,
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


// por ahora se inicializa en el login
var formaPagos =[];
if(localStorage.getItem("formaPagos")){
  formaPagos = localStorage.getItem("formaPagos").split(",")
}else{  
  formaPagos[0] ="Otra";
}

export function GrillaOpAuth({ idSociety,  loggedUser, tipo }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  // console.log(rowIdToDelete);
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
    async id =>
      await postMethod(`autorizacion/agregar/${idSociety?.id}`, {

        opid : id,
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
      navigate(`./${el.id}/${el.createdAt}/${el.empresaId}/${el.numero}/${el.fideicomisos[0]?.nombre}/${el.estadoOP}/${el.confirmada}/${el.blue}`)

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
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(OP => OP.id !== id),
          { ...prevData.find(OP => OP.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['OP' + tipo, idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['OP' + tipo, idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['OP' + tipo, idSociety]),
    }
  );

  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
      <div style={{ width: '100%' }}>
        <Prompt message="¿Autorizar fila?" action={() => authFila(rowIdToDelete)} />
        <DataGrid
          rows={opInformation.map(OP => ({
            id: OP.id,        
            numero: OP.numero,
            empresa: OP.empresas[0].razonSocial,
            monto: OP.monto,
            moneda: OP.moneda,   
            formaPago: OP.formaPago,      
            fideicomiso: OP.fideicomisos[0].nombre,          
            apr_obra: (OP.auth_obra[0]?OP.auth_obra[0].usuarios[0].user:''),
            apr_adm: (OP.auth_adm[0]?OP.auth_adm[0].usuarios[0].user:''),
            createdAt: OP.createdAt,
            authId: OP.id,
            onIrDetalle: () => irDetalle(OP),   
          }))}
          onCellEditCommit={modifyData}
          columns={columns(setIsPromptOpen, setRowIdToDelete)}
          pageSize={25}
          disableSelectionOnClick
          autoHeight
          scrollbarSize
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

