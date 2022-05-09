import { useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { Button, Tooltip, IconButton, RadioGroup, Radio, FormControlLabel, TextField, Typography, Grid, Autocomplete, Hidden, Switch} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod, getMethod} from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { isValidDate, yearMonthDayString } from 'src/utils/utils'; 
import { NavLink as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { EstadosContext, RetencionesContext, FormaPagosContext, FondosContext} from 'src/App';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
//import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { saveAs } from "file-saver";
import { useNavigate, useParams } from 'react-router-dom';


const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function FormDetalleOP({ idSociety, _bancos, _cuentasbanco, retIVA, setRetIVA, certificado, retSUSS, setRetSUSS, OPId, loggedUser, estadoOP, confirmada, formOP, isLoading, error, refetch, empresaId, fideicomiso}) {
  const navigate = useNavigate();
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  var acceso = true;

  if(loggedUser?.['rol.op'] ==='vista'){
       acceso =false;
  }

  const { mutate: updateOP } = useMutation(
      async newOP =>
        await postMethod(`op/modificar/${idSociety.id}`, newOP),
      {
        onSuccess: async () => await queryClient.refetchQueries(['formOP', idSociety])
      }
    );


  var estados = useContext(EstadosContext);
  var retenciones = useContext(RetencionesContext);  
  var fondos_s = useContext(FondosContext);
  var formaPagos = useContext(FormaPagosContext);
 
  const saveFile = (nombre, url) => {
    let path = url + "sociedades/" + idSociety.id + "/certificados/" + nombre;  
    saveAs(
      path, nombre + ".pdf"
    );
  };

 
/****************************************/
/****************************************/
/****************************************/
  
  if(useContext(EstadosContext) === undefined){
    const _estados = [  
      { id: 0, descripcion: '-' },
      { id: 1, descripcion: 'Para autorizar en Obra' },
      { id: 2, descripcion: 'Para pagar' },
      { id: 3, descripcion: 'Pagada' },
      { id: 4, descripcion: 'Para autorizar Admin. Central' },
      { id: 5, descripcion: 'Pagado Parcial' },
      { id: 6, descripcion: 'Anulado' },
      { id: 7, descripcion: 'Cargada en Banco' },
    ];
    estados = _estados;
  }
  
  if(useContext(RetencionesContext) === undefined){
    const _retenciones = [  
      { id: 0, descripcion: '-' },
      { id: 1, descripcion: 'No aplican' },
      { id: 2, descripcion: 'OK' },
      { id: 3, descripcion: 'Pendiente' },
    ];
    retenciones = _retenciones;
  }

  if(useContext(FondosContext) === undefined){
    const _retenciones = [  
      { id: 0, descripcion: '-' },
      { id: 1, descripcion: 'No aplican' },
      { id: 2, descripcion: 'OK' },
      { id: 3, descripcion: 'Pendiente' },
    ];
    retenciones = _retenciones;
  }

  if(useContext(FondosContext) === undefined){
    const _fondos_s = [
      { id: 0, descripcion: '-' },  
      { id: 1, descripcion: 'No cargado' },
      { id: 2, descripcion: 'OK cargado' },
    ];
    fondos_s = _fondos_s;
  }

/****************************************/
/****************************************/
/****************************************/


  const [isConfirmOP, setIsConfirmOP] = useState(parseInt(confirmada));
  const [iniEstado, setIniEstado] = useState(estados[parseInt(estadoOP)]);
  const [iniRet, setIniRet] = useState(retenciones[parseInt(formOP?.estadoRET)]);
  const [iniFondos, setIniFondos] = useState(fondos_s[parseInt(formOP?.fondos)]);

  
  
  const [flagField, setFlagField] = useState("");

  const [monedaOC, setMonedaOC] = useState(formOP?.OC_moneda);
  //const [conceptoSUSS, setConceptoSUSS] = useState(formOP?.conceptoSUSS);

  const bancos = [
    ..._bancos
  ];

  const cuentasbanco = [
    ..._cuentasbanco
  ];
    

  
  var verBotonDesconfirmar = (loggedUser['rol.op'] ==='total' && (isConfirmOP===1))? false:true;
  var verBotonOC = (loggedUser['rol.oc'] !=='no' )? false:true;


  var verRetGAN = (formOP?.empresas[0].esRetIVA ===1)? true:false;
  if(loggedUser['rol.op'] ==='vista' || loggedUser['rol.op'] ==='blue'){
    verRetGAN = false;
  }
  var verRetSUSS = (formOP?.empresas[0].esRetSUSS ===1)? true:false;
  if(loggedUser['rol.op'] ==='vista' || loggedUser['rol.op'] ==='blue'){
    verRetSUSS = false;
  }
  if(formOP?.confirmada === 1){
    verRetSUSS = false;
  }

  // console.log(5555, formOP);

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
          
    <>

      <Formik 
        initialValues={{
          id: OPId,
          flagPago: 1,// es para avisarle a la api que se modifica OPpagos
          
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          updateOP(values);
          // resetForm();
          setSubmitting(false);
          // refetch();
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form  >
            
                <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >                  

                  <Grid item md={12}>                  
                    <Grid item md={12}>                  
                      <Typography align="left" color="textPrimary" variant="h4">
                      Aprobación Técnica 
                      </Typography>
                    

                    </Grid>                 
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={6}>
                        <TextField   sx={{ width: '64ch' }} label="Detalle"  key={formOP?.descripcion}  defaultValue={formOP?.descripcion} type="float"  name="descripcion" 
                        onChange={event => handleModification(event, setFieldValue, refetch, 'descripcion', idSociety.id, OPId, 0, 0)}
                        /* onFocus={event => formOP.descripcion? handleModification(event, setFieldValue, refetch, 'descripcion', idSociety.id, OPId, 0, 0):false } */
                        InputProps={{
                              maxLength: 90,
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}

                        />                  
                  </Grid>                 
                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado por:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">                        
                        {formOP?.auth_obra?formOP.auth_obra[0]?.usuarios[0]?.user:''}
                        </Typography>
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >  
                  
                    <Grid item md={2}>                        
                          <Typography  align="right" color="textPrimary" variant="h5">
                              Orden de Compra:&nbsp;&nbsp;&nbsp;
                          </Typography>
                    </Grid>
                    <Grid item md={4}>
                              
                      <ComboOC useQuery={useQuery} setFieldValue={setFieldValue} OCId={formOP?.OCId} OPId={OPId} idSociety={idSociety} empresaId={empresaId} fideicomisoId={formOP?.fideicomisoId} />
                
                    </Grid>
                    <Grid item md={6}>
                      <Hidden  smUp={(verBotonOC  || formOP?.OCId < 1)} >
                        <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 2, sm: 4, md: 6 }} >  
                          <Grid item md={2}>
                              <Typography align="right" color="textPrimary" variant="h4">
                                <Button
                                    component={RouterLink}                            
                                    /* sx={{color: 'primary.main',}}*/
                                    to={`../../oc/${formOP?.OCId}/OC Detalle`}
                                  >
                                    ver compra
                                </Button>
                              </Typography>
                          </Grid>
                          <Grid item md={1}>
                         
                          </Grid>
                          <Grid item md={2}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                key={formOP?.OC_moneda}
                                defaultValue={formOP?.OC_moneda}                                
                                onChange={event => onlyNumbers4(event, setFieldValue, setMonedaOC, refetch, 'OC_moneda', idSociety.id, OPId, 1, 0)}
                                name="row-radio-buttons-group"
                                    >
                                      <FormControlLabel value="ARS" control={<Radio />} label="ARS" />
                                      <FormControlLabel value="USD" control={<Radio />} label="USD" />

                            </RadioGroup>
                          </Grid>  
                          <Grid item md={1}>
                              <Hidden  smUp={(monedaOC==='ARS')} >
                                <TextField  size={'small'} sx={{ width: '14ch' }} label="Tipo de cambio" type="number" key={formOP?.cotizacion_usd} defaultValue={formOP?.cotizacion_usd}  name="cotizacion_usd" onChange={event => setFlagField('cotizacion_usd')} onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'cotizacion_usd', idSociety.id, OPId, 0, 0,null, flagField)}  
                                      InputProps={{
                                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                                      }}
                                  />
                              </Hidden>
                          </Grid>      
                        </Grid>


                      </Hidden> 
                    </Grid>

                

                    
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={12}>                  
                    <Grid item md={4}>                  
                      <Typography align="left" color="textPrimary" variant="h4">
                      Aprobación Administrativa
                      </Typography>
                    </Grid>  

                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={2}   >
                    <Typography  align="right" color="textPrimary" variant="h5">
                      Estado:&nbsp;&nbsp;&nbsp;
                    </Typography>
                  </Grid>     
                  


                  <Grid item md={4}>                  
                    <Field
                      as={Autocomplete}
                      size={'small'}
                      label='Estado'
                      disabled={!acceso || (isConfirmOP===1)}
                      disablePortal
                      style={{ width: '325px', display: 'inline-flex' }}
                      
                      onChange={(event, newValue) => {                      
                        onlyNumbers2(event, setFieldValue, setIniEstado, refetch, 'estadoOP', idSociety.id, OPId, 0, newValue)
                      }}
                      value={iniEstado}
                      getOptionLabel={option => option.descripcion}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={estados}
                      renderInput={params => <TextField {...params} label='Estado' />}
                      
                    />
                  </Grid>

                  <Grid item md={2}>  
                      <Hidden  smUp={(loggedUser['rol.op'] ==='total'  || (isConfirmOP!==1)?true:false)} >
                          <Typography align="right" color="green" variant="h5">                      
                            {(isConfirmOP===1)?"Confirmada!":""}
                          </Typography> 
                      </Hidden>

                      <Hidden  smUp={(!acceso || (iniEstado?.id!==3)  || (isConfirmOP===1)?true:false)} >

                                                    
                           <Typography align="right" color="blue" variant="h5">                      
                            <Switch  onChange={event => confirmarOP(event, setIsConfirmOP,'confirmada', idSociety.id, OPId, refetch, 0, 1)}  /> Confirmar
                          </Typography> 
                      </Hidden>

                      <Hidden  smUp={(verBotonDesconfirmar)} >
                      
                          <Typography align="right" color="blue" variant="h5">                      
                            <Switch  defaultChecked onChange={event => confirmarOP(event, setIsConfirmOP,'confirmada', idSociety.id, OPId, refetch, 0, 0)}  /> Desconfirmar
                            </Typography> 
                          
                      </Hidden>

                  </Grid>
                  <Grid item md={4}>
                  &nbsp;
                  </Grid>               
                  
                  <Grid item md={12}>
                  &nbsp;
                  </Grid> 

                  <Grid item md={2}   >
                    <Typography  align="right" color="textPrimary" variant="h5">
                      Retención, Fondos:&nbsp;&nbsp;&nbsp;
                    </Typography>
                  </Grid>     
                  <Grid item md={2}>                  
                    <Field
                      as={Autocomplete}
                      size={'small'}
                      label='Estado Retención'
                      disabled={!acceso || (isConfirmOP===1)}
                      disablePortal
                      style={{ width: '160px', display: 'inline-flex' }}
                      
                      onChange={(event, newValue) => {
                        
                        onlyNumbers2(event, setFieldValue, setIniRet, refetch, 'estadoRET', idSociety.id, OPId, 0, newValue)
                      }}
                      value={iniRet}
                      getOptionLabel={option => option.descripcion}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={retenciones}
                      renderInput={params => <TextField {...params} label='Estado Retención' />}
                      
                    />
                  </Grid>
                  <Grid item md={2}>  
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Fondos'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        
                        onChange={(event, newValue) => {
                            
                          onlyNumbers2(event, setFieldValue, setIniFondos, refetch, 'fondos', idSociety.id, OPId, 0, newValue)
                        }}
                        value={iniFondos}
                        getOptionLabel={option => option.descripcion}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={fondos_s}
                        renderInput={params => <TextField {...params} label='Fondos' />}
                        
                      />

                  </Grid>
                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Forma de Pago:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        {formOP?.formaPago}
                        </Typography>
                  </Grid>
                
                  <Grid item md={12}>
                  &nbsp;
                  </Grid>    

                  <Grid item md={2}>
                  <Typography align="right" color="textPrimary" variant="h5">
                  Sumatoria Facturas:&nbsp;&nbsp;&nbsp;
                        </Typography>
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h4">
                        &nbsp;{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(formOP?.monto))}
                        </Typography>
                  </Grid>
                  <Grid item md={2}>
                    &nbsp;
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado por:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        {formOP?.auth_adm?formOP.auth_adm[0]?.usuarios[0]?.user:''}
                        </Typography>
                  </Grid>


                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={2}>
                  </Grid>               
                  <Grid item md={2}>

                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET GAN" type="number" key={formOP?.RET_GAN} defaultValue={formOP?.RET_GAN}  name="RET_GAN" onChange={event => setFlagField('RET_GAN')} onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'RET_GAN', idSociety.id, OPId, 0, 0,null, flagField)}  
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>                                                                                                                                             
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="Certificado GAN"  key={formOP?.COMP_GAN} defaultValue={formOP?.COMP_GAN}  name="COMP_GAN" onChange={event => handleModification(event, setFieldValue, refetch, 'COMP_GAN', idSociety.id, OPId, 0, 0, null)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={1}>
                      <Hidden  smUp={!(certificado?.find(i => i.tipo === 'GAN')?.id > 0 || formOP?.RET_GAN < 1 ) } >
                      
                      <Tooltip title="Descargar Certificado GAN"> 
                        <IconButton color="inherit" onClick={() => {saveFile(certificado?.find(i => i.tipo === 'GAN')?.nombre, apiServerUrl)}} >
                          <DownloadForOfflineIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Hidden>
                  </Grid>
                  <Grid item md={5}>
                  </Grid> 





                  <Grid item md={2}>
                  </Grid>               
                  <Grid item md={2}>
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET IVA" type="number" key={formOP?.RET_IVA} defaultValue={formOP?.RET_IVA}  name="RET_IVA" onChange={event => setFlagField('RET_IVA')}  onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'RET_IVA', idSociety.id, OPId, 0, 0, null, flagField)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>                                                                                                                                             
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="Certificado IVA"  key={formOP?.COMP_IVA} defaultValue={formOP?.COMP_IVA}  name="COMP_IVA" onChange={event => handleModification(event, setFieldValue, refetch, 'COMP_IVA', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={1}>
                      <Hidden  smUp={!(certificado?.find(i => i.tipo === 'IVA')?.id > 0  || formOP?.RET_IVA < 1 )} >
                      
                      <Tooltip title="Descargar Certificado IVA">
                        <IconButton color="inherit" onClick={() => {saveFile(certificado?.find(i => i.tipo === 'IVA')?.nombre, apiServerUrl)}} >
                          <DownloadForOfflineIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Hidden>
                  </Grid>
                  <Grid item md={5}>
                   <Hidden  smUp={!verRetGAN} >
                  
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                key={"retIVA"}
                                // defaultValue={formOP?.OC_moneda}                                
                                onChange={event => setRetIVA(event.target.value)}
                                name="row-radio-buttons-group"
                                    >
                                      <FormControlLabel value={998} control={<Radio />} label="Clase 'M' 100%" />
                                      <FormControlLabel value={999} control={<Radio />} label="Operación sujeto Ret. 50%" />

                            </RadioGroup>
                    


                      </Hidden>                   
                  </Grid>   

                  
                  <Grid item md={2}>
                  </Grid>               
                  <Grid item md={2}>
                  <TextField size={'small'} sx={{ width: '20ch' }} label="RET SUSS" type="number"  key={formOP?.RET_SUSS}  defaultValue={formOP?.RET_SUSS}  name="RET_SUSS"  onChange={event => setFlagField('RET_SUSS')}  onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'RET_SUSS', idSociety.id, OPId, 0, 0, null, flagField)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>                  

                  <TextField  size={'small'} sx={{ width: '20ch' }} label="Certificado SUSS"  key={formOP?.COMP_SUSS} defaultValue={formOP?.COMP_SUSS}  name="COMP_SUSS" onChange={event => handleModification(event, setFieldValue, refetch, 'COMP_SUSS', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={1}>
                    <Hidden  smUp={!(certificado?.find(i => i.tipo === 'SUS')?.id > 0   || formOP?.RET_SUSS < 1 )} >
                  
                      <Tooltip title="Descargar Certificado SUSS">
                        <IconButton color="inherit" onClick={() => {saveFile(certificado?.find(i => i.tipo === 'SUS')?.nombre, apiServerUrl)}} >
                          <DownloadForOfflineIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Hidden>
                  </Grid>
                  <Grid item md={5}>
                   <Hidden  smUp={!verRetSUSS} >
                  
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                key={formOP?.conceptoSUSS}
                                // defaultValue={formOP?.OC_moneda}     
                                defaultValue={formOP?.conceptoSUSS}                                
                                onChange={event => onlyNumbers4(event, setFieldValue, null, refetch, 'conceptoSUSS', idSociety.id, OPId, 1, 0)}

                                // onChange={event => setRetSUSS(event.target.value)}
                                name="row2-radio-buttons-group"
                                    >
                                      <FormControlLabel value={995} control={<Radio />} label="Seg. & Limp." />
                                      <FormControlLabel value={996} control={<Radio />} label="Ing.(1.2%)" />
                                      <FormControlLabel value={997} control={<Radio />} label="Arq.(2.5%)" />
                                      <FormControlLabel value={0} control={<Radio />} label="N/A" />

                            </RadioGroup>
                      </Hidden>                   
                  </Grid>  


                  <Grid item md={2}>
                        <Typography  align="right" color="textPrimary" variant="h5">
                        Monto a Abonar:&nbsp;&nbsp;&nbsp;  
                              </Typography>
                  </Grid>  
                  <Grid item md={2}>
                        <Typography  style={{textDecorationLine: 'underline'}} align="left" color="green" variant="h4">
                        &nbsp;{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(formOP?.monto_a_pagar)) + " " + formOP?.moneda}
                        </Typography>
                  </Grid>

                  <Grid item md={6}>
                  &nbsp;
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={12}>                  
                    <Grid item md={12}>                  
                      <Typography align="left" color="textPrimary" variant="h4">
                      Pago
                      </Typography>
                    </Grid>                 
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Modo
                        </Typography>              
                  </Grid> 
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Banco
                        </Typography>
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Nro Cuenta
                        </Typography>                
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Comprobante
                        </Typography>              
                  </Grid>                 
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Fecha
                        </Typography>                      
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Monto
                        </Typography>                
                  </Grid>  

                    
                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {
    
                            onlyNumbers(event, setFieldValue, refetch, 'modo1', idSociety.id, OPId, 1, newValue, formOP)
                          }}
                          value={formOP?.OPpago.modo1}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos? formaPagos:[]}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid> 
                  
                  
                  <Grid item md={2}>

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco1(newValue);
                          setFieldValue('banco1', newValue);
                          // onlyNumbers(event, setFieldValue, refetch, 'modo1', idSociety.id, OPId, 1, newValue, formOP)
                          onlyNumbers(event, setFieldValue, refetch, 'banco1', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco1 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={bancos? bancos:[]}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro1(newValue);
                          setFieldValue('nro1', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro1', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === (formOP?.OPpago.nro1 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === 0 || cuenta.bancoId === parseInt((formOP?.OPpago.banco1)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                       
                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri12} defaultValue={formOP?.OPpago.descri12} name="descri12"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri12', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri1 + "1"} defaultValue={formOP?.OPpago.descri1} name="descri1"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri1', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>  

                  </Grid> 
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha1)? formOP?.OPpago.fecha1:null}
                          name="fecha1"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha1', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>
                   
                                  
                  </Grid>  
                  <Grid item md={2}>
                    <TextField  
                      size={'small'}
                      sx={{ width: '20ch' }}
                      label="Monto" type="float"  
                      key={formOP?.OPpago.monto1}  
                      defaultValue={formOP?.OPpago.monto1}
                      name="monto1"      
                      onChange={event => setFlagField('monto1')}  
                      onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'monto1', idSociety.id, OPId, 1, 0,null,flagField)} 
                      inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                    />
                                      
                  </Grid>

                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {

                            onlyNumbers(event, setFieldValue, refetch, 'modo2', idSociety.id, OPId, 1, newValue, formOP)
                          }}
                          value={formOP?.OPpago.modo2}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos? formaPagos:[]}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid>
                  <Grid item md={2}>

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco2(newValue);
                          setFieldValue('banco2', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'banco2', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco2 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={bancos? bancos:[]}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>                  
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro2(newValue);
                          setFieldValue('nro2', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro2', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === parseInt(formOP?.OPpago.nro2 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === 0 || cuenta.bancoId === parseInt((formOP?.OPpago.banco2)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>

                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri22} defaultValue={formOP?.OPpago.descri22} name="descri22"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri22', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri2 + "2"} defaultValue={formOP?.OPpago.descri2} name="descri2"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri2', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>            


                  </Grid>
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha2)? formOP?.OPpago.fecha2:null}
                          name="fecha2"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha2', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>

                                  
                  </Grid>  
                  <Grid item md={2}>
                    <TextField  
                        size={'small'}
                        sx={{ width: '20ch' }}
                        label="Monto" type="float"  
                        key={formOP?.OPpago.monto2}  
                        defaultValue={formOP?.OPpago.monto2}
                        name="monto2"      
                        onChange={event => setFlagField('monto2')}  
                        onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'monto2', idSociety.id, OPId, 1, 0,null,flagField)} 
                        inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                      />              
                  </Grid>

                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {

                            onlyNumbers(event, setFieldValue, refetch, 'modo3', idSociety.id, OPId, 1, newValue, formOP)
                          }}
                          value={formOP?.OPpago.modo3}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos? formaPagos:[]}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid>  
                  <Grid item md={2}>

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco3(newValue);
                          setFieldValue('banco3', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'banco3', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco3 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={bancos}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro3(newValue);
                          setFieldValue('nro3', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro3', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === parseInt(formOP?.OPpago.nro3 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === 0 || cuenta.bancoId === parseInt((formOP?.OPpago.banco3)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri32} defaultValue={formOP?.OPpago.descri32} name="descri32"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri32', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri3 + "3"} defaultValue={formOP?.OPpago.descri3} name="descri3"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri3', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                  </Grid>                    
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha3)? formOP?.OPpago.fecha3:null}
                          name="fecha3"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha3', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>

                                  
                  </Grid>  
                  <Grid item md={2}>
                    <TextField  
                        size={'small'}
                        sx={{ width: '20ch' }}
                        label="Monto" type="float"  
                        key={formOP?.OPpago.monto3}  
                        defaultValue={formOP?.OPpago.monto3}
                        name="monto3"      
                        onChange={event => setFlagField('monto3')}  
                        onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'monto3', idSociety.id, OPId, 1, 0,null,flagField)} 
                        inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                      />               
                  </Grid>

                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {

                            onlyNumbers(event, setFieldValue, refetch, 'modo4', idSociety.id, OPId, 1, newValue, formOP)
                          }}
                          value={formOP?.OPpago.modo4}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos? formaPagos:[]}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid>
                  <Grid item md={2}>

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco4(newValue);
                          setFieldValue('banco4', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'banco4', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco4 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={bancos}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro4(newValue);
                          setFieldValue('nro4', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro4', idSociety.id, OPId, 1, newValue.id, null)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === parseInt(formOP?.OPpago.nro4 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === 0 || cuenta.bancoId === parseInt((formOP?.OPpago.banco4)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri42} defaultValue={formOP?.OPpago.descri42} name="descri42"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri42', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri4  + "4"} defaultValue={formOP?.OPpago.descri4} name="descri4"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri4', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>                  
                  </Grid>                      
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha4)? formOP?.OPpago.fecha4:null}
                          name="fecha4"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha4', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>

                                  
                  </Grid>  
                  <Grid item md={2}>
                    <TextField  
                        size={'small'}
                        sx={{ width: '20ch' }}
                        label="Monto" type="float"  
                        key={formOP?.OPpago.monto4}  
                        defaultValue={formOP?.OPpago.monto4}
                        name="monto4"      
                        onChange={event => setFlagField('monto4')}  
                        onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'monto4', idSociety.id, OPId, 1, 0,null,flagField)} 
                        inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                      />                
                  </Grid>

                  <Grid item md={10}>

                  <Typography align="right" color="textPrimary" variant="h5">
                        
                        Total:
                        </Typography>      
                        <Typography align="right" color="textSecondary" variant="h5">
                        
                        Saldo:
                        </Typography>
                                  
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        
                        {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number((Math.round((parseFloat(formOP?.OPpago.monto1? formOP?.OPpago.monto1:0) + parseFloat(formOP?.OPpago.monto2? formOP?.OPpago.monto2:0) + parseFloat(formOP?.OPpago.monto3? formOP?.OPpago.monto3:0) + parseFloat(formOP?.OPpago.monto4? formOP?.OPpago.monto4:0))* 100)/100 )))}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>      
                        <Typography align="right" color="textSecondary" variant="h5">
                        
                        {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number((Math.round((parseFloat(formOP?.monto) - parseFloat(formOP?.OPpago.monto1? formOP?.OPpago.monto1:0) - parseFloat(formOP?.OPpago.monto2? formOP?.OPpago.monto2:0) - parseFloat(formOP?.OPpago.monto3? formOP?.OPpago.monto3:0) - parseFloat(formOP?.OPpago.monto4? formOP?.OPpago.monto4:0))* 100+.0000001)/100)))}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>            
                  </Grid>

                </Grid> 
            
          </Form>
        )}
      </Formik>
      <Prompt
        message="Ya existe un tipo de cambio en esa fecha, por favor editar u eliminar el registro"
        ok
      />
    </>
  );
}


