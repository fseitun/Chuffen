import { TextField, Button, Hidden } from '@mui/material';
import {useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { Autocomplete } from '@mui/material';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import RepRecibo from "src/components/reportes/recibo/recibo";
import { pdf } from "@react-pdf/renderer";
import { mostrarCUIT } from 'src/utils/utils';

const apiServerUrl = process.env.REACT_APP_API_SERVER;


export function FormCobro({ mode, contrato, conceptosPago, formaPagosFidu, contratos, fideicomisos, loggedUser, refetch  }) {
  
  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  
  
  const [formaPagoFidu, setFormaPagoFidu] = useState(null);
  const [moneda, setMoneda] = useState({id: 'ARS', descripcion: 'ARS'});
  const [concepto, setConcepto] = useState(null);

  let iniFide =null;
  let iniCont =null;
  if(mode==='contrato'){
    iniFide = {id: contrato?.cont?.fideicomisoId}; // si estoy en el detalle de un contrato fijo el fideicomiso
    iniCont = {id: contrato?.cont?.id}; // si estoy en el detalle de un contrato fijo el contrato
  }

  const [fideInForm, setFideInForm] = useState(iniFide);
  const [contInForm, setContInForm] = useState(iniCont);

  var monedas = [{id: 'ARS', descripcion: 'ARS'}, {id: 'USD', descripcion: 'USD'}];
  
  var data = null;

  // En el click del boton "AGREGAR"
  // Paso 1: Graba en tabla Cobros 
  // Paso 2: createPDF_2_of_4 formData es el archivo y los parametros (usando el reporte de recibo)
  // Paso 3: savePDF_3_of_4 guarda el pdf en sociedades/sociedadId/recibos

  var folder = `sociedades/${idSociety.id}/recibos/`;
  const { mutate: addCobro_1_of_3 } = useMutation(
    Cobro => postMethod(`cobro/agregar/${idSociety.id}`, Cobro),
    {
      onMutate: async Cobro => {
        Cobro.creador = parseInt(loggedUser.id);

        await queryClient.invalidateQueries(['cobro', idSociety]);
        const prevData = await queryClient.getQueryData(['cobro', idSociety]);
        // const newData = [...prevData, { ...Cobro, id: new Date().getTime() }];
        // queryClient.setQueryData(['Cobro', idSociety], newData);
        return prevData;

      },
      onError: (err, id, context) => queryClient.setQueryData(['cobro', idSociety], context),
      onSettled: (Cobro) => {
        
        let dirL1, dirL2  = ""
        if(mode!=='contrato'){
          if(fideInForm?.empresas[0]?.domicilio){
            dirL1 = " " + fideInForm?.empresas[0]?.domicilio.split(",")[0]
            if(fideInForm?.empresas[0]?.domicilio.split(",").length>1){
              dirL2 = fideInForm?.empresas[0]?.domicilio.split(",")[1]
              if(fideInForm?.empresas[0]?.domicilio.split(",").length>2){
                dirL2 += "," + fideInForm?.empresas[0]?.domicilio.split(",")[2]
              }
            }
          }   
        }else{ // es dentro de detalle contrato

          dirL1 = " " + contrato?.cont?.fideicomisos[0]?.empresas[0]?.domicilio.split(",")[0]
          if(contrato?.cont?.fideicomisos[0]?.empresas[0]?.domicilio.split(",").length>1){
            dirL2 = contrato?.cont?.fideicomisos[0]?.empresas[0]?.domicilio.split(",")[1]
            if(contrato?.cont?.fideicomisos[0]?.empresas[0]?.domicilio.split(",").length>2){
              dirL2 += "," + contrato?.cont?.fideicomisos[0]?.empresas[0]?.domicilio.split(",")[2]
            }
          }
        }
        
        let f = null;
        let _fecha = null;
          
        if(mode==='contrato'){
          _fecha = contrato?.cont?.fideicomisos[0]?.fechaInicio.slice(0,10)
        }else if(fideInForm?.fechaInicio){
          _fecha = fideInForm?.fechaInicio.slice(0,10) 
        }

        if(_fecha){
          f = new Date((_fecha + " 03:00")).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
            timeZone: 'UTC',
          })
        }
        
        let ptoVenta = "00000" + (Cobro?.reciboNum + "").slice(0, 1)

        // console.log(222222, contrato);
        data = {
          'cobro_numero': ptoVenta.slice(-5) + "-" + (Cobro?.reciboNum + "").slice(1, 9),// ptoVenta.slice(-5) + "-" + numTXT.slice(1, 9),
          'fide_nombre': mode==='contrato'? contrato?.cont?.fideicomisos[0]?.empresas[0]?.razonSocial: fideInForm?.empresas[0]?.razonSocial,
          'fide_cuit': mode==='contrato'? mostrarCUIT(contrato?.cont?.fideicomisos[0]?.empresas[0]?.CUIT):mostrarCUIT(fideInForm?.empresas[0]?.CUIT),
          'fide_fecha': f,
          'fide_dir_linea1': dirL1,
          'fide_dir_linea2': dirL2,
          'fidu_nombre': mode==='contrato'? contrato?.cesiones[0]?.nombre:contInForm?.cesions[0]?.nombre,
          'adhe_nombre': mode==='contrato'? contrato?.cont?.nombre:contInForm?.nombre,
          'cobro_monto': Cobro?.monto? Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(Cobro?.monto)):"",
          'cobro_moneda': Cobro?.moneda,          
          'cobro_f_pago': formaPagoFidu?.descripcion,
          'cobro_concepto': concepto?.descripcion,          
         }
        
        if(idSociety.id > 0) {
          
          createPDF_2_of_3(Cobro)
          
        }       
      }
    }
  );

           
  function nombreRecibo(nombreFide, nombreContrato, numeroRecibo){

    let n =  nombreFide + "-" + nombreContrato ;
    return "Recibo_" + numeroRecibo + "-" + n.replace(/ /g,"_") ;
  
  }

  const createPDF_2_of_3 = async (Cobro) =>   {

    if(data && Cobro){

      let blobPdf = await pdf(RecDocument()).toBlob();
      let formData = new FormData();
      formData.append('file', blobPdf);      
      
      formData.append('path', './' + folder); // guarda archivo en carpeta
      formData.append('fileName', nombreRecibo(mode==='contrato'? contrato?.cont?.fideicomisos[0]?.empresas[0]?.razonSocial: fideInForm?.empresas[0]?.razonSocial, mode==='contrato'? contrato?.cont?.nombre:contInForm?.nombre, Cobro?.reciboNum));     

      savePDF_3_of_3({formData});
    }
    
  }

  const RecDocument = () => {
    return (
      <RepRecibo data={data} apiServerUrl={apiServerUrl} />
    )
  }

  const { mutate: savePDF_3_of_3 } = useMutation(
    async ({formData}) => 
        await postMethod(`utilidades/uploadpdf/${idSociety.id}`, formData),          
      {
        onMutate: async ({ formData }) => {
          await queryClient.cancelQueries(['pdfFile', idSociety]);
          const prevData = queryClient.getQueryData(['pdfFile', idSociety]);
          return prevData;
        },
        onError: (err, id, context) => queryClient.setQueryData(['pdfFile', idSociety], context),
        onSettled: (fileName) => {
          if(idSociety.id > 0) {
            queryClient.invalidateQueries(['pdfFile', idSociety])
          }
          refetch() 
        }
      }     
);

  return (
    
     <>
     <Formik
        initialValues={{
          concepto: '',
          monto: '',
          fecha: null,
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          
          
          addCobro_1_of_3({         
            fecha: values?.fecha, 
            concepto: concepto.id,
            monto: values?.monto,
            formaPago: formaPagoFidu.id,
            fideicomisoId: fideInForm.id,
            reciboUrl: apiServerUrl + folder + nombreRecibo(mode==='contrato'? contrato?.cont?.fideicomisos[0]?.empresas[0]?.razonSocial: fideInForm?.empresas[0]?.razonSocial, mode==='contrato'? contrato?.cont?.nombre:contInForm?.nombre, "*****"), // los 5 asteriscos los edita en la API por el nuevo ID
            contratoId: contInForm.id,
            moneda: moneda.id,
            creador: loggedUser.id

          });

          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field component={Picker} label="Fecha" type="date" name="fecha" style={{ width: '160px'}} />

            
            <Hidden  smUp={(mode==='contrato')} >            
              <Field
                  as={Autocomplete}
                  size={'small'}
                  label='Fideicomiso'
                  title="Seleccione un fideicomiso."
                  disablePortal
                  required
                  style={{ width: '160px', display: 'inline-flex' }}
                  onChange={(event, newValue) => {
                    setFideInForm(newValue);
                    setFieldValue('fideicomiso', newValue);
                  }}
                  value={fideInForm}
                  getOptionLabel={option => option.nombre}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={(fideicomisos? fideicomisos:[])}
                  renderInput={params => <TextField {...params} label='Fideicomiso' />}
                />

              <Field
                  as={Autocomplete}
                  size={'small'}
                  label='Adhesión'
                  title="Adhesión"
                  disablePortal
                  required
                  style={{ width: '260px', display: 'inline-flex' }}
                  onChange={(event, newValue) => {
                    setContInForm(newValue);
                    setFieldValue('contratoId', newValue);
                  }}
                  value={contInForm}
                  getOptionLabel={option => (`${option.nombre} - ${option?.empresas[0]? option?.empresas[0]?.razonSocial:"" + option?.personas[0]? option?.personas[0]?.nombre:""}`)}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={contratos? contratos?.filter(cont => cont?.fideicomisoId === fideInForm?.id):[]}
                  renderInput={params => <TextField {...params} label='Adhesión' />}
                />
            </Hidden>
            <Field
                as={Autocomplete}
                size={'small'}
                label='Concepto'
                title="Concepto"
                disablePortal
                required
                style={{ width: '160px', display: 'inline-flex' }}
                onChange={(event, newValue) => {
                  setConcepto(newValue);
                  setFieldValue('concepto', newValue);
                }}
                value={concepto}
                getOptionLabel={option => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(conceptosPago? conceptosPago:[])}
                renderInput={params => <TextField {...params} label='Concepto' />}
              />

            <Field
              as={TextField}
              required
              label="Monto"
              size="small"
              type="number"
              style={{ width: '160px'}}
              name="monto"
            />     

            <Field
                as={Autocomplete}
                size={'small'}
                label='Moneda'
                title="Moneda"
                disablePortal
                required
                style={{ width: '120px', display: 'inline-flex' }}
                onChange={(event, newValue) => {
                  setMoneda(newValue);
                  setFieldValue('moneda', newValue);
                }}
                value={moneda}
                getOptionLabel={option => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(monedas? monedas:[])}
                renderInput={params => <TextField {...params} label='Moneda' />}
              />

            <Field
                as={Autocomplete}
                size={'small'}
                label='Forma de pago'
                title="Forma de pago"
                disablePortal
                required
                style={{ width: '160px', display: 'inline-flex' }}
                onChange={(event, newValue) => {
                  setFormaPagoFidu(newValue);
                  setFieldValue('formaPago', newValue);
                }}
                value={formaPagoFidu}
                getOptionLabel={option => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(formaPagosFidu? formaPagosFidu:[])}
                renderInput={params => <TextField {...params} label='Forma de pago' />}
              />

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="Descripción, fecha y monto no puede estar en blanco"
        ok
      />
     </> 
  );
}



function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Fecha"
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={value => setFieldValue(name, value)}
        renderInput={params => <TextField required style={{ width: '160px', display: 'inline-flex' }} size="small" {...params} />}
      />
    </LocalizationProvider>
  );
}

