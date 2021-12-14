import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { getMethod, postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

import { mostrarFecha } from 'src/utils/utils';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'createdAt',
    headerName: 'Fecha',
    editable: false,
    width: 120,
    type: 'date',
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => mostrarFecha(value),
  },

  {
    field: 'fideicomiso',
    headerName: 'Fideicomiso',
    editable: false,
    width: 155,
    headerAlign: 'center',
    align: 'center',
  },

  {
    field: 'numero',
    headerName: 'Numero',
    editable: false,
    width: 130,
    headerAlign: 'center',
    align: 'right',
  },

  {
    field: 'empresa',
    headerName: 'Razón Social',
    editable: false,
    width: 160,
    headerAlign: 'center',
    align: 'center',
  },  
  {
    field: 'monto',
    headerName: 'Monto',
    editable: false,
    width: 125,
    headerAlign: 'center',
    align: 'right',
    valueFormatter: ({ value }) =>
    new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(value)),
  },
  {
    field: 'moneda',
    headerName: '',
    editable: false,
    width: 60,
    headerAlign: 'center',
    align: 'left',    
  },
  {
    field: 'PriceCheckIcon',
    headerName: ' ',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { authId } }) => (
      <PriceCheckIcon
        onClick={e => {

          setRowIdToDelete(authId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },

];

export function GrillaOPObra({ idSociety,  loggedUser }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  // console.log(rowIdToDelete);

  const {
    data: opObraInformation,
    isLoading,
    error,
  } = useQuery(['OPobra', idSociety], () => getMethod(`OP/listar/${idSociety.id}/authObra/nulo`));


  const queryClient = useQueryClient();

  const { mutate: authFila } = useMutation(
    async id =>
      await postMethod(`autorizacion/agregar/${idSociety?.id}`, {

        opid : id,
        documento: 'op',
        tipoAutorizacion: 'obra',
        creador: loggedUser.id

      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['OPobra', idSociety]),
    }

  );
  

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`OP/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['OPobra', idSociety]);
        const prevData = queryClient.getQueryData(['OPobra', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(OP => OP.id !== id),
          { ...prevData.find(OP => OP.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['OPobra', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['OPobra', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['OPobra', idSociety]),
    }
  );

  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
      <div style={{ width: '100%' }}>
        <Prompt message="¿Autorizar fila?" action={() => authFila(rowIdToDelete)} />
        <DataGrid
          rows={opObraInformation.map(OP => ({
            id: OP.id,        
            numero: OP.numero,
            empresa: OP.empresas[0].razonSocial,
            monto: OP.monto,
            moneda: OP.moneda,         
            fideicomiso: OP.fideicomisos[0].nombre,          
            apr_obra: (OP.auth_obra[0]?OP.auth_obra[0].usuarios[0].user:''),
            apr_adm: (OP.auth_adm[0]?OP.auth_adm[0].usuarios[0].user:''),
            createdAt: OP.createdAt,
            authId: OP.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(setIsPromptOpen, setRowIdToDelete)}
          pageSize={25}
          disableSelectionOnClick
          autoHeight
          scrollbarSize
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