function onlyNumbers2(event, setFieldValue, setTypeInForm, refetch, typeOfData, idSociety, OPId, flagPago, newValue) {
  
  const { value } = event.target;
  
  if(value===0){
    
    event.preventDefault();
  
    const regex = /^\d{0,7}(\.\d{0,2})?$/;
    
    if (regex.test(value.toString())) {
      
      setTypeInForm(newValue);
      setFieldValue(typeOfData, value.toString());
      handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, newValue?.id, null);

    }else{
      return false;
    }
  }
}


function onlyNumbers3(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP, flagField) {

  if(typeOfData===flagField){
    
    event.preventDefault();
    const { value } = event.target;
    const regex = /^\d{0,9}(\.\d{0,2})?$/;
    
    
    if(value!==undefined){
      if (regex.test(value.toString())) {

        setFieldValue(typeOfData, value.toString());
        handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP);

      }else{
        return false;
      }    
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function onlyNumbers4(event, setFieldValue, setRadio, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP){

    const { value } = event.target;
    if(setRadio){
      setRadio(value);
    }
    handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP);

}

function onlyNumbers(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP) {

  
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,9}(\.\d{0,2})?$/;
  
  if(value!==undefined){
    if (regex.test(value.toString())) {

      setFieldValue(typeOfData, value.toString());
      handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP);

    }else{
      return false;
    }    
  }else{
    return false;
  }
}

function handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flag, valorCombo, formOP) {
  
  let val = null;


  if(flag === 2){ // si es una fecha
    
    val = yearMonthDayString(event) + " 03:00:00";
  }else{  
    event.preventDefault();
    const { value } = event.target;
    setFieldValue(typeOfData, value.toString());

    val = value;
    if(typeOfData==='OCId' || typeOfData==='estadoOP' || typeOfData==='estadoRET' || typeOfData==='fondos'){
      val = valorCombo;
    }
    if(typeOfData.toString().substring(0,5)==='banco'){
      val = valorCombo;
    }
    if(typeOfData.toString().substring(0,3)==='nro'){
      val = valorCombo;
    }
    if(typeOfData.toString().substring(0,4)==='modo'){
       val = valorCombo;
    }
  }

  let newData = {
        id: OPId,
        [typeOfData]: val,
      };
  if(flag > 0){
        newData.flagPago = 1;
  }
  
  if(valorCombo==="Retenciones"){
    let r = parseFloat(formOP?.RET_GAN) + parseFloat(formOP?.RET_IVA) + parseFloat(formOP?.RET_SUSS);
    if(typeOfData==='modo1'){newData.monto1 = r;}
    if(typeOfData==='modo2'){newData.monto2 = r;}
    if(typeOfData==='modo3'){newData.monto3 = r;}
    if(typeOfData==='modo4'){newData.monto4 = r;}
    if(typeOfData==='modo5'){newData.monto5 = r;}
    if(typeOfData==='modo6'){newData.monto6 = r;}
    if(typeOfData==='modo7'){newData.monto7 = r;}
    
  }   
    
  postMethod(`op/modificar/${idSociety}`, newData);
  setTimeout(() => {
    if(refetch){
      refetch();
      console.log("refetch");
    }
  }, 2000)

}

