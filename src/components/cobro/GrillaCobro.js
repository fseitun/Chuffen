import * as React from 'react';
import { useState, useContext } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Typography, Grid, Autocomplete, TextField } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';


const columns = (acceso, fondos_s, estados, conceptosCuota, setIsPromptOpen, setRowIdToDelete) => [ 
  
  {
    field: 'id',
    headerName: 'Id',
    width: 55,
    editable: false,
    headerAlign: 'center',
  },  

  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 140,
    editable: false,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
    new Date(value).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }),
  },
  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    width: 155,
    editable: false,
    headerAlign: 'center',
    align: 'left',
  }, 
  {
    field: 'contrato',
    headerName: 'contrato',
    width: 150,
    editable: false,
    headerAlign: 'center',
  },
  {
    field: 'fiduciante',
    headerName: 'fiduciante',
    width: 160,
    editable: false,
    headerAlign: 'center',
  },

  {
    field: 'concepto',
    headerName: 'concepto',
    width: 200,
    editable: acceso,
    headerAlign: 'left',
    renderEditCell: props => <ComboBox listItems={conceptosCuota} label={"Concepto"} props={props} />,
  },  
  {
    field: 'monto',
    preProcessEditCellProps: onlyNumbers,
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
    editable: 
    false,
    headerAlign: 'center',
  },

  {
    field: 'cambio',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'Cambio',
    width: 130,
    editable: acceso,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'fondos',
    headerName: 'Fondos',
    width: 130,
    editable: acceso,
    headerAlign: 'left',
    renderEditCell: props => <ComboBox listItems={fondos_s} label={"Fondos"} props={props} />,
  },  

  {
    field: 'archivadas',
    headerName: 'Estado',
    width: 130,
    editable: acceso,
    headerAlign: 'left',
    renderEditCell: props => <ComboBox listItems={estados} label={"Estado"} props={props} />,
  },  





  {
    field: 'deleteIcon',
    headerName: '',
    width: 50,
    hide: !acceso,
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


export function GrillaCobro({loggedUser, filtCont, filtFide, dataCobro, fondos_s, estados, conceptosPago, isLoading, error, refetch}) {
  
  const idSociety = useContext(SocietyContext);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var acceso = true;
  if(loggedUser?.['rol.cobros'] ==='vista'){acceso =false}

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idItem => await deleteMethod(`cobro/eliminar/${idSociety.id}`, { id: idItem }),
    {
      onMutate: async idItem => {
        await queryClient.cancelQueries(['cobro', idSociety]);
        const prevData = queryClient.getQueryData(['cobro', idSociety]);
        //const newData = prevData.filter(item => item.id !== idItem);
        //queryClient.setQueryData(['cuota', idSociety], newData);
        return prevData;
      },
      onError: (err, idItem, context) => queryClient.setQueryData(['cobro', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['cobro', idSociety])
        }
        refetch()        
      }
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`cobro/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        
        await queryClient.cancelQueries(['cobro', idSociety]);
        const prevData = queryClient.getQueryData(['cobro', idSociety]);
   
        /*const newData = [
          ...prevData.filter(item => item.id !== id),
          { ...prevData.find(item => item.id === id), [field]: value },
        ];*/
   
        // queryClient.setQueryData(['cuota', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cobro', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['cobro', idSociety])
        }
        refetch()        
      }
    }
  );

  //function filtrar(element, filtComp, filtFide, filtRS, onlyBlue){
  function filtrar(element, filtCont, filtFide){
    //if(onlyBlue && element.blue !== 1){
    //  return false;
    //}

    if(filtFide === -1 && filtCont === -1){
      return true;
    }

    if(filtFide > -1 && filtCont === -1){//fide
      
      if(element.fideicomisoId===filtFide){return true;}else{return false;}
    }
    if(filtFide === -1 && filtCont > -1){// contrato
      if(element.contratoId===filtCont){return true;}else{return false;}
    }
    if(filtFide > -1 && filtCont > -1){
      if(element.fideicomisoId===filtFide && element.contratoId===filtCont){return true;}else{return false;}
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
        <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >

          <Grid item md={4}>
            <Typography align="left" color="textPrimary" variant="h6">
                  
            </Typography>
          </Grid>                      
 

          <Grid item md={12}>
            <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
          <DataGrid
            rows={dataCobro?.filter(element =>filtrar(element, filtCont, filtFide)).map(item => ({  
              id: item?.id,
              fecha: item?.fecha,
              concepto: conceptosPago?.find(i => i.id === item?.concepto)?.descripcion,
              fideicomisoId: item?.fideicomisoId,
              fideicomiso: (item?.contrato?.fideicomisos[0]? item?.contrato?.fideicomisos[0]?.nombre:''),
              contrato: item?.contrato?.nombre, 
              fiduciante: item?.contrato?.personas[0]? item?.contrato?.personas[0]?.nombre:'' + item?.contrato?.empresas[0]? item?.contrato?.empresas[0]?.razonSocial:'', 
              monto: item?.monto,
              moneda: item?.moneda,
              // recivo:
              cambio: item?.cambio,
              fondos: fondos_s?.find(i => i.id === item?.fondos)?.descripcion,    
              archivadas: estados?.find(i => i.id === item?.archivadas)?.descripcion,
              createdAt: item?.createdAt,
              deleteId: item?.id,

              }))}OPs

            onCellEditCommit={modifyData}
            columns={columns(acceso,  fondos_s, estados, conceptosPago, setIsPromptOpen, setRowIdToDelete)}
            
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

          </Grid>
        </Grid>  
      </div>
    );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: [ 'id', 'tipo', 'letra','fideicomiso', 'empresa', 'cuit','numero', 'montoTotal', 'neto', 'porcentajeIVA', 'iva', 'percepcionesIVA', 'IIBB_CABA','IIBB_BSAS','no_gravado', 'moneda', 'es_ajuste'
 , 'createdAt','fechaIngreso', 'fechaVTO', 'OPnumero', 'estadoOP'] }} />
    </GridToolbarContainer>
  );
}

function onlyNumbers(data) {

  const regex = /^\d{0,3}(\.\d{0,2})?$/;
  const isValid = regex.test(data.props.value.toString());
  const error = !isValid;
  return { ...data.props, error };
}

function ComboBox({ listItems, label, props }) {
  const { id, api, field } = props;

  listItems = [
    ...listItems,
    {
      descripcion: '',
    },
  ];
  const [selectedRet, setSelectedRol] = useState({
    descripcion: '',
  });

  return (
    <Autocomplete
      value={selectedRet}
      onChange={async (event, newValue) => {        
        setSelectedRol(newValue);    
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      id="combo-box-demo"
      options={listItems}
      isOptionEqualToValue={(op, val) => op.descripcion === val.descripcion}
      getOptionLabel={option => option.descripcion}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label={label} />}
    />
  );
}