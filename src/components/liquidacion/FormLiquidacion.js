import { TextField, Button } from '@mui/material';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext, ConceptosPagoContext, ConceptosCuotaContext, LetrasContext } from 'src/App';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { date_to_YYYYMMDD, DB_to_MMMAAAA } from 'src/utils/utils';
import RepLiquidacion from "src/components/reportes/liquidaciones/liquidacion";
import { pdf } from "@react-pdf/renderer";

const apiServerUrl = process.env.REACT_APP_API_SERVER;


export function FormLiquidacion({ contrato, productos, cesion, qCuotasARS, qCuotasUSD, loggedUser, refetch  }) {
 

  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();
  
  
  var letras = useContext(LetrasContext);
  var conceptosPago = useContext(ConceptosPagoContext);  
  var conceptosCuota = useContext(ConceptosCuotaContext);

  var data = null;

  // En el click del boton "AGREGAR"
  // Paso 1: Graba en tabla liquidaciones un registro con su JSON
  // Paso 2: createPDF_2_of_4 formData es el archivo y los parametros (usando el reporte de liquidaciones)
  // Paso 3: savePDF_3_of_4 guarda el pdf en sociedades/sociedadId/liquidaciones

  var folder = `sociedades/${idSociety.id}/liquidaciones/`;
  const { mutate: addLiquidacion_1_of_3 } = useMutation(
    Liquidacion => postMethod(`liquidacion/agregar/${idSociety.id}`, Liquidacion),
    {
      onMutate: async Liquidacion => {
        Liquidacion.creador = parseInt(loggedUser.id);

        await queryClient.invalidateQueries(['liquidacion', idSociety]);
        const prevData = await queryClient.getQueryData(['liquidacion', idSociety]);

        return prevData;

      },
      onError: (err, id, context) => queryClient.setQueryData(['liquidacion', idSociety], context),
      onSettled: (Liquidacion) => {

        data = {cont: contrato, liq: Liquidacion, cesion: cesion, productos: productos, letras:letras, qCuotasARS:qCuotasARS, qCuotasUSD:qCuotasUSD};
       
        if(idSociety.id > 0) {
          createPDF_2_of_3(Liquidacion);
        }  
     
      }
    }
  );

  function nombreLiq(fecha){
    let n = contrato?.fideicomisos[0]?.nombre + "-" + cesion?.nombre ;
    return "Liquidacion-" + n.replace(/ /g,"_") + "-Adhesion_" + contrato?.id + "-" + DB_to_MMMAAAA(fecha);
  
  }
  const createPDF_2_of_3 = async (Liquidacion) =>   {

    // GANANCIAS
    // Si existe una retencion en Ganancias
    // if(retencionGAN > 0.1){    

      let blobPdf = await pdf(LiqDocument()).toBlob();
      let formData = new FormData();
      formData.append('file', blobPdf);      
     
      formData.append('path', './' + folder); // guarda archivo en carpeta
      formData.append('fileName', nombreLiq(Liquidacion?.fecha));     

      savePDF_3_of_3({formData});
      
    // }
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
          refetch() 
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
          
          addLiquidacion_1_of_3({         
            
            fechaLiquidacion: date_to_YYYYMMDD(values?.fecha), 
            tasaPunitoria: contrato?.fideicomisos[0]?.tasaPunitoria,
            qntDias: contrato?.fideicomisos[0]?.qntDias,            
            contrato: {id: contrato?.id, nombre: contrato?.nombre, fideicomisoId: contrato?.fideicomisoId, adhesion: contrato?.adhesion},
            link: apiServerUrl + folder + nombreLiq(date_to_YYYYMMDD(values?.fecha)),
       
            creador: loggedUser.id
          });
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field component={Picker} label="Fecha" type="date" name="fecha" />

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
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

