import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { Button } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';
import { useNavigate } from 'react-router-dom';

const columns = (verColumnBlue, acceso, setIsPromptOpen, setRowIdToDelete) => [

  {
    field: 'id',
    headerName: '',
    width: 55,
    editable: false,
    headerAlign: 'center',
  },
  
  {
    field: 'blue',
    headerName: 'Blue',
    hide: !verColumnBlue,
    width: 55,
    editable: false,
    headerAlign: 'center',
    renderCell: ({ value }) => value===0?'' :<Avatar sx={{ bgcolor: '#3944BC' }} >B</Avatar>,
  },
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
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    width: 160,
    editable: false,
    headerAlign: 'center',
    align: 'left',
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
    editable: acceso,
    headerAlign: 'center',
  },
  {
    field: 'link',
    headerName: 'Link',
    width: 110,
    editable: acceso,
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
    editable: acceso,
    headerAlign: 'center',
    align: 'center',
    renderCell: fFechaIngreso,
    
  },
  {
    field: 'diasVTO',
    headerName: 'Días VTO',
    width: 140,
    editable: acceso,
    type: 'singleSelect',
    valueOptions: [0,1,2,3,4,5,6,7,10,14,15,20,21,28,30,40,50,60,70,80,90,100,120,150]
  },
  {
    field: 'fechaIngreso_mas_diasVTO',
    headerName: 'VTO',
    width: 155,
    type: 'date',
    editable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: fFechaVTO,
    
  },
  {
    field: 'OPnumero',
    headerName: 'OP',
    width: 100,
    editable: false,
    headerAlign: 'center',
    renderCell: IrDetalleOP_1,
  },
  {
    field: 'estadoOP',
    headerName: 'Estado OP',
    width: 160,
    editable: false,
    headerAlign: 'center',
  },

  {
    field: 'deleteIcon',
    headerName: ' ',
    hide: !acceso,
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleteId, OPnumero} }) => (OPnumero>0? '':
      <DeleteIcon
        onClick={e => {

          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];

// por ahora se inicializa en el login
var estados = JSON.parse(localStorage.getItem("estados"));

export function GrillaDetalleFide({ filtComp, filtFide, filtRS, idSociety, loggedUser }) {
  
  const navigate = useNavigate();
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  
  var tipos = JSON.parse(localStorage.getItem("tipos"));
  var blue = 0;
  var verColumnBlue = false;
  if(loggedUser?.['rol.factura'] ==='total'){blue= -1; verColumnBlue = true;}
  var acceso = true;
  if(loggedUser?.['rol.factura'] ==='vista'){acceso =false}


  const {
    data: facturaInformation,
    isLoading,
    error,
  } = useQuery(['factura', idSociety], () => getMethod(`factura/listar/${idSociety.id}/todas/nada/${blue}`));

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

  const { mutate: irDetalle } = useMutation(
    async el =>    
      navigate(`./${el?.OP?.id}/${el?.OP?.createdAt}/${el.empresaId}/${el?.OP?.numero}/${el.fideicomisos?.nombre}/${el?.OP.estadoOP}/${el?.OP?.authADM}/${el?.OP.authOBRA}/${el?.OP?.confirmada}/${el?.OPs?.blue}/OP Detalle`)

  );

  function filtrar(element, filtComp, filtFide, filtRS){

    if(filtFide === -1 && filtRS === -1 && filtComp === -1){
      return true;
    }

    if(filtFide > -1 && filtRS === -1 && filtComp === -1){//fide
      if(element.fideicomisoId===filtFide){return true;}else{return false;}
    }
    if(filtFide === -1 && filtRS > -1 && filtComp === -1){// proveedor

      if(element.empresaId===filtRS){return true;}else{return false;}
    }
    if(filtFide === -1 && filtRS === -1 && filtComp > -1){//estado
      if(element.tipo===filtComp){return true;}else{return false;}
    }

    if(filtFide > -1 && filtRS > -1 && filtComp === -1){
      if(element.fideicomisoId===filtFide && element.empresaId===filtRS){return true;}else{return false;}
    }
    if(filtFide > -1 && filtRS === -1 && filtComp > -1){
      if(element.fideicomisoId===filtFide && element.tipo===filtComp){return true;}else{return false;}
    }
    if(filtFide === -1 && filtRS > -1 && filtComp > -1){
      if(element.empresaId===filtRS && element.tipo===filtComp){return true;}else{return false;}
    }
    if(filtFide > -1 && filtRS > -1 && filtComp > -1){
      if(element.fideicomisoId===filtFide && element.empresaId===filtRS && element.tipo===filtComp){return true;}else{return false;}
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
        <DataGrid
          rows={facturaInformation.filter(element =>filtrar(element, filtComp, filtFide, filtRS)).map(factura => ({
            id: factura?.id,
            fideicomiso: (factura?.fideicomisos? factura?.fideicomisos[0]?.nombre:''),
            empresaId: factura?.empresaId,
            empresa:(factura?.empresas? factura?.empresas[0]?.razonSocial:''),
            blue: factura?.blue,
            numero: factura?.numero,
            // tipo: factura?.tipo,
            tipo: {
              id: factura.tipo,
              descripcion: tipos?.find(tipo => tipo.id === factura.tipo)?.descripcion,
            },
            link: factura?.link,
            link2: factura?.link,
            montoTotal: parseInt(factura.tipo)===2? (-1 * factura.montoTotal):factura.montoTotal, //factura?.montoTotal,
            moneda: factura?.moneda,
            fechaIngreso: factura?.fechaIngreso,
            diasVTO: factura?.diasVTO, 
            fechaVTO: factura?.fechaVTO,  
            OPnumero : (factura?.OP? factura?.OP?.numero:''),
            estadoOP:(factura?.OP? estados[factura?.OP?.estado]?.descripcion:''),
            deleteId: factura?.id,
            onIrDetalle: () => irDetalle(factura),  

          }))}OPs
          onCellEditCommit={modifyData}
          columns={columns(verColumnBlue, acceso, setIsPromptOpen, setRowIdToDelete)}
          /*pageSize={25}*/
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

function IrDetalleOP_1(params) {
  const sendRow = params.row.onIrDetalle;  
  const OPnumero = params.row.OPnumero;
  return <Button onClick={sendRow} >{OPnumero}  </Button>;
} 