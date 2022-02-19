import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import { getMethod } from 'src/utils/api';
import { postMethod } from 'src/utils/api';
import { useQuery } from 'react-query';
import { SocietyContext } from 'src/App';

const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function Login({ setLoggedUser, setIdSociety }) {

  const idSociety = useContext(SocietyContext);
  //const queryClient = useQueryClient();
  let { societyName } = useParams();
  const navigate = useNavigate();

  // localStorage.clear();
  
  localStorage.setItem("loggedUserInfo", null);
  localStorage.setItem("bs", null);
  localStorage.setItem("co", null);
  localStorage.setItem("estados", null);
  localStorage.setItem("formaPagos", null);

  const [isAlertOpen, setIsAlertOpen] = useState('none');


  useEffect(() => {
    societyStateObjectSetter(societyName, setIdSociety);
  }, [setIdSociety, societyName]);

  /****************************************************/
  /*************** deuda tecnica **********************/
  /****************************************************/

  const { data: bancos } = useQuery(['bancos', idSociety], () =>
    getMethod(`banco/listar/${idSociety.id}`)
  );
  localStorage.setItem("bs", JSON.stringify(bancos));

  const { data: cuentasbanco } = useQuery(['cuentasbanco', idSociety], () =>
    getMethod(`cuentabanco/listar/${idSociety.id}/0`)
  );  
  localStorage.setItem("co", JSON.stringify(cuentasbanco));

  const estados = [  
    { id: 0, descripcion: '-' },
    { id: 1, descripcion: 'Para autorizar Obra' },
    { id: 2, descripcion: 'Para pagar' },
    { id: 3, descripcion: 'Pagada' },
    { id: 4, descripcion: 'Para autorizar AC' },
    { id: 5, descripcion: 'Pagado Parcial' },
    { id: 6, descripcion: 'Anulado' },
    { id: 7, descripcion: 'Cargada en Banco' },
  ];
  localStorage.setItem("estados", JSON.stringify(estados));

  const retenciones = [  
    { id: 0, descripcion: '-' },
    { id: 1, descripcion: 'No aplican' },
    { id: 2, descripcion: 'OK' },
    { id: 3, descripcion: 'Pendiente' },
  ];
  localStorage.setItem("retenciones", JSON.stringify(retenciones));
  
  const fondos_s = [
    { id: 0, descripcion: '-' },  
    { id: 1, descripcion: 'Sin fondos' },
    { id: 2, descripcion: 'OK cargado' },
  ];
  localStorage.setItem("fondos_s", JSON.stringify(fondos_s));

  const tipos = [
    { id: 0, descripcion: 'Factura' },  
    { id: 1, descripcion: 'Nota débito' },
    { id: 2, descripcion: 'Nota crédito' },
    { id: 3, descripcion: 'Boleta Pago' },
  ];
  localStorage.setItem("tipos", JSON.stringify(tipos));


  const formaPagos = "-,Transferencia ARS,Transferencia USD,Cheque,Efectivo ARS,Efectivo USD,Otra";
  localStorage.setItem("formaPagos", formaPagos); 

  /****************************************************/
  /****************************************************/
  /****************************************************/

  return (
    <>
      <Helmet onChangeClientState={() => {}}>
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
          <div style={{ width: '100%' }} >
            <img
              /* backgroundColor:"#6326d5" */
              style={{ display: 'block', margin: 'auto', width: '50%', backgroundColor:"#777777" }}
              src={`${apiServerUrl}public/${idSociety?.logo}`}
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
