import * as React from 'react';
import { Typography, Grid, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { mostrarFecha } from 'src/utils/utils';
import { NavLink as RouterLink } from 'react-router-dom';


const columns = (verLink) => [  

  {
    field: 'numero',
    headerName: 'Orden de Pago',
    width: 200,
    editable: false,
    headerAlign: 'center',
    align: 'center'
  },
  
  {
    field: 'avance',
    headerName: 'Avance',
    width: 130,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'ajuste',
    headerName: 'Mayores Costos',
    width: 190,
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
    field: 'estado',
    headerName: 'Estado',
    width: 170,
    editable: false,
    headerAlign: 'center',
    align: 'center',
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
    field: 'id',
    headerName: '',
    hide: !verLink,
    width: 70,
    editable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: IrDetalleOP_0
  },

];



export function GrillaPagos({ OCId, loggedUser, formOC, isLoading, error, moneda, totPagos, totAjuste}) {
  // const idSociety = useContext(SocietyContext);
  const detalle = formOC?.pago;
  var estados = JSON.parse(localStorage.getItem("estados"));

  var verLink = false;
  if(loggedUser?.['rol.op'] !=='no'){verLink = true;} 


  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

    // console.log(333, formOC?.oc?.fideicomisos[0]?.nombre, formOC?.oc?.empresaId);
    return (
      <div style={{ width: '100%' }}>
        <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >

          <Grid item md={4}>
            <Typography align="left" color="textPrimary" variant="h6">
                  
            </Typography>
          </Grid>                      
          <Grid item md={3}>
            <Typography align="right" color="textWarning" variant="h5">
                  Avance:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; { Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(totPagos-totAjuste)) + " " + moneda }
                  
            </Typography>           
          </Grid>
          <Grid item md={3}>
            <Typography align="right" color="textPrimary" variant="h5">
                    Mayores Costos:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; { Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(totAjuste)) + " " + moneda }
            </Typography>
          </Grid>

          <Grid item md={12}>
           
            <DataGrid
              rows={detalle.filter(item => item.moneda === moneda).map(item => ({
                id: item.id,
                numero: item.numero,
                avance: (item.monto - item.ajuste),
                moneda: item.moneda,
                ajuste: item.ajuste,
                estado: estados?.find(estado => estado.id === item.estadoOP)?.descripcion,
                createdAt: item.createdAt,

                estadoOP: item.estadoOP,
                confirmada: item.confirmada,
                blue: item.blue,
                authADM: item.authADM,
                authOBRA: item.authOBRA,
                rol: loggedUser?.['rol.descripcion'], 
                empresaId: formOC?.oc?.empresaId,
                fideicomiso: formOC?.oc?.fideicomisos[0]?.nombre,

              }))}
              /* onCellEditCommit={modifyData}*/
              columns={columns(verLink)}
              pageSize={25}
              disableSelectionOnClick
              autoHeight
              
            />
          </Grid>
        </Grid>  
      </div>
    );
}

function IrDetalleOP_0(params) {


  let path = `../../op/${params.row.id}/${params.row.createdAt}/${params.row.empresaId}/${params.row.numero}/${params.row.fideicomiso}/${params.row.estadoOP}/${params.row.authADM}/${params.row.authOBRA}/${params.row.confirmada}/${params.row.blue}/OP Detalle`;
  
  if(params.row.blue === 0 || params.row.rol === 'manager'){
    return <Button
            component={RouterLink}
            sx={{color: 'primary.main',}}
            to={path}
          >
            <span>ver</span>
          </Button>
  }else{
    return ""
  }

} 