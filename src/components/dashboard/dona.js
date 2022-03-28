// import 'doughnut.js/auto';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
// import { ArcElement } from "chart.js";
// import Chart from "chart.js/auto";
// useTheme
import { Box, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
// import LaptopMacIcon from '@mui/icons-material/LaptopMac';
// import PhoneIcon from '@mui/icons-material/Phone';
// import TabletIcon from '@mui/icons-material/Tablet';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Dona = ({props}) => {
  // const theme = useTheme();



  const options = {
    /*animation: false,
    
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }*/
  };
  // const devices = [];
  //props?.datasets[0].data[1]
  const devices = [
    {
      title: props?.data.labels[0],
      value: props?.data.datasets[0].data[0],
      //icon: LaptopMacIcon,
      color: '#3F51B5'
    },
    {
      title: props?.data.labels[1],
      value: props?.data.datasets[0].data[1],
     // icon: TabletIcon,
      color: '#E53935'
    },
    {
      title: props?.data.labels[2],
      value: props?.data.datasets[0].data[2],
      //icon: PhoneIcon,
      color: '#FB8C00'
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title={props.nombre} />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={props?.data}
            options={options}
          />
      
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {devices.map(({
            color,
            //icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
     
              <Typography
                color={props?.color}
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h4"
              >
                {value}
                
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
