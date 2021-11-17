import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (setIsPromptOpen, Prompt) => [
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
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { onDelete } }) => (
      <>
        <DeleteIcon
          onClick={() => {
            setIsPromptOpen(true);
          }}
        />
        <Prompt message="¿Eliminar fila?" action={onDelete} />
      </>
    ),
  },
];

export function GrillaCac({ idSociety }) {
  const { Prompt, setIsPromptOpen } = usePrompt();

  const {
    data: cacInformation,
    isLoading,
    error,
  } = useQuery(['cac', idSociety], () => getMethod(`CAC/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idCac => await deleteMethod(`cac/eliminar/${idSociety.id}`, { id: idCac }),
    {
      onMutate: async id => {
        await queryClient.cancelQueries(['cac', idSociety]);
        const prevData = queryClient.getQueryData(['cac', idSociety]);
        const newData = prevData.filter(cac => cac.id !== id);
        queryClient.setQueryData(['cac', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cac', idSociety], context),
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
        <DataGrid
          rows={cacInformation.map(el => ({
            id: el.id,
            fecha: el.fecha,
            estimado: el.estimado,
            definitivo: el.definitivo,
            onDelete: () => console.log(el.id),
          }))}
          onCellEditCommit={modifyData}
          columns={columns(setIsPromptOpen, Prompt)}
          pageSize={25}
          disableSelectionOnClick
          autoHeight
          sortModel={[
            {
              field: 'fecha',
              sort: 'asc',
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
