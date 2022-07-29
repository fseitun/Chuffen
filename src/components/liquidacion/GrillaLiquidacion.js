import * as React from 'react';
import { useState, useContext } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Typography, Grid, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { saveAs } from "file-saver";

const columns = (modo, acceso, saveFile, setIsPromptOpen, setRowIdToDelete) => [
  
    
  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    hide: (modo==='contrato'),
    width: 170,
    editable: false,
    headerAlign: 'Fide',

  },
    
  {
    field: 'contrato',
    headerName: 'Adhesión',
    hide: (modo==='contrato'),
    width: 170,
    editable: false,
    headerAlign: 'center',

  },
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
    field: 'ultCuotaARS',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'Ultima Cuota',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'deudaARS',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'Deuda',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  {
    field: 'punitorioARS',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'Punitorios',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },

  /*
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
  },*/

  {
    field: 'link',
    headerName: 'Link',
    width: 70,
    editable: false,
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

export function GrillaLiquidacion({ modo, loggedUser, fideicomisos, contratos, filtFide, filtContrato, filtPeriodo, liquidaciones, isLoading, error, refetch}) {
  
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

  function filtrar(element, filtFide, filtContrato, filtPeriodo){

    if(filtFide === -1 && filtContrato === -1 && filtPeriodo === -1){
      return true;
    }
    if(filtFide > -1 && filtContrato === -1 && filtPeriodo === -1){//fide
      if(element.fideicomisoId===filtFide){return true;}else{return false;}
    }    
    if(filtFide === -1 && filtContrato > -1 && filtPeriodo === -1){// Contrato
      if(element.contratoId===filtContrato){return true;}else{return false;}
    }
    if(filtFide === -1 && filtContrato === -1 && filtPeriodo > -1){//periodo
      if(element.periodo===filtPeriodo){return true;}else{return false;}
    }
    if(filtFide > -1 && filtContrato > -1 && filtPeriodo === -1){
      if(element.fideicomisoId===filtFide && element.contratoId===filtContrato){return true;}else{return false;}
    }
    if(filtFide > -1 && filtContrato === -1 && filtPeriodo > -1){
      if(element.fideicomisoId===filtFide && element.periodo===filtPeriodo){return true;}else{return false;}
    }
    if(filtFide === -1 && filtContrato > -1 && filtPeriodo > -1){
      if(element.contratoId===filtContrato && element.periodo===filtPeriodo){return true;}else{return false;}
    }
    if(filtFide > -1 && filtContrato > -1 && filtPeriodo > -1){
      if(element.fideicomisoId===filtFide && element.contratoId===filtContrato && element.periodo===filtPeriodo){return true;}else{return false;}
    }  

  }

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
            <Typography align="left" color="textPrimary" variant="h6"></Typography>
          </Grid>

          <Grid item md={12}>

            <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
            
            <DataGrid

              rows={liquidaciones?.filter(element =>filtrar(element, filtFide, filtContrato, filtPeriodo)).map(item => ({
                id: item?.id,
                
                contrato: contratos?.find(i => i.id === item?.contratoId)?.nombre,
                fideicomiso: fideicomisos?.find(i => i.id === item?.fideicomisoId)?.nombre,
                fecha: item?.fecha,
                periodo: item?.periodo,
                saldoARS: item?.saldoARS,
                saldoUSD: item?.saldoUSD,
                ultCuotaARS: item?.ultCuotaARS,
                ultCuotaUSD: item?.ultCuotaUSD,
                deudaARS: item?.deudaARS,
                deudaUSD: item?.deudaUSD,
                punitorioARS: item?.punitorioARS,
                punitorioUSD: item?.punitorioUSD,
                link: item?.link,  
                deleteId: item?.id,
              }))}
              
              columns={columns(modo, acceso, saveFile, setIsPromptOpen, setRowIdToDelete)}
              sortModel={sortModel}
              onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
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