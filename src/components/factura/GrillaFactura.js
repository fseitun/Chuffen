import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { Button } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { TiposContext, EstadosContext} from 'src/App';

const columns = (verColumnBlue, acceso, setIsPromptOpen, setRowIdToDelete) => [

  {
    field: 'id',
    headerName: 'Id',
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
    editable: false,
    renderCell: ({ value }) => value.descripcion, // a visualizar
    headerAlign: 'center',
  },
  {
    field: 'letra', // campo en grilla
    headerName: 'Letra',
    width: 55,
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    width: 160,
    editable: false,
    headerAlign: 'center',
    align: 'left',
  }, 
  {
    field: 'empresa',
    headerName: 'Razon Social',
    width: 170,
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'cuit',
    headerName: 'CUIT',
    hide: true,
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
    field: 'neto',
    headerName: 'Neto',
    width: 120,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'iva',
    headerName: 'IVA',
    width: 110,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'percepcionesIVA',
    headerName: 'Percepciones IVA',
    width: 110,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'IIBB_CABA',
    headerName: 'IIBB CABA',
    width: 110,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'IIBB_BSAS',
    headerName: 'IIBB BsAs',
    width: 110,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'no_gravado',
    headerName: 'No gravado',
    // type: 'boolean',
    width: 150,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'moneda',
    headerName: '',
    type: 'singleSelect',
    valueOptions: ['ARS', 'USD'],
    width: 50,
    editable: acceso,
    headerAlign: 'center',
  },

  {
    field: 'es_ajuste',
    headerName: 'Mayor Costo',
    type: 'boolean',
    width: 160,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'link',
    headerName: 'Link',
    width: 110,
    editable: acceso,
    headerAlign: 'center',
  },
  {
    field: 'ver',
    headerName: '',
    width: 20,
    sortable: false,
    editable: false,
    headerAlign: 'center',
    renderCell:  ({ row: { link } }) => (
      <a href={ link }  rel="noreferrer" target="_blank" >ver</a>)
  },

  {
    field: 'createdAt',
    headerName: 'Fecha C.',
    width: 155,
    type: 'date',
    editable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: fFechaC,
    
  },

  {
    field: 'fechaIngreso',
    headerName: 'Fecha Emisión',
    width: 175,
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
    filterable: false,
    editable: acceso,
    type: 'singleSelect',
    valueOptions: [0,1,2,3,4,5,6,7,10,14,15,20,21,28,30,40,50,60,70,80,90,100,120,150]
  },
  {
    field: 'fechaIngreso_mas_diasVTO',
    headerName: 'VTO',
    width: 155,
    type: 'date',
    sortable: false,
    filterable: false,
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

export function GrillaFactura({ filtComp, filtFide, filtRS, idSociety, loggedUser }) {
  
  const navigate = useNavigate();
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var estados = useContext(EstadosContext);
  var tipos = useContext(TiposContext);
  var blue = 0;
  var onlyBlue = false;
  var verColumnBlue = false;
  
  if(loggedUser?.['rol.factura'] ==='total'){blue= -1; verColumnBlue = true;}
  if(loggedUser?.['rol.descripcion'] ==='blue'){blue= -1; verColumnBlue = true; onlyBlue= true;}
  
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

  const { mutate: modifyData } = useMutation(
    
    async ({ field, id, value }) =>
      ( 
      await postMethod(`factura/modificar/${idSociety.id}`, {
        id,
        [field]: (field==='es_ajuste')? (value?1:0):value,
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
      navigate(`./${el?.OP?.id}/${el?.OP?.createdAt}/${el.empresaId}/${el?.OP?.numero}/${el.fideicomisoId}/${el?.fideicomisos[0]?.nombre}/${el?.OP?.estadoOP}/${el?.OP?.authADM}/${el?.OP.authOBRA}/${el?.OP?.confirmada}/${el?.OP?.blue}/OP Detalle`)

  );

  function filtrar(element, filtComp, filtFide, filtRS, onlyBlue){

    if(onlyBlue && element.blue !== 1){
      return false;
    }
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

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'id',
      sort: 'desc',
    },
  ]);

  const onSort = (newSort) => {

    if(newSort.length === 0){
      newSort.push(sortModel[0]);
      if(sortModel[0]?.sort === 'asc'){
        newSort[0].sort = 'desc';
      }else{
        newSort[0].sort = 'asc';
      }
    }
    setSortModel(newSort);    
  };

  const [pageSize, setPageSize] = useState(25);

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

    return (
      <div style={{ width: '100%' }}>
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
        <DataGrid
          rows={facturaInformation.filter(element =>filtrar(element, filtComp, filtFide, filtRS, onlyBlue)).map(factura => ({
           
            id: factura?.id,
            blue: factura?.blue,
            tipo: tipos?.find(tipo => tipo.id === factura.tipo)?.descripcion,
            letra: factura?.letra,
            fideicomisoId: factura?.fideicomisoId,
            fideicomiso: (factura?.fideicomisos? factura?.fideicomisos[0]?.nombre:''),
            cuit:(factura?.empresas? factura?.empresas[0]?.cuit:''),            
            empresa:(factura?.empresas? factura?.empresas[0]?.razonSocial:''),           
            numero: factura?.numero,
            montoTotal: parseInt(factura.tipo)===2? (-1 * factura.montoTotal):factura.montoTotal, //factura?.montoTotal,
            neto: parseInt(factura.tipo)===2? (-1 * factura.neto):factura.neto,
            iva: parseInt(factura.tipo)===2? (-1 * factura.iva):factura.iva,
            percepcionesIVA: parseInt(factura.tipo)===2? (-1 * factura.percepciones):factura.percepciones,
            IIBB_CABA: parseInt(factura.tipo)===2? (-1 * factura.IIBB_CABA):factura.IIBB_CABA,
            IIBB_BSAS: parseInt(factura.tipo)===2? (-1 * factura.IIBB_BSAS):factura.IIBB_BSAS,
            moneda: factura?.moneda,       
            es_ajuste: factura?.es_ajuste,
            no_gravado: factura?.no_gravados_exentos,
            fechaIngreso: factura?.fechaIngreso,
            diasVTO: factura?.diasVTO, 
            fechaVTO: factura?.fechaVTO,  
            createdAt: factura?.createdAt,
            OPnumero : (factura?.OP? factura?.OP?.numero:''),
            estadoOP: estados? estados[factura?.OP?.estadoOP]?.descripcion:'',
            link: factura?.link,
            ver: factura?.link,
            empresaId: factura?.empresaId,
            deleteId: factura?.id,
            onIrDetalle: () => irDetalle(factura),  

          }))}OPs
          onCellEditCommit={modifyData}
          columns={columns(verColumnBlue, acceso, setIsPromptOpen, setRowIdToDelete)}
          
          sortModel={sortModel}
          onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
       
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          pagination

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
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: [ 'id', 'tipo', 'letra','fideicomiso', 'empresa', 'cuit','numero', 'montoTotal', 'neto', 'iva', 'percepcionesIVA', 'IIBB_CABA','IIBB_BSAS','no_gravado', 'moneda', 'es_ajuste'
 , 'createdAt','fechaIngreso', 'fechaVTO', 'OPnumero', 'estadoOP'] }} />
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

function fFechaC(params) {
  let fecha = null; 
  if(params.row.createdAt){
    fecha = mostrarFecha(params.row.createdAt);
  }else{
    fecha = '';
  }

  return fecha;
}

function IrDetalleOP_1(params) {
  const sendRow = params.row.onIrDetalle;  
  const OPnumero = params.row.OPnumero;
  return <Button onClick={sendRow} >{OPnumero}  </Button>;
} 