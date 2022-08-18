import * as React from 'react';
import { useState, useContext } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { TipoProductosContext} from 'src/App';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { SocietyContext } from 'src/App';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (acceso, setIsPromptOpen, setRowIdToDelete) => [
  
  {
    field: 'codigo',
    headerName: 'Código',
    headerAlign: 'center',
    width: 200,
    editable: false,
  },
  {
    field: 'tipo',
    headerName: 'Tipo de producto',
    width: 240,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },

  {
    field: 'deleteIcon',
    headerName: '',
    width: 50,
    hide: !acceso,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleteId } }) => (
      <DeleteIcon
        onClick={e => {

          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },

];


export function GrillaItem({ loggedUser, items, refetch}) {

  const idSociety = useContext(SocietyContext);
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var acceso = true;
  if(loggedUser?.['rol.contrato'] ==='vista'){acceso =false}

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idItem => await postMethod(`producto/modificar/${idSociety.id}`, { id: idItem, contratoId: null}),
    {
      onMutate: async idItem => {
        console.log(333333, idItem);
        await queryClient.cancelQueries(['producto', idSociety]);
        const prevData = queryClient.getQueryData(['producto', idSociety]);
        //const newData = prevData.filter(item => item.id !== idItem);
        //queryClient.setQueryData(['cuota', idSociety], newData);
        return prevData;
      },
      onError: (err, idItem, context) => queryClient.setQueryData(['producto', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['producto', idSociety])
        }
        refetch()        
      }
    }
  );


  var tipoProductos = useContext(TipoProductosContext);

    return (
      <div style={{ width: '100%' }}>
        <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >
         

          <Grid item md={7}>
            <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
            <DataGrid
              rows={items.map(item => ({
                id: item.id,
                codigo: item.codigo,
                tipo: tipoProductos?.find(t => t.id === item.tipo)?.descripcion,
                deleteId: item?.id,
              }))}

              hideFooter
            
              columns={columns(acceso, setIsPromptOpen, setRowIdToDelete)}

              disableSelectionOnClick
              autoHeight              
            />
          </Grid>
        </Grid>  
      </div>
    );
}
