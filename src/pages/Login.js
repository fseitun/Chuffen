import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, TextField, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import { postMethod } from 'src/utils/api';
import { nameToId } from 'src/utils/nameToId';

export function Login({ setLoggedUser, idSociety, setIdSociety }) {
  let { societyName } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function societyStateObjectSetter() {
      const id = await nameToId(societyName);
      setIdSociety({ name: societyName, id: id });
    }
    societyStateObjectSetter();
  }, [setIdSociety, societyName]);
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
              if (await userCheck(idSociety.id, values.email, values.password, setLoggedUser)) {
                navigate(`/${societyName}`, { replace: true });
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

async function userCheck(idSociety, email, password, setLoggedUser) {
  const loggedUserInfo = await postMethod(`usuario/login/${await idSociety}`, {
    mail: email,
    pass: password,
  });
  setLoggedUser(loggedUserInfo);
  return loggedUserInfo !== null ? true : false;
}
