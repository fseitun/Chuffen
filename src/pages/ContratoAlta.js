import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';


/* Fico no me funciono el estilo, si queres borralo
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));*/

function getSteps() {
  return ['Paso 1', 'Paso 2','Paso 3','Paso 4','Paso 5'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Ingrese un Fiduciante';
    case 1:
      return 'Elija un Fideicomiso';
    case 2:
      return 'Elija los productos (Ej: UF + Cochera + Baulera)';
    case 3:
      return 'Ingrese los compromisos de pago en dolares (Si el 100% en pesos, click en continuar)';
    case 4:
      return 'Ingrese los compromisos de pago en Pesos (Si el 100% en click, click en continuar)';
    default:
      return 'Unknown step';
  }
}

function getStepContent2(step) {
  let r = 'Algo ...';
  if(step==3 ||step==4 ) {
        r = 'Ingrese Anticipo y su fecha. ';
        r +='Ingrese valor de cuota y fecha de la primera cuota. ';
        r +='Ingrese cantidad de cuotas. ';
        r +='Ingrese frecuencia de pago (Mensual, bimensual). ';    
  }
  return r;
}
export function ContratoAlta() {

  // const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return false; //(step === 3 || step === 4);
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return ( 

    <div> 
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography>              
              El Contrato se genero correctamente
            </Typography>
            <Typography>              
              Desea ir al contrato?
            </Typography>
            <Typography>              
              Desea Ingresar pagos generados por el Fiduciante tales como el anticipo?
            </Typography>            
          </div>
        ) : (
          <div>
            <Typography 
              // className={classes.instructions}
              >
                <Box sx={{ pt: 3 }}>
                    {getStepContent(activeStep)}

                </Box> 
                <Box sx={{ pt: 3 }}>
                    {getStepContent2(activeStep)}
                    
                </Box> 
                
                        
                
           
            </Typography>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} >
                Atras
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}>
                  Skip
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Generar Contrato' : 'Siguiente'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}

ContratoAlta.propTypes = {
  // idSociedad: PropTypes.number,
};
