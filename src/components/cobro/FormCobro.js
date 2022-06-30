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


const apiServerUrl = process.env.REACT_APP_API_SERVER;


export function FormCobro({ mode, fide, cont, conceptosPago, formaCobros, contratos, fideicomisos, loggedUser, refetch  }) {
  
  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  
  const [formaCobro, setFormaCobro] = useState(null);
  const [moneda, setMoneda] = useState({id: 'ARS', descripcion: 'ARS'});
  const [concepto, setConcepto] = useState(null);

  let iniFide =null;
  let iniCont =null;
  if(mode==='contrato'){
    iniFide = {id: fide}; // si estoy en el detalle de un contrato fijo el fideicomiso
    iniCont = {id: cont}; // si estoy en el detalle de un contrato fijo el contrato
  }

  const [fideInForm, setFideInForm] = useState(iniFide);
  const [contInForm, setContInForm] = useState(iniCont);

  var monedas = [{id: 'ARS', descripcion: 'ARS'}, {id: 'USD', descripcion: 'USD'}];
  const [data, setData] = useState({});

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
        setData({Cobro});
        console.log(33333, Cobro);
        if(idSociety.id > 0) {
          createPDF_2_of_3(Cobro);
        }       
      }
    }
  );

           
  function nombreRecibo(nombreFide, nombreContrato, numeroRecibo){

    let n =  nombreFide + "-" + nombreContrato ;
    return "Recibo_" + numeroRecibo + "-" + n.replace(/ /g,"_") ;
  
  }

  const createPDF_2_of_3 = async (Cobro) =>   {

      let blobPdf = await pdf(RecDocument()).toBlob();
      let formData = new FormData();
      formData.append('file', blobPdf);      
     
      formData.append('path', './' + folder); // guarda archivo en carpeta
      formData.append('fileName', nombreRecibo(fideInForm?.nombre, contInForm?.nombre, Cobro?.reciboNum));     

      savePDF_3_of_3({formData});

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
            formaPago: formaCobro.id,
            fideicomisoId: fideInForm.id,
            reciboUrl: apiServerUrl + folder + nombreRecibo(fideInForm?.nombre, contInForm?.nombre, "*****"), // los 5 asteriscos los edita en la API por el nuevo ID
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
              // onChange={event => onlyNumbers(event, setFieldValue, 'monto')}
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
                  setFormaCobro(newValue);
                  setFieldValue('formaPago', newValue);
                }}
                value={formaCobro}
                getOptionLabel={option => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(formaCobros? formaCobros:[])}
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

