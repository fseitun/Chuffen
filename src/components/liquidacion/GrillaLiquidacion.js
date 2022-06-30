import * as React from 'react';
import { useState, useContext } from 'react';
// import { useQuery } from 'react-query';
import { useQueryClient, useMutation } from 'react-query';
import { Typography, Grid, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { saveAs } from "file-saver";

const columns = (acceso, saveFile, setIsPromptOpen, setRowIdToDelete) => [
  
  
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
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
    field: 'saldoARS',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'Saldo ARS',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'saldoUSD',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'Saldo USD',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'link',
    headerName: 'Link',
    width: 70,
    editable: false,
    // hide: (!verColumnBlue && colVisibles?.find(i => i.c === 'blue').h),    
    headerAlign: 'center',
    renderCell: ({ value }) => value===0?'' :
                        <IconButton color="inherit" onClick={() => {saveFile(value)}} >
                          <DownloadForOfflineIcon color="primary" />
                        </IconButton>,
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

export function GrillaLiquidacion({ loggedUser, liquidaciones, isLoading, error, refetch}) {
  
  const idSociety = useContext(SocietyContext);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var acceso = true;
  if(loggedUser?.['rol.contrato'] ==='vista'){acceso =false}

  const queryClient = useQueryClient();

  const saveFile = (url) => {
    let nombre = url.split("/liquidaciones/")[1];  

    saveAs(
      url, nombre + ".pdf"
    );
  };

  const { mutate: eliminate } = useMutation(
    async Liquidacion => await deleteMethod(`liquidacion/eliminar/${idSociety.id}`, { id: Liquidacion }),
    {
      onMutate: async Liquidacion => {
        await queryClient.cancelQueries(['liquidacion', idSociety]);
        const prevData = queryClient.getQueryData(['liquidacion', idSociety]);
        //const newData = prevData.filter(item => item.id !== idItem);
        //queryClient.setQueryData(['liquidacion', idSociety], newData);
        return prevData;
      },
      onError: (err, idItem, context) => queryClient.setQueryData(['liquidacion', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['liquidacion', idSociety])
        }
        refetch()        
      }
    }
  );

  /*
  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`liquidacion/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        
        await queryClient.cancelQueries(['liquidacion', idSociety]);
        const prevData = queryClient.getQueryData(['liquidacion', idSociety]);
   
        //const newData = [
        //  ...prevData.filter(item => item.id !== id),
        //  { ...prevData.find(item => item.id === id), [field]: value },
        //];
   
        // queryClient.setQueryData(['liquidacion', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['liquidacion', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['liquidacion', idSociety])
        }
        refetch()        
      }
    }
  );*/

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'fecha',
      sort: 'asc',
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
              rows={liquidaciones?.map(item => ({
                id: item?.id,
                fecha: item?.fecha,
                saldoARS: item?.saldoARS,
                saldoUSD: item?.saldoUSD,
                link: item?.link,  
                deleteId: item?.id,

              }))}
              // onCellEditCommit={modifyData}
              columns={columns(acceso, saveFile, setIsPromptOpen, setRowIdToDelete)}

              sortModel={sortModel}
              onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
              /*pageSize={25}*/
              disableSelectionOnClick
              autoHeight              
            />
            

          </Grid>
        </Grid>  
      </div>
    );
}

function onlyNumbers(data) {

  const regex = /^\d{0,3}(\.\d{0,2})?$/;
  const isValid = regex.test(data.props.value.toString());
  const error = !isValid;
  return { ...data.props, error };
}

/*
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
}*/