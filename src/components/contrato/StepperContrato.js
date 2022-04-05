import * as React from 'react';
import { useState } from 'react';
import {Box, Container} from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useQuery} from 'react-query';
import { getMethod } from 'src/utils/api';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormContrato } from 'src/components/contrato/FormContrato';

const steps = ['Seleccione fideicomiso y fiduciante', 'Seleccione uno o mas productos', 'Campos adicionales y finalizar'];

export function StepperContrato({setActTab, idSociety, loggedUser, dataFide, isLoading, error, refetch, fideicomisoId }) {

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listar/${idSociety.id}`));

  const { data: empresas } = useQuery(
    ['empresas'],
    () => getMethod(`empresa/listar/${idSociety.id}/1`));

  const { data: personas } = useQuery(
    ['persona'],
    () => getMethod(`persona/listar/${idSociety.id}`));


  const isStepOptional = (step) => {
    return step === 99; // 1 significa step 1 opcional
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    
    if(activeStep===1){
      setIniNombre(right[0]?.codigo);
    }
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

  const [fideInForm, setFideInForm] = useState(null);
  const [fiduInForm, setFiduInForm] = useState(null);
  //const [prodInForm, setProdInForm] = useState(null);
  const [right, setRight] = React.useState([]);
  const [iniNombre, setIniNombre] = React.useState('');

  let paso1 = false;
  if(activeStep ===0 && fideInForm?.id > 0 && fiduInForm?.id > 0){paso1 = true;}
  let paso2 = false;
  if(activeStep ===1 && right?.length > 0 ){paso2 = true;}
  
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
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
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Container >
            <Box sx={{ pt: 3 }}>

              <FormContrato 
                setActTab={setActTab}
                iniNombre={iniNombre}
                setIniNombre={setIniNombre}
                fideInForm={fideInForm}
                setFideInForm={setFideInForm}
                fiduInForm={fiduInForm}
                setFiduInForm={setFiduInForm}
                right={right}
                setRight={setRight}
                activeStep={activeStep}
                idSociety={idSociety} 
                loggedUser={loggedUser} 
                fideicomisos={fideicomisos} 
                empresas={empresas} 
                personas={personas} 
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>

              <Box sx={{ flex: '1 1 auto' }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}

              {//paso 1 ok
              paso1 &&(
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}

              {//paso 2 ok
              paso2 &&(
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}

              {// No ok
              activeStep < steps.length - 1 && !paso1 && !paso2 &&(
                <Button disabled onClick={handleNext}>
                  Next
                </Button>
              )}

              {// Es el ultimo
              activeStep === steps.length - 1 && (
                <Button disabled onClick={handleNext}>
                  Fin
                </Button>
              )}



            </Box>
          </Container>
        </React.Fragment>
      )}
    </Box>
  );
}