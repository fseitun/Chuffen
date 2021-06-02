import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';

const states = [
  {
    value: 'buenos-aires',
    label: 'Buenos Aires'
  },
  {
    value: 'punta-del-este',
    label: 'Punta del Este'
  },
  {
    value: 'miami',
    label: 'Miami'
  }
];

const AccountProfileDetails = (props) => {
  const [values, setValues] = useState({
    nombre: 'Juana',
    apellido: 'Vidal',
    correo: 'jvidal@gmail.com',
    telefono: '1135812933',
    ciudad: 'Buenos Aires',
    country: 'Argentina'
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="La información puede ser editada"
          title="Perfil"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Especificar el Primer Nombre"
                label="Primer Nombre"
                name="nombre"
                onChange={handleChange}
                required
                value={values.nombre}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                onChange={handleChange}
                required
                value={values.apellido}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Correo"
                name="correo"
                onChange={handleChange}
                required
                value={values.correo}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                onChange={handleChange}
                type="number"
                value={values.telefono}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="País"
                name="country"
                onChange={handleChange}
                required
                value={values.country}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Ciudad"
                name="ciudad"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.ciudad}
                variant="outlined"
              >
                {states.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
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
            Guardar Cambios
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AccountProfileDetails;
