import * as React from 'react';
import { useState, useContext } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Typography, Grid, Autocomplete, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';


const columns = (acceso, conceptosCuota, setIsPromptOpen, setRowIdToDelete) => [
  
  
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
    field: 'cuota',
    headerName: 'Cuota',
    width: 120,
    editable: acceso,
    headerAlign: 'center',
  },

  {
    field: 'concepto',
    headerName: 'concepto',
    width: 400,
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
    editable: false,
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

export function GrillaCuota({ loggedUser, conceptosCuota, dataContrato, isLoading, error, refetch, moneda}) {
  const idSociety = useContext(SocietyContext);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();


  var acceso = true;
  if(loggedUser?.['rol.contrato'] ==='vista'){acceso =false}

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idItem => await deleteMethod(`cuota/eliminar/${idSociety.id}`, { id: idItem }),
    {
      onMutate: async idItem => {
        await queryClient.cancelQueries(['cuota', idSociety]);
        const prevData = queryClient.getQueryData(['cuota', idSociety]);
        //const newData = prevData.filter(item => item.id !== idItem);
        //queryClient.setQueryData(['cuota', idSociety], newData);
        return prevData;
      },
      onError: (err, idItem, context) => queryClient.setQueryData(['cuota', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['cuota', idSociety])
        }
        refetch()        
      }
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`cuota/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        
        await queryClient.cancelQueries(['cuota', idSociety]);
        const prevData = queryClient.getQueryData(['cuota', idSociety]);
   
        /*const newData = [
          ...prevData.filter(item => item.id !== id),
          { ...prevData.find(item => item.id === id), [field]: value },
        ];*/
   
        // queryClient.setQueryData(['cuota', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cuota', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['cuota', idSociety])
        }
        refetch()        
      }
    }
  );

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
              rows={dataContrato?.cuotas?.filter(item => item.moneda === moneda).map(item => ({
                id: item?.id,
                fecha: item?.fecha,
                concepto: conceptosCuota?.find(i => i.id === item?.concepto)?.descripcion,
                cuota: item?.cuota,
                monto: item?.monto,
                moneda: item?.moneda,
                CACBase: item?.CACBase,
                createdAt: item?.createdAt,
                deleteId: item?.id,

              }))}
              onCellEditCommit={modifyData}
              columns={columns(acceso, conceptosCuota, setIsPromptOpen, setRowIdToDelete)}

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