import React from 'react';
// import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'Buenos Aires',
  country: 'Argentina',
  jobTitle: 'Directora',
  name: 'Juana Vidal',
  timezone: 'GTM-3'
};

const AccountProfile = (props) => (
  <Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 100,
            width: 100
          }}
        />
        <Typography color="textPrimary" gutterBottom variant="h3">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {`${user.city} ${user.country}`}
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {/* {`${moment().format('HH:mm')} ${user.timezone}`} */}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button color="primary" fullWidth variant="text">
        Cambiar Foto
      </Button>
    </CardActions>
  </Card>
);

export default AccountProfile;
