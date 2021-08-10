import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, Container, TextField } from '@material-ui/core';
import { postMethod } from 'src/utils/api';

export function Login({ idSociedad, setIsAuth }) {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Login | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}>
        <Container maxWidth='sm'>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={async (values, actions) => {
              if (await userCheck(idSociedad, values.email, values.password)) {
                setIsAuth(values.email);
                actions.resetForm();
                navigate('/app/cac', { replace: true });
              } else actions.resetForm();
            }}>
            {function (props) {
              return (
                <form onSubmit={props.handleSubmit}>
                  <TextField
                    fullWidth
                    label='Correo'
                    margin='normal'
                    name='email'
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    value={props.values.email}
                    variant='outlined'
                  />
                  <TextField
                    fullWidth
                    label='Contraseña'
                    margin='normal'
                    name='password'
                    autoComplete='on'
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    type='password'
                    value={props.values.password}
                    variant='outlined'
                  />
                  <Box sx={{ py: 2 }}>
                    <Button
                      color='primary'
                      disabled={props.isSubmitting}
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'>
                      Ingresar
                    </Button>
                  </Box>
                </form>
              );
            }}
          </Formik>
        </Container>
      </Box>
    </>
  );
}

async function userCheck(idSociedad, email, password) {
  const loggedUser = await postMethod(`usuario/login/${idSociedad}`, {
    user: email,
    pass: password,
  });
  return loggedUser !== null ? true : false;
}
