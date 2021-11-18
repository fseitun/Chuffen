import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) =>
      new Date(value).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
  },
  {
    field: 'estimado',
    headerName: 'Estimado',
    width: 150,
    editable: true,
    headerAlign: 'center',
    align: 'right',
    preProcessEditCellProps: onlyNumbers,
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'definitivo',
    headerName: 'Definitivo',
    width: 150,
    editable: true,
    headerAlign: 'center',
    align: 'right',
    preProcessEditCellProps: onlyNumbers,
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleteId } }) => (
      <DeleteIcon
        onClick={e => {
          // console.log('e', e);
          // console.log('deleteId', deleteId);
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];

export function GrillaCac({ idSociety }) {
  const { Prompt, setIsPromptOpen } = usePrompt();
  const [rowIdToDelete, setRowIdToDelete] = useState();

  const {
    data: cacInformation,
    isLoading,
    error,
  } = useQuery(['cac', idSociety], () => getMethod(`CAC/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idCac => await deleteMethod(`cac/eliminar/${idSociety.id}`, { id: idCac }),
    {
      onMutate: async idCac => {
        await queryClient.cancelQueries(['cac', idSociety]);
        const prevData = queryClient.getQueryData(['cac', idSociety]);
        const newData = prevData.filter(cac => cac.id !== idCac);
        queryClient.setQueryData(['cac', idSociety], newData);
        return prevData;
      },
      onError: (err, idCac, context) => queryClient.setQueryData(['cac', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['cac', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`cac/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['cac', idSociety]);
        const prevData = queryClient.getQueryData(['cac', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(cac => cac.id !== id),
          { ...prevData.find(cac => cac.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['cac', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cac', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['cac', idSociety]),
    }
  );

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
      <div style={{ width: '100%' }}>
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
        <DataGrid
          rows={cacInformation.map(cac => ({
            id: cac.id,
            fecha: cac.fecha,
            estimado: cac.estimado,
            definitivo: cac.definitivo,
            deleteId: cac.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(setIsPromptOpen, setRowIdToDelete)}
          pageSize={25}
          disableSelectionOnClick
          autoHeight
          sortModel={[
            {
              field: 'fecha',
              sort: 'desc',
            },
          ]}
          scrollbarSize
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    );

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
}

function onlyNumbers(data) {
  console.log('data', data);
  const regex = /^\d{0,4}(\.\d{0,2})?$/;
  const isValid = regex.test(data.props.value.toString());
  const error = !isValid;
  return { ...data.props, error };
}
