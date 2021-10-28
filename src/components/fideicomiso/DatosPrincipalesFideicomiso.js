import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Autocomplete,
  createFilterOptions,
  Dialog,
  DialogContent,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMutation, useQuery } from 'react-query';
import { getMethod, postMethod } from 'src/utils/api';

const filter = createFilterOptions();

export function DatosPrincipalesFideicomiso({ selectedFideicomisoData, idSociety }) {
  // console.log('params:', params);
  // console.log('selectedFideicomisoData:', selectedFideicomisoData);
  // console.log('selectedFideicomisoData.personaId:', selectedFideicomisoData.personaId);
  // console.log('idSociety:', idSociety);
  const [managerId, setManagerId] = useState();
  useEffect(() => setManagerId(selectedFideicomisoData?.personaId), [selectedFideicomisoData]);
  // console.log('selectedFideicomisoData:', selectedFideicomisoData);
  // console.log('managerId:', managerId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: contactInfo } = useQuery(['persona', managerId], () =>
    getMethod(`persona/mostrar/${idSociety.id}/${managerId}`)
  );

  const { data: directionInfo } = useQuery(
    ['localización', selectedFideicomisoData?.localizacionId],
    () =>
      getMethod(`localizacion/mostrar/${idSociety.id}/${selectedFideicomisoData?.localizacionId}`)
  );

  const { data: peopleInfo } = useQuery(['personas'], () =>
    getMethod(`persona/listar/${idSociety.id}`)
  );

  const { mutate: setManagerInFideicomiso } = useMutation(newData =>
    postMethod(`fideicomiso/modificar/${idSociety.id}`, newData)
  );

  const { mutate: addNewPerson } = useMutation(
    newData => postMethod(`persona/agregar/${idSociety.id}`, newData),
    {
      onSuccess: data => {
        setManagerId(data.id);
        setManagerInFideicomiso({
          id: selectedFideicomisoData.id,
          personaId: data.id,
        });
      },
    }
  );
  // console.log('contactInfo:', contactInfo);

  const rows = [
    {
      id: 1,
      contacto: contactInfo?.nombre,
      fechaInicio: selectedFideicomisoData?.fechaInicio,
      fechaFin: selectedFideicomisoData?.fechaFin,
      direccion: directionInfo?.direccion,
    },
  ];

  const columns = [
    {
      field: 'contacto',
      headerName: 'Contacto',
      width: 350,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'fechaInicio',
      headerName: 'Inicio',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'date',
      nameFormatter: ({ name }) =>
        new Date(name).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'short',
          timeZone: 'UTC',
        }),
      editable: true,
    },
    {
      field: 'fechaFin',
      headerName: 'Fin',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      type: 'date',
      nameFormatter: ({ name }) =>
        new Date(name).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'short',
          timeZone: 'UTC',
        }),
      editable: true,
    },
    {
      field: 'direccion',
      headerName: 'Dirección',
      width: 200,
      editable: false,
      headerAlign: 'center',
      align: 'center',
    },
  ];
  return (
    <>
      <AlertDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      <Box width={'auto'}>
        <Typography align="left" color="textPrimary" variant="h3">
          {selectedFideicomisoData?.nombre}
        </Typography>
        {selectedFideicomisoData && (
          <DataGrid
            columns={columns}
            rows={rows}
            rowHeight={75}
            headerHeight={35}
            hideFooter
            autoHeight={'false'}
            pageSize={1}
            onCellDoubleClick={e => {
              if (e.field === 'contacto') {
                setIsDialogOpen(true);
                // console.log('isDialogOpen:', isDialogOpen);
              }
            }}
          />
        )}
      </Box>
    </>
  );

  function AlertDialog({ isDialogOpen, setIsDialogOpen }) {
    return (
      <>
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          fullWidth
          style={{ transform: 'translate(0, -200px)' }}
        >
          <DialogContent>
            <Select peopleInfo={peopleInfo} closeDialog={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  function Select({ peopleInfo, closeDialog }) {
    return (
      <Autocomplete
        value={contactInfo?.nombre}
        onChange={(event, newName) => {
          if (typeof newName === 'string') {
            //agrego desde el teclado sin ir a agregar
            addNewPerson({ nombre: newName });
            closeDialog();
          } else if (newName && newName.inputValue) {
            //agrego nuevo yendo a "agregar" en el dd
            addNewPerson({ nombre: newName.inputValue });
            closeDialog();
          } else {
            //elijo opción del dd
            if (newName?.id !== managerId) {
              setManagerId(newName.id);
              setManagerInFideicomiso({
                id: selectedFideicomisoData.id,
                personaId: newName.id,
              });
              closeDialog();
            }
          }
        }}
        filterOptions={(options, params) => {
          // console.log('options:', options);
          const filtered = filter(options, params);
          const { inputValue } = params;
          const isExisting = options.some(option => inputValue === option.nombre);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              nombre: `agregar ${inputValue}`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={peopleInfo}
        getOptionLabel={option => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.nombre;
        }}
        renderOption={(props, option) => <li {...props}>{option.nombre}</li>}
        freeSolo
        renderInput={params => <TextField {...params} />}
      />
    );
  }
}
