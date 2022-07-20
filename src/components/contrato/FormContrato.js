import React from 'react';
import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, Field } from 'formik';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { Typography, MenuItem, RadioGroup, Radio, IconButton, Collapse, Box, Grid, FormControlLabel, TextField, Button, Hidden, Checkbox, Autocomplete, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePrompt } from 'src/utils/usePrompt';
import { date_to_YYYYMMDD } from 'src/utils/utils'; 
import { postMethod, getMethod} from 'src/utils/api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { NavLink as RouterLink } from 'react-router-dom';


function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

export function FormContrato({setActTab, iniNombre, setIniNombre, right, setRight, fideInForm, setFideInForm, fiduInForm, setFiduInForm, activeStep, idSociety, loggedUser, fideicomisos, personas, empresas}) {

  const { setIsPromptOpen, Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addContrato } = useMutation(
    newContrato => postMethod(`contrato/agregar/${idSociety.id}`, newContrato),
    {
      onMutate: async newContrato => {
        
        await queryClient.invalidateQueries(['contrato', idSociety]);
        const prevData = await queryClient.getQueryData(['contrato', idSociety]);
        const newData = [...prevData, { ...newContrato, id: new Date().getTime() }];        
        queryClient.setQueryData(['contrato', idSociety], newData);
        return prevData;
        
      },
      onError: (err, id, context) => queryClient.setQueryData(['contrato', idSociety], context),
      onSettled: () => {if(idSociety.id > 0) {
          queryClient.invalidateQueries(['contrato', idSociety])
        } setActTab("1");}
      }
    
  );



  const [tipoFidu, setTipoFidu] = useState('persona');
  const [cuotas, setCuotas] = useState(0);
  const [open, setOpen] = useState(false);
  
  function verFidu(e){
    setFiduInForm(null);
    setTipoFidu(e.target.value);
    
  }

  const [moneda, setMoneda] = useState({id: 'ARS', descripcion: 'ARS'});

  var monedas = [{id: 'ARS', descripcion: 'ARS'}, {id: 'USD', descripcion: 'USD'}];
  const enteros = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,60];
  const [checked, setChecked] = React.useState([]);
  
  async function cargarProductos(fide){

    let rta = await getMethod(`producto/listar/${idSociety.id}/${fide.id}`);

    setLeft(rta.filter(item => item.contratoId === null).sort(function (a, b) {
          return a.codigo.localeCompare(b.codigo);
        }));
  };

  const [left, setLeft] = React.useState([{id:0, codigo:''}]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);      
    } else {
      newChecked.splice(currentIndex, 1); 
    }
    setChecked(newChecked);
    
  };

  const handleCheckedRight = () => {
    let listR = right;
    listR = listR.concat(leftChecked);
    setRight(listR);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (items) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = value.id;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.codigo} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  const locale = 'es';
  const localeMap = {es: esLocale};  
  const maskMap = {es: '__/__/____'};
  const [valuef, setValuef] = React.useState(null);
 

  return (
    <>
      <Formik
        initialValues={{
          fideicomisoId: null,
          CACbase: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          let d = date_to_YYYYMMDD(valuef); 
          if (!valuef) {
            setIsPromptOpen(true);
          } else{
    
            addContrato({
              fideicomisoId: fideInForm?.id,
              nombreCesion: tipoFidu==="persona"? fiduInForm?.nombre:fiduInForm?.razonSocial,
              personaId: tipoFidu==="persona"? fiduInForm?.id:null, 
              empresaId: tipoFidu==="empresa"? fiduInForm?.id:null,
              CACbase: null, // values.CACbase,
              nombre: iniNombre,
              link: values.link,
              anticipo: values.anticipo,
              qntCuotas: cuotas,
              montoCuota: values.montoCuota,
              moneda: moneda?.id,
              adhesion: d,
              productos: right,
              creador: loggedUser?.id
            });
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} > 

              <Grid item md={12} >
                  &nbsp;
              </Grid>                 

              <Hidden  smUp={!(activeStep===0)} >  
         
                  <Grid item md={1}> 
                     &nbsp;
                  </Grid>
              
                  <Grid item md={11}> 
                      <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Fideicomiso'
                        title="Seleccione un fideicomiso."
                        disablePortal                        
                        style={{ width: '330px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          setFideInForm(newValue);
                          setFieldValue('fideicomiso', newValue);
                          cargarProductos(newValue);
                        }}
                        value={fideInForm}
                        getOptionLabel={option => option.nombre}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={(fideicomisos? fideicomisos:[])}
                        renderInput={params => <TextField {...params} label='Fideicomiso' />}
                      />

                      <Field
                        as={TextField}
                        label="Link al archivo del contrato"
                        title="Link"
                        // required
                        style={{ width: '330px', display: 'inline-flex' }}
                        size="small"
                        type="text"              
                        name="link"
                      />
                
                
                  </Grid>
                  <Grid item md={12} >
                      &nbsp;
                  </Grid>
                  <Grid item md={1}> 
                      &nbsp;
                  </Grid>                  
                  <Grid item md={4}> 
                    <Hidden  smUp={tipoFidu==='empresa'} > 
                      <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Persona'
                        title="Seleccione una Persona."
                        disablePortal                        
                        style={{ width: '330px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          setFiduInForm(newValue);
                          setFieldValue('persona', newValue);
                        }}
                        value={tipoFidu==='persona'?fiduInForm:null}
                        getOptionLabel={option => option.nombre}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={(personas? personas:[])}
                        renderInput={params => <TextField {...params} label='Persona' />}
                      />
                    </Hidden>  
                    <Hidden  smUp={tipoFidu==='persona'} > 
                      <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Empresa'
                        title="Seleccione una Empresa."
                        disablePortal                        
                        style={{ width: '330px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          setFiduInForm(newValue);
                          setFieldValue('empresa', newValue);
                        }}
                        value={tipoFidu==='empresa'?fiduInForm:null}
                        getOptionLabel={option => option.razonSocial}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={(empresas? empresas:[])}
                        renderInput={params => <TextField {...params} label='Empresa' />}
                      />
                    </Hidden>
                  </Grid>
                  <Grid item md={7}> 
                    <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          key="tipo_fiduciante"
                          defaultValue={"persona"}                                
                          onChange={event => verFidu(event)}
                          name="tipo_fiduciante"
                              >
                                <FormControlLabel value="persona" control={<Radio />} label="Persona" />
                                <FormControlLabel value="empresa" control={<Radio />} label="Empresa" />

                      </RadioGroup>
                  </Grid>
                  <Grid item md={1}> 
                   
                  </Grid>
                  <Grid item md={11}> 
                    <Typography align="left" color="textPrimary" variant="h6">
                          * Si el fiduciante no existe debe ingresarlo previamente en "Fiduciantes".
                     
                    </Typography>
                    <Button
                            component={RouterLink}
                            to={`/${idSociety.nombre}/fiduciantes`}
                          >
                            Nuevo fidudiante
                          </Button>
                  </Grid>
              </Hidden>

              <Hidden  smUp={!(activeStep===1)} >    

                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  <Grid item>{customList(left)}</Grid>
                  <Grid item>
                    <Grid container direction="column" alignItems="center">
                
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked?.length === 0}
                        aria-label="move selected right"
                      >
                        &gt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked?.length === 0}
                        aria-label="move selected left"
                      >
                        &lt;
                      </Button>
                    
                    </Grid>
                  </Grid>
                  <Grid item>{customList(right)}</Grid>
                  <Grid item md={12}> 
                    <Typography align="center" color="textPrimary" variant="h6">
                          * Si el producto no existe debe ingresarlo previamente en "Fidecomisos / Productos".
                    </Typography>
                  </Grid>
                </Grid>    
    
              </Hidden>

              <Hidden  smUp={!(activeStep===2)} >  
               
                <Grid item md={12}>
                    &nbsp;
                </Grid>   

                <Grid item md={12}> 

                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                        <DatePicker
                            mask={maskMap[locale]}
                            value={valuef}
                            label='Fecha de Adhesión'
                            onChange={(newValue) => setValuef(newValue)}
                            renderInput={(params) => <TextField required style={{ width: '200px'}} size="small" {...params} />}
                          />
                  </LocalizationProvider>

                  <Field
                      as={TextField}
                      title="Nombre contrato"
                      label='Nombre contrato'
                      //type='float'
                      key={'_nombre'}
                      required     
                      maxLength={40}         
                      size="small"
                      sx={{ width: '160px'}}
                      value={iniNombre}    
                      name='nombre'
                      
                      onChange={event => setIniNombre(event?.target?.value.toString())}
                    />                      

                  <Field
                    as={TextField}
                    label='Anticipo'
                    title="Anticipo solo numeros."                  
                    maxLength={11}
                    required
                    type='number'
                    size="small"
                    style={{ width: '160px'}}
                    name='anticipo'
                  />   

                  <Field
                    as={TextField}
                    label='Cant. Cuotas'
                    title="Cant. Cuotas"
                    required
                    select
                    size="small"
                    style={{ width: '115px'}}
                    name='qntCuotas'
                    // helperText="Please select your currency"
                    value={cuotas}
                    onChange={(event) => {setCuotas(event.target.value);
                    }}
                    >
                      {enteros.map((num) => (
                      <MenuItem key={num} value={num}>
                        {num + " Cuotas "}
                      </MenuItem>
                    ))}
                  </Field>

                  <Field
                    as={TextField}
                    label='Monto cuota'
                    title="Monto, solo numeros."                  
                    maxLength={11}
                    required
                    type='number'
                    size="small"
                    style={{ width: '160px'}}
                    name='montoCuota'
                    // onChange={event => onlyNumbers(event, setFieldValue, 'anticipo')}
                  />   

                  <Field
                    as={Autocomplete}
                    size={'small'}
                    label='Moneda'
                    title="Moneda"
                    disablePortal
                    required
                    style={{ width: '115px', display: 'inline-flex' }}
                    onChange={(event, newValue) => {
                      setMoneda(newValue);
                      setFieldValue('moneda', newValue);
                    }}
                    value={moneda}
                    getOptionLabel={option => option.descripcion}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    options={(monedas? monedas:[])}
                    renderInput={params => <TextField {...params} label='Moneda *' />}
                  />

                  <Button type="submit" disabled={isSubmitting}>
                      Agregar
                  </Button>  

                </Grid>   
                <Grid item md={11}> 
                    <Typography align="left" color="textPrimary" variant="h6">
                          Ingrese una fecha de adhesión, un nombre o descripción, un monto por el anticipo (cero en el caso de no existir), cantidad de cuotas y el monto de las mismas.
                    </Typography>
                    <Typography align="left" color="textPrimary" variant="h6">
                          Si la moneda del anticipo es diferente a la de las cuotas, ingrese 0(cero) en el anticipo, luego de haber creado el contrato se puede agregar en la moneda que corresponda.
                    </Typography>
                    <Typography align="left" color="textPrimary" variant="h6">
                          Las fechas de cada cuota se crean de forma mensual y secuencial, en caso de ser cuotas con frecuencia bimensual, trimestral o cuatrimestral, luego de crear el contrato se pueden ajustar.
                    </Typography>
                    <Typography align="left" color="textPrimary" variant="h6">
                          Si el fiduciante ya abono el 100% de la unidad, ingrese el valor abonado en el anticipo, 0(cero) en cuotas y 0(cero) en monto cuota.
                    </Typography>
                </Grid>
        
                
                 
              </Hidden>                               
              
              <Grid item md={12}>
                  &nbsp;
              </Grid>      

            </Grid>

            <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Acción realizada!
              </Alert>
            </Collapse>         
          </Box>

          </Form>
        )}
      </Formik>
      <Prompt
        message="...error"
        ok
      />
    </>
  );
}
