
import { useState } from 'react';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { getMethod, postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { Typography, TextField, Button, Hidden, Autocomplete } from '@mui/material';
import { SocietyContext, ConceptosPagoContext, ConceptosCuotaContext, LetrasContext } from 'src/App';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { date_to_YYYYMMDD, DB_to_MMMAAAA } from 'src/utils/utils';
import RepLiquidacion from "src/components/reportes/liquidaciones/liquidacion";
import { pdf } from "@react-pdf/renderer";
// import { date_to_YYYYMMDD, DB_to_MMMAAAA } from 'src/utils/utils';
import { ListAltOutlined } from '@mui/icons-material';

const apiServerUrl = process.env.REACT_APP_API_SERVER;


export function GenLiquidaciones({ loggedUser, fideicomisos, periodos }) {
 
  var letras = useContext(LetrasContext);
  var conceptosPago = useContext(ConceptosPagoContext);  
  var conceptosCuota = useContext(ConceptosCuotaContext);

  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();
  
  const [fideInForm, setFideInForm] = useState(null);
  const [perInForm, setPerInForm] = useState(null);

  var iniMsg = "Seleccione un fideicomiso y un periodo."
  const [msg, setMsg] = useState(iniMsg);

  function acumLiqui(field, value){
            
    let fieldFide = (field==='fide'? value:fideInForm);
    let fieldPeriod = (field==='per'? value:perInForm);

    if(fieldFide?.id > 0 && fieldPeriod?.id > 0){

      return getMethod(`liquidacion/listarQntPorPeriodo/${idSociety.id}/${fieldFide?.id > 0? fieldFide?.id:0}/${fieldPeriod?.id > 0? fieldPeriod?.id:0}`)
      .then(result => {
            let message=`Cantidad de Liquidaciones de ${fieldFide?.nombre} en ${("" + fieldPeriod?.periodo).slice(0,4) + "-" + ("" + fieldPeriod?.periodo).slice(4,6)}, es :`;
            setMsg(message + " " + result.length);
      })          

    }else{    
      setMsg(iniMsg);
      return null;
    }
    
}
  var folder = `sociedades/${idSociety.id}/liquidaciones/`;
  var contrato = {};
  var cesion = {};
  var productos = {};
  var qCuotasARS = {};
  var qCuotasUSD = {};
  var data = null;

  const [qntFiles, setQntFiles] = useState(0);

  const [mi_lista, setLista] = useState(null);


  

  const { mutate: genLiquidacion_0_of_3 } = useMutation(
    List => getMethod(`contrato/listarCuota/${idSociety.id}/${fideInForm?.id}/${perInForm?.id}`, List),
    {
      onMutate: async List => {

        await queryClient.invalidateQueries(['list', idSociety]);
        const prevData = await queryClient.getQueryData(['list', idSociety]);
        return prevData;

      },

      onError: (err, id, context) => queryClient.setQueryData(['list', idSociety], context),
      onSettled: (List) => {
          // setLista(List);
          List.forEach((element,i) => {

                setTimeout(() => {
                  
                  addLiqui(element, i)
                }, i * 700)
          });
        
      }
    }
  );

  /*
  const aver = async function() {
    // addLiqui(mi_lista[0], 0);
    
    mi_lista.forEach((element,i) => {

          setTimeout(() => {
            
            addLiqui(element, i)
          }, i * 700)
    });

  }
*/

  const addLiqui = async function(item, i) {
      
    return getMethod(`contrato/mostrar/${idSociety.id}/${item.id}`)
    .then(result => {

          contrato=result?.cont;
          productos=result?.item;
          cesion=result?.cesiones[0];
          qCuotasARS = result?.cuotas.filter(p => p.moneda==='ARS' && p.concepto > 0).length;
          qCuotasUSD = result?.cuotas.filter(p => p.moneda==='USD' && p.concepto > 0).length;

          let fec = ("" + perInForm?.periodo).slice(0,4) + "-" + ("" + perInForm?.periodo).slice(4,6) + "-01 03:00"
          let d = new Date(fec); 
          
          let Liquidacion = {
            fechaLiquidacion: date_to_YYYYMMDD(d), 
            tasaPunitoria: contrato?.fideicomisos[0]?.tasaPunitoria,
            qntDias: contrato?.fideicomisos[0]?.qntDias,            
            contrato: {id: contrato?.id, nombre: contrato?.nombre, fideicomisoId: contrato?.fideicomisoId, adhesion: contrato?.adhesion, CACbase: contrato?.CACbase},
            link: apiServerUrl + folder + nombreLiq(date_to_YYYYMMDD(d), i),
            creador: loggedUser.id,
          }
          
          return postMethod(`liquidacion/agregar/${idSociety.id}`, Liquidacion)
          .then(result2 => {
              data = {cont: contrato, liq: result2, cesion: cesion, productos: productos, letras:letras, qCuotasARS:qCuotasARS, qCuotasUSD:qCuotasUSD};
     
              createPDF_2_of_3(result2);
          })
          
        
    })
}


  //
  //////////////////////////////////////
  // En el click del boton "AGREGAR"
  // Paso 1: Graba en tabla liquidaciones un registro con su JSON
  // Paso 2: createPDF_2_of_4 formData es el archivo y los parametros (usando el reporte de liquidaciones)
  // Paso 3: savePDF_3_of_4 guarda el pdf en sociedades/sociedadId/liquidaciones
  ///////////////////////////////////////





  function nombreLiq(fecha){
    // console.log(555555, contrato?.id);

    let n = contrato?.fideicomisos[0]?.nombre + "-" + cesion?.nombre ;
    return "Liquidacion-" + n.replace(/ /g,"_") + "-Adhesion_" + contrato?.id + "-" + DB_to_MMMAAAA(fecha);
  
  }
  const createPDF_2_of_3 = async (Liquidacion) =>   {


      let blobPdf = await pdf(LiqDocument()).toBlob();
      let formData = new FormData();
      formData.append('file', blobPdf);      
     
      formData.append('path', './' + folder); // guarda archivo en carpeta
      formData.append('fileName', nombreLiq(Liquidacion?.fecha));     

      savePDF_3_of_3({formData});
      
    
  }

  var qntDecimals = 1;

  const LiqDocument = () => {
    return (
      <RepLiquidacion qntDecimals={qntDecimals} conceptosPago={conceptosPago}  conceptosCuota={conceptosCuota} data={data} apiServerUrl={apiServerUrl} />
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
          
          // refetch() 
          let q = parseInt(qntFiles) + 1;
          setMsg("Archivos generados: " + q);
          setQntFiles(qntFiles + 1);

        }
      }     
);

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

  

  return (
    
     <>
     <Formik
        initialValues={{
          fecha: null,
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {

          if(fideInForm?.id > 0 && perInForm?.id > 0){
            genLiquidacion_0_of_3();
          }

          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

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
                  acumLiqui('fide', newValue);
                }}
                value={fideInForm}
                getOptionLabel={option => option.nombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(fideicomisos? fideicomisos:[])}
                renderInput={params => <TextField {...params} label='Fideicomiso *' />}
              />


            <Field
                as={Autocomplete}
                size={'small'}
                label='Periodo'
                title="Seleccione un Periodo."
                disablePortal
                required
                style={{ width: '160px', display: 'inline-flex' }}
                onChange={(event, newValue) => {
                  setPerInForm(newValue);
                  acumLiqui('per', newValue);
                }}
                value={perInForm}
                getOptionLabel={option => ("" + option.periodo).slice(0,4) + "-" + ("" + option.periodo).slice(4,6) }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(periodos? periodos:[])}
                renderInput={params => <TextField {...params} label='Periodo' />}
              />

            <Button type="submit" disabled={isSubmitting}>
              Generar
            </Button>
         
            <Typography align="left" color="textPrimary" variant="h4">
              &nbsp;
            </Typography>

            <Typography align="left" color="textPrimary" variant="h4">
              {msg}
            </Typography>

          </Form>

          
        )}
      </Formik>
      <Prompt
        message="Descripción, fecha no puede estar en blanco"
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
        renderInput={params => <TextField required size="small" {...params} />}
      />
    </LocalizationProvider>
  );
}

