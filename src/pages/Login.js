import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import { getMethod } from 'src/utils/api';
import { postMethod } from 'src/utils/api';

const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function Login({ setLoggedUser, idSociety, setIdSociety }) {
  console.log('idSociety:', idSociety);
  let { societyName } = useParams();
  const navigate = useNavigate();

  const [isAlertOpen, setIsAlertOpen] = useState('none');

  useEffect(() => {
    societyStateObjectSetter(societyName, setIdSociety);
  }, [setIdSociety, societyName]);
  console.log('societyName:', societyName);
  console.log(`${apiServerUrl}public/${idSociety?.nombre}.png`);
  return (
    <>
      <Helmet onChangeClientState={() => console.log(idSociety?.nombre)}>
        (newState, addedTags, removedTags)}
        <title>Login | {idSociety?.nombreComercial ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <div style={{ width: '100%' }}>
            <img
              style={{ display: 'block', margin: 'auto', width: '30%' }}
              src={`${apiServerUrl}public/${idSociety?.nombre}.png`}
              alt="logo"
            />
          </div>
          <Formik
            enableReinitialize="true"
            initialValues={{
              email: `${idSociety?.dominio ?? ''}`,
              password: '',
            }}
            onSubmit={async (values, actions) => {
              if (await userCheck(idSociety.id, values.email, values.password, setLoggedUser)) {
                navigate(`/${societyName}`, { replace: true });
              } else {
                setIsAlertOpen('flex');
                actions.resetForm();
              }
            }}
          >
            {function (props) {
              return (
                <form onSubmit={props.handleSubmit}>
                  <TextField
                    fullWidth
                    label="Correo"
                    margin="normal"
                    name="email"
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    value={props.values.email}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Contraseña"
                    margin="normal"
                    name="password"
                    autoComplete="on"
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    type="password"
                    value={props.values.password}
                    variant="outlined"
                  />
                  <Box sx={{ py: 2 }}>
                    <Alert
                      style={{ display: isAlertOpen }}
                      severity="error"
                      onClose={() => {
                        setIsAlertOpen('none');
                      }}
                    >
                      Correo y/o contraseña inválidos
                    </Alert>
                    <Button
                      color="primary"
                      disabled={props.isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
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

async function societyStateObjectSetter(societyName, setIdSociety) {
  const societyData = await nameToId(societyName);
  setIdSociety({ ...societyData });
}

async function nameToId(nombreSociedad) {
  const data = await getMethod(`sociedad/mostrar/${nombreSociedad}`);
  localStorage.removeItem('idSociety');
  if (data) {
    localStorage.setItem('idSociety', JSON.stringify({ ...data }));
  }
  return await data;
}

async function userCheck(idSociety, email, password, setLoggedUser) {
  const loggedUserInfo = await postMethod(`usuario/login/${await idSociety}`, {
    mail: email,
    pass: password,
  });
  setLoggedUser(loggedUserInfo);
  return loggedUserInfo !== null ? true : false;
}
