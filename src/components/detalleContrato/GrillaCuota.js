import * as React from 'react';
import { useState, useContext } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';
import { SocietyContext } from 'src/App';

const columns = (acceso, total, setIsPromptOpen, setRowIdToDelete) => [
  
  
  {
    field: 'createdAt',
    headerName: 'Fecha',
    width: 150,
    editable: false,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => mostrarFecha(value),
  },

  {
    field: 'concepto',
    headerName: 'concepto',
    width: 400,
    editable: acceso,
    headerAlign: 'left',
  },

  {
    field: 'cuota',
    headerName: '',
    width: 50,
    editable: true,
    headerAlign: 'center',
  },
  
  {
    field: 'monto',
    preProcessEditCellProps: onlyNumbers,
    headerName: 'Monto',
    width: 130,
    editable: acceso,
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
    field: 'CACBase',
    headerName: 'Cac Base',
    width: 50,
    editable: acceso,
    headerAlign: 'center',
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

export function GrillaCuota({ loggedUser, dataContrato, isLoading, error, refetch, moneda, totPagos, totAjuste}) {
  const idSociety = useContext(SocietyContext);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var acceso = true;
  if(loggedUser?.['rol.contrato'] ==='vista'){acceso =false}

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idItem => await deleteMethod(`OCdetalle/eliminar/${idSociety.id}`, { id: idItem }),
    {
      onMutate: async idItem => {
        await queryClient.cancelQueries(['OCdetalle', idSociety]);
        const prevData = queryClient.getQueryData(['OCdetalle', idSociety]);
        const newData = prevData.filter(item => item.id !== idItem);
        queryClient.setQueryData(['OCdetalle', idSociety], newData);
        return prevData;
      },
      onError: (err, idItem, context) => queryClient.setQueryData(['OCdetalle', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['OCdetalle', idSociety])
        }
        refetch()        
      }
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`OCdetalle/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['OCdetalle', idSociety]);
        const prevData = queryClient.getQueryData(['OCdetalle', idSociety]);
   
        const newData = [
          ...prevData.filter(item => item.id !== id),
          { ...prevData.find(item => item.id === id), [field]: value },
        ];
   
        queryClient.setQueryData(['OCdetalle', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['OCdetalle', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['OCdetalle', idSociety])
        }
        refetch()        
      }
    }
  );
  
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
              rows={dataContrato?.cuotas?.filter(item => item.moneda === moneda).map(item => ({
                id: item?.id,
                concepto: item?.concepto,
                cuota: item?.cuota,
                monto: item?.monto,
                moneda: item?.moneda,
                CACBase: item?.CACBase,
                createdAt: item?.createdAt,
                deleteId: item?.id,

              }))}
              onCellEditCommit={modifyData}
              columns={columns(acceso, moneda==='ARS'?dataContrato?.oc?.monto_ARS:dataContrato?.oc?.monto_USD,setIsPromptOpen, setRowIdToDelete)}
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

