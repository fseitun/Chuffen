import * as React from 'react';
import { Typography, Grid, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { mostrarFecha } from 'src/utils/utils';
import { NavLink as RouterLink } from 'react-router-dom';
import { ProgressBar } from 'src/components/detalleOC/ProgressBar';
import { yearMonthDayString } from 'src/utils/utils';
import { useContext } from 'react';
import { EstadosContext} from 'src/App';



const columns = (verLink, moneda) => [  

  {
    field: 'numero',
    headerName: 'OP',
    width: 95,
    editable: false,
    headerAlign: 'center',
    align: 'center'
  },
  
  {
    field: 'avanceARS',
    headerName: 'Monto Contrato',
    width: 180,
    hide: (moneda==='USD'),
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'avanceUSD',
    headerName: 'Monto Contrato',
    width: 180,
    hide: (moneda==='ARS'),
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'ajuste',
    headerName: 'Mayor Costo',
    width: 180,
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'montoOP',
    headerName: 'Monto OP',
    width: 140,
    hide: (moneda==='ARS'),
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
    field: 'cotizacion_usd',
    headerName: 'Cambio',
    width: 130,
    hide: (moneda==='ARS'),
    editable: false,
    headerAlign: 'center',
    align: 'right',

    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },


  {
    field: 'estado',
    headerName: 'Estado',
    width: 170,
    hide: true, //(moneda==='USD'),
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
    field: 'CACop',
    headerName: 'CAC',
    width: 110,  
    hide: (moneda==='USD'),
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'teorico',
    headerName: 'Costo Teórico',
    width: 170,  
    editable: false,
    hide: (moneda==='USD'),
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(Math.trunc(value*100)/100)),
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


export function GrillaPagos({ OCId, loggedUser, formOC, isLoading, error, moneda, totPagos, totAjuste, CACs}) {
  // const idSociety = useContext(SocietyContext);
  const detalle = formOC?.pago;
  var estados = useContext(EstadosContext);

  var verLink = false;
  if(loggedUser?.['rol.op'] !=='no'){verLink = true;} 

  function buscarCAC(fechaOP, CACtipo){
          
    let rta = 0.0;
    if(CACtipo==="Construción"){
      rta = CACs?.find(cac => cac.fecha.slice(0, 7) === fechaOP?.slice(0, 7))?.definitivo;
    }else if(CACtipo==="Materiales"){
      rta = CACs?.find(cac => cac.fecha.slice(0, 7) === fechaOP?.slice(0, 7))?.materiales;
    }else if(CACtipo==="Mano de Obra"){
      rta = CACs?.find(cac => cac.fecha.slice(0, 7) === fechaOP?.slice(0, 7))?.manodeobra;
    }

    if(!rta){// si no encuenta una CAC definitivo, busco el mes anterior
      let d = new Date(fechaOP.slice(0, 10) + " " + fechaOP.slice(12, 5));
      
      d.setMonth(d.getMonth() - 1)

      if(CACtipo==="Construción"){
        rta = CACs?.find(cac => cac.fecha.slice(0, 7) === yearMonthDayString(d).slice(0, 7))?.definitivo;
      }else if(CACtipo==="Materiales"){
        rta = CACs?.find(cac => cac.fecha.slice(0, 7) === yearMonthDayString(d).slice(0, 7))?.materiales;
      }else if(CACtipo==="Mano de Obra"){
        rta = CACs?.find(cac => cac.fecha.slice(0, 7) === yearMonthDayString(d).slice(0, 7))?.manodeobra;
      }

      if(!rta){// si no encuenta una CAC definitivo, busco el mes anterior
        d.setMonth(d.getMonth() - 1)        

        if(CACtipo==="Construción"){
          rta = CACs?.find(cac => cac.fecha.slice(0, 7) === yearMonthDayString(d).slice(0, 7))?.definitivo;
        }else if(CACtipo==="Materiales"){
          rta = CACs?.find(cac => cac.fecha.slice(0, 7) === yearMonthDayString(d).slice(0, 7))?.materiales;
        }else if(CACtipo==="Mano de Obra"){
          rta = CACs?.find(cac => cac.fecha.slice(0, 7) === yearMonthDayString(d).slice(0, 7))?.manodeobra;
        }
      }
    }
    return rta;
  }

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    var totTareas = (moneda==='ARS'?formOC?.oc?.monto_ARS:formOC?.oc?.monto_USD);
    var avance = (totAjuste) / totTareas;
    if(!avance){avance=0.0};
 
    return (
      <div style={{ width: '100%' }}>
        <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >

          <Grid item md={4}>
            <Typography align="left" color="textPrimary" variant="h6">
                  
            </Typography>
          </Grid>                      
          <Grid item md={3}>
            <Typography align="right" color="textWarning" variant="h5">
                Monto Contrato:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; { Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(totPagos-totAjuste)) + " " + moneda }
                  
            </Typography>           
          </Grid>
          <Grid item md={3}>
            <Typography align="right" color="textPrimary" variant="h5">
                Mayores Costos:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; { Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(totAjuste)) + " " + moneda }
            </Typography>
          </Grid>
          <Grid item md={2}>
            <ProgressBar value={avance} />
          </Grid>

          <Grid item md={12}>
           
            <DataGrid
              rows={detalle.filter(item => item.OC_moneda === moneda).map(item => ({
                id: item.id,
                numero: item.numero,
                montoOP: (item.monto - item.ajuste),
                cotizacion_usd: item.cotizacion_usd,
                avanceARS: (item.monto - item.ajuste),
                avanceUSD: item.moneda==='ARS'? ((item.monto - item.ajuste)/item.cotizacion_usd): (item.monto - item.ajuste),
                moneda: item.moneda,
                ajuste: item.ajuste,
                estado: estados?.find(estado => estado.id === item.estadoOP)?.descripcion,
                createdAt: item.createdAt,
                CACop: buscarCAC(item?.createdAt,formOC.oc?.CACtipo),
                teorico: (1 - (formOC?.oc?.CACbase / buscarCAC(item?.createdAt, formOC.oc?.CACtipo))) * (item.monto - item.ajuste),
                confirmada: item.confirmada,
                blue: item.blue,
                authADM: item.authADM,
                authOBRA: item.authOBRA,
                rol: loggedUser?.['rol.descripcion'], 
                empresaId: formOC?.oc?.empresaId,
                fideicomiso: formOC?.oc?.fideicomisos[0]?.nombre,

              }))}
              /* onCellEditCommit={modifyData}*/
              columns={columns(verLink, moneda)}
              /*pageSize={25}*/
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