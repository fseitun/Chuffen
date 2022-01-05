import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    width: 160,
    editable: false,
    headerAlign: 'center',
    align: 'center',
    /*renderCell: IrDetalleOP_1,*/
  }, 
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
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'montoTotal',
    headerName: 'Monto',
    width: 130,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'moneda',
    headerName: '',
    width: 50,
    editable: true,
    headerAlign: 'center',
  },

  {
    field: 'link',
    headerName: 'Link',
    width: 110,
    editable: true,
    headerAlign: 'center',
    /*renderCell:  ({ row: { link } }) => (
      <a href={ link }  rel="noreferrer" target="_blank" >{ link }</a>)*/
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
    field: 'fechaIngreso',
    headerName: 'Fecha',
    width: 155,
    type: 'date',
    editable: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: fFechaIngreso,
    
  },
  {
    field: 'diasVTO',
    headerName: 'Días VTO',
    width: 140,
    editable: true,
    type: 'singleSelect',
    valueOptions: [0,1,2,3,4,5,6,7,10,14,15,20,21,28,30,40,50,60,70,80,90,100,120,150]
  },
  {
    field: 'id',
    headerName: 'VTO',
    width: 155,
    type: 'date',
    editable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: fFechaVTO,
    
  },
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleteId } }) => (
      <DeleteIcon
        onClick={e => {

          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];

export function GrillaFactura({ idSociety }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  // console.log(rowIdToDelete);

  const {
    data: facturaInformation,
    isLoading,
    error,
  } = useQuery(['factura', idSociety], () => getMethod(`factura/listar/${idSociety.id}/todas/nada`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idFactura => await deleteMethod(`factura/eliminar/${idSociety.id}`, { id: idFactura }),
    {
      onMutate: async idFactura => {
        await queryClient.cancelQueries(['factura', idSociety]);
        const prevData = queryClient.getQueryData(['factura', idSociety]);
        const newData = prevData.filter(factura => factura.id !== idFactura);
        queryClient.setQueryData(['factura', idSociety], newData);
        return prevData;
      },
      onError: (err, idFactura, context) => queryClient.setQueryData(['factura', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['factura', idSociety]),
    }
  );
  // eliminate(1);

  const { mutate: modifyData } = useMutation(
    
    async ({ field, id, value }) =>
      ( 
     

      await postMethod(`factura/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      })
      ),
      
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['factura', idSociety]);
        const prevData = queryClient.getQueryData(['factura', idSociety]);

        const newData = [
          ...prevData.filter(factura => factura.id !== id),
          { ...prevData.find(factura => factura.id === id), [field]: value },
        ];  
        queryClient.setQueryData(['factura', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['factura', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['factura', idSociety]),
    }
  );

  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

    return (
      <div style={{ width: '100%' }}>
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
        <DataGrid
          rows={facturaInformation.map(factura => ({
            id: factura.id,
            fideicomiso: (factura?.fideicomisos? factura?.fideicomisos[0]?.nombre:''),
            empresaId: factura.empresaId,
            empresa:(factura?.empresas? factura?.empresas[0]?.razonSocial:''),
            numero: factura.numero,
            link: factura.link,
            link2: factura.link,
            montoTotal: factura.montoTotal,
            moneda: factura.moneda,
            fechaIngreso: factura.fechaIngreso,
            diasVTO: factura.diasVTO, 
            fechaVTO: factura.fechaVTO, 
   
            deleteId: factura.id,
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

function fFechaVTO(params) {
  let f = new Date(params.row.fechaIngreso)
  let d =0;
  if(params.row.diasVTO){ 
    if(params.row.diasVTO > 0 ){
       d =params.row.diasVTO;
    }
  }
  f.setDate(f.getDate() + d);
  let fechaVTO = mostrarFecha(f);


  return fechaVTO;
}

function fFechaIngreso(params) {
  let fechaIngreso = null; 
  if(params.row.fechaIngreso){
    fechaIngreso = mostrarFecha(params.row.fechaIngreso);
  }else{
    fechaIngreso = '';
  }

  return fechaIngreso;
}