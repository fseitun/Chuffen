
// import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@mui/material';
import { Kpi } from '../components/dashboard/kpi';
import { Barra } from '../components/dashboard/barra';
import { Dona } from '../components/dashboard/dona';
// import { SocietyContext } from 'src/App';

export function DashBoard({loggedUser}) {

  // const idSociety = useContext(SocietyContext);

  
  
  var propProveedor = {nombre: 'Proveedores', valor: 99, color: 'warning.main', avatar: 'LocalShipping'};
  var propFiduciantes = {nombre: 'Fiduciantes', valor: 99, color: 'warning.main', avatar: 'People'};
  var propFideicomisos = {nombre: 'Fideicomisos', valor: 99, color: 'primary.main', avatar: 'Business'};
  var propCAC = {nombre: 'CAC', valor: 99, color: 'error.main', avatar: 'TrendingUp'};

  const dataFidu = {
    datasets: [
      {
        data: [666, 111, 111],
        // qnt: [333, 343, 333],
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: ['Pago en termino', 'Mora + 2 meses', 'Mora < 2 meses']
  };

  var propFidu = {nombre: 'Estado de Fiduciantes', valor: 99, color: 'gray', avatar: 'LocalShipping', data: dataFidu};
  
  const data = {
    datasets: [
      {
        data: [333, 333, 333],
        // qnt: [333, 343, 333],
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: ['Para Autor. Adm', 'Para Autor. Obra', 'Para pagar']
  };

  var propOP = {nombre: 'Ordenes de Pagos', valor: 99, color: 'gray', avatar: 'LocalShipping', data: data};

  return (
    <>

    <Helmet>
        <title>Dashboard </title>
    </Helmet>

    <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
            <Grid item lg={3} sm={6} xl={3} xs={12}  >
              <Kpi props={propProveedor} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}  >
              <Kpi props={propFiduciantes} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}  >
              <Kpi props={propFideicomisos} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}  >
              <Kpi props={propCAC} />
            </Grid>

            <Grid item lg={6} sm={12} xl={6} xs={12}  >
              <Barra />
            </Grid>
            
            <Grid item lg={3} sm={6} xl={3} xs={12}  >
              <Dona props={propFidu} sx={{ height: '100%' }} />
            </Grid>
      
            <Grid item lg={3} sm={6} xl={3} xs={12}  >
              <Dona props={propOP} sx={{ height: '100%' }} />
            </Grid>
      
          </Grid>
        </Container>
      </Box>

    </>
  );
}