function confirmarOP(event, setIsConfirmOP, typeOfData, idSociety, OPId, refetch, flagPago, valor) {
  event.preventDefault();

  setIsConfirmOP(valor);
  let newData = {
        id: OPId,
        [typeOfData]: valor,
      };
  if(flagPago===1){
        newData.flagPago = 1;
  }    
    
  postMethod(`op/modificar/${idSociety}`, newData);
  setTimeout(() => {
    if(refetch){
      refetch();
      console.log("refetch");
    }
  }, 2000)

}

function ComboOC({idSociety, setFieldValue, empresaId,fideicomisoId, OPId, OCId, useQuery}) {

  var oc_en_blanco = {id: 0, fideicomisoId: 0, empresaId: 0, descripcion1: "-"};

  const{
      data: ordenes,
      isLoading,
      error,
      refetch
    } = useQuery(['ordenes', idSociety.id], () =>
        getMethod(`oc/listarCombo/${idSociety.id}/0/0`)
  );

  const [selectedOC, setSelectedOC] = useState(oc_en_blanco);
  
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

  var ordenesConBlanco = [
    ...ordenes.filter(el => el.fideicomisoId === parseInt(fideicomisoId) && el.empresaId === parseInt(empresaId)), oc_en_blanco
    ];

  if(ordenesConBlanco.length > 1 ){ 
    if((parseInt(OCId) > 0 && selectedOC?.id === 0) || (parseInt(OCId) === 0 && selectedOC?.id > 0)){  
      setSelectedOC(ordenesConBlanco.find(item => item.id===parseInt(OCId)));
    }
  }

  return (

    <Field
      as={Autocomplete}
      size={'small'}
      label='Orden de Compra'
      disablePortal
      style={{ width: '325px', display: 'inline-flex' }}
      
      onChange={(event, newValue) => {                      
        onlyNumbers2(event, setFieldValue, setSelectedOC, refetch, 'OCId', idSociety.id, OPId, 0, newValue)
      }}
      value={selectedOC}
      getOptionLabel={option => option?.descripcion1}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      options={ordenesConBlanco}
      renderInput={params => <TextField {...params} label='Orden de Compra' />}
      
    />

  );  
  
}