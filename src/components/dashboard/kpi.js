import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import MoneyIcon from '@mui/icons-material/Money';
import {
  //AttachMoney,
  TrendingUp,
  LocalShipping,
  People,
  //MenuBook,
  //Apartment,
  /*Assignment,*/
  //ListAlt,
  //CreditCard,
  //Construction,
  Business,
  //PeopleAlt,
  /*MoneyIcon
  MonetizationOn,
  Business,
  PeopleAlt,
  Schema,
  AssignmentTurnedIn,*/
} from '@mui/icons-material';

export const Kpi = ({props}) => (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            {props.nombre}
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {props.valor}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: props.color,
              height: 56,
              width: 56
            }}
          >
            {props.avatar==='LocalShipping' ? <LocalShipping />:props.avatar==='Business' ? <Business />:props.avatar==='TrendingUp' ? <TrendingUp />:<People /> }
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
       
      </Box>
    </CardContent>
  </Card>
);
