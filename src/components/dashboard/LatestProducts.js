import { v4 as uuid } from 'uuid';
// import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const products = [
  {
    id: uuid(),
    name: '680 La Isla',
    imageUrl: '/static/images/products/680.png',
    // updatedAt: moment().locale('es').subtract(2, 'hours')
    updatedAt: 'hace 2 horas'
  },
  {
    id: uuid(),
    name: 'Barlovento Towers',
    imageUrl: '/static/images/products/Barlovento+Logo+Large+Gris.png',
    updatedAt: 'hace 6 horas'
  },
  {
    id: uuid(),
    name: 'Torre Bouchard',
    imageUrl: '/static/images/products/bouchardaMesa+de+trabajo+1.png',
    updatedAt: 'hace 3 días horas'
  },
  {
    id: uuid(),
    name: 'DV Park',
    imageUrl: '/static/images/products/dv+park.png',
    updatedAt: 'hace 16 días'
  },
  {
    id: uuid(),
    name: 'Las Heras Florida',
    imageUrl: '/static/images/products/las+herasMesa+de+trabajo+3.png',
    updatedAt: 'hace 5 días'
  }
];

const LatestProducts = (props) => (
  <Card {...props}>
    <CardHeader
      subtitle={`${products.length} in total`}
      title="Última Actualización"
    />
    <Divider />
    <List>
      {products.map((product, i) => (
        <ListItem divider={i < products.length - 1} key={product.id}>
          <ListItemAvatar>
            <img
              alt={product.name}
              src={product.imageUrl}
              style={{
                height: 48,
                width: 48
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={product.name}
            secondary={`Actualizado ${product.updatedAt}`} // ${product.updatedAt.fromNow()}
          />
          <IconButton edge="end" size="small">
            <MoreVertIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
    <Divider />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="small"
        variant="text"
      >
        Ver Todos
      </Button>
    </Box>
  </Card>
);

export default LatestProducts;
