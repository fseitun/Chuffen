import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography
} from '@material-ui/core';

const SettingsNotifications = (props) => (
  <form {...props}>
    <Card>
      <CardHeader
        subheader="Administrar notificaciones"
        title="Notificaciones"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={6}
          wrap="wrap"
        >
          <Grid
            item
            md={4}
            sm={6}
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
            xs={12}
          >
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h6"
            >
              Notificaciones
            </Typography>
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  defaultChecked
                />
              )}
              label="Correo"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  defaultChecked
                />
              )}
              label="Enviar Notificaciones"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Mensajes"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  defaultChecked
                />
              )}
              label="Llamadas"
            />
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
            xs={12}
          >
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h6"
            >
              Mensajes
            </Typography>
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  defaultChecked
                />
              )}
              label="Correo"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Enviar Notificaciones"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  defaultChecked
                />
              )}
              label="Llamadas"
            />
          </Grid>
        </Grid>
      </CardContent>
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
          variant="contained"
        >
          Guardar cambios
        </Button>
      </Box>
    </Card>
  </form>
);

export default SettingsNotifications;
