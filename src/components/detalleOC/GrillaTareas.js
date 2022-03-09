import * as React from 'react';
import { useState, useContext } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarFecha } from 'src/utils/utils';
import { SocietyContext } from 'src/App';
import clsx from "clsx";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: 26,
        borderRadius: 2
      },
      value: {
        position: "absolute",
        lineHeight: "24px",
        width: "100%",
        display: "flex",
        justifyContent: "center"
      },
      bar: {
        height: "100%",
        "&.low": {
          backgroundColor: "#f44336"
        },
        "&.medium": {
          backgroundColor: "#efbb5aa3"
        },
        "&.high": {
          backgroundColor: "#088208a3"
        }
      }
    }),
  { defaultTheme }
);

const ProgressBar = React.memo(function ProgressBar(props) {
  const { value } = props;
  const valueInPercent = value * 100;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        className={classes.value}
      >{`${valueInPercent.toLocaleString()} %`}</div>
      <div
        className={clsx(classes.bar, {
          low: valueInPercent < 30,
          medium: valueInPercent >= 30 && valueInPercent <= 70,
          high: valueInPercent > 70
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </div>
  );
});

const columns = (acceso, total, setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'numero',
    headerName: '',
    width: 50,
    editable: true,
    headerAlign: 'center',
  },


  {
    field: 'descripcion',
    headerName: 'Tarea',
    width: 400,
    editable: acceso,
    headerAlign: 'left',
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
    field: 'porcentaje',
    preProcessEditCellProps: onlyNumbers,
    headerName: '%',
    width: 65,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1 }).format(Math.round(value * 1000 / total)/10) + "%",
  },
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

export function GrillaTareas({ OCId, loggedUser, formOC, refetch, moneda, totPagos}) {
  const idSociety = useContext(SocietyContext);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var acceso = true;
  if(loggedUser?.['rol.factura'] ==='vista'){acceso =false}

  
  const {
    data: detalle,
    isLoading,
    error,
  } = useQuery(['OCdetalle', idSociety], () => getMethod(`OCdetalle/listar/${idSociety.id}/${OCId}`));

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
    var totTareas = (moneda==='ARS'?formOC?.oc?.monto_ARS:formOC?.oc?.monto_USD);
    var avance = totPagos / totTareas;
    if(!avance){avance=0.0};

    return (
      <div style={{ width: '100%' }}>
        <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >

          <Grid item md={5}>
            <Typography align="left" color="textPrimary" variant="h6">
                  
            </Typography>
          </Grid>                      
          <Grid item md={3}>
            <Typography align="right" color="textPrimary" variant="h5">
                  Total Contrato:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; { Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(totTareas)) + " " + moneda }
                  
            </Typography>
          </Grid>
          <Grid item md={2}>
          <ProgressBar value={avance} />
          </Grid>

          <Grid item md={12}>
            <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
            <DataGrid
              rows={detalle.filter(item => item.moneda === moneda).map(item => ({
                id: item.id,
                OCId: item.OCId,
                numero: item.numero,
                avance: (item.numero/100),
                descripcion: item.descripcion,
                monto: item.monto,
                porcentaje: item.monto,
                moneda: item.moneda,
                createdAt: item.createdAt,
                deleteId: item.id,

              }))}
              onCellEditCommit={modifyData}
              columns={columns(acceso, moneda==='ARS'?formOC?.oc?.monto_ARS:formOC?.oc?.monto_USD,setIsPromptOpen, setRowIdToDelete)}
              pageSize={25}
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

