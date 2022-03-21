import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { Autocomplete, TextField, Box } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

const columns = (setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'user',
    headerName: 'Usuario',
    // headerClassName: 'super-app-theme--header',
    width: 170,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'mail',
    headerName: 'Mail',
    width: 220,
    headerAlign: 'center',
  },
  {
    field: 'pass',
    headerName: 'Clave',
    width: 150,
    editable: true,
    sortable: false,
    filterable: false,
    headerAlign: 'center',
    renderCell: Passformat,
  },
  {
    field: 'rolId',
    headerName: 'Rol',
    editable: true,
    width: 160,
    // hide: true,
    renderEditCell: props => <ComboBox roles={roles} props={props} />,
    headerAlign: 'center',
  },

  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    sortable: false,
    filterable: false,
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

const roles = [  
  { id: 1, rol_descripcion: 'administrativo' },
  { id: 2, rol_descripcion: 'obra' },
  { id: 3, rol_descripcion: 'manager' },
  { id: 4, rol_descripcion: 'vista' },
  { id: 5, rol_descripcion: 'blue' },
];

export function GrillaUsuario({ idSociety }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  const {
    data: usuarioInformation,
    isLoading,
    error,
  } = useQuery(['usuario', idSociety], () => getMethod(`usuario/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { mutate: eliminate } = useMutation(
    async idUsuario => await deleteMethod(`usuario/eliminar/${idSociety.id}`, { id: idUsuario }),
    {
      onMutate: async idUsuario => {
        await queryClient.cancelQueries(['usuario', idSociety]);
        const prevData = queryClient.getQueryData(['usuario', idSociety]);
        const newData = prevData.filter(usuario => usuario.id !== idUsuario);
        queryClient.setQueryData(['usuario', idSociety], newData);
        return prevData;
      },
      onError: (err, idUsuario, context) => queryClient.setQueryData(['usuario', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['usuario', idSociety]),
    }
  );
  // eliminate(1);

  const { mutate: modifyData } = useMutation(
      async ({ field, id, value }) => 
          await postMethod(`usuario/modificar/${idSociety.id}`, {
            id,
            [field]: value,
          }),
          
        {
          onMutate: async ({ field, id, value }) => {
            await queryClient.cancelQueries(['usuario', idSociety]);
            const prevData = queryClient.getQueryData(['usuario', idSociety]);
            // console.log('prevData', prevData);
            const newData = [
              ...prevData.filter(usuario => usuario.id !== id),
              { ...prevData.find(usuario => usuario.id === id), [field]: value },
            ];
            // console.log('newData', newData);
            queryClient.setQueryData(['usuario', idSociety], newData);
            return prevData;
          },
          onError: (err, id, context) => queryClient.setQueryData(['usuario', idSociety], context),
          onSettled: () => queryClient.invalidateQueries(['usuario', idSociety]),
        }     
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'user',
      sort: 'asc',
    },
  ]);

  const onSort = (newSort) => {

    if(newSort.length === 0){
      newSort.push(sortModel[0]);
      if(sortModel[0]?.sort === 'asc'){
        newSort[0].sort = 'desc';
      }else{
        newSort[0].sort = 'asc';
      }
    }/*
    else if(newSort[0]?.field === 'rolId'){

      newSort[0].field = 'sort_' + newSort[0].field;
      if(sortModel[0]?.field === 'sort_rolId'){ 
        
        if(sortModel[0]?.sort === 'asc'){
          newSort[0].sort = 'desc';
        }else{
          newSort[0].sort = 'asc';
        }

      }  

    }*/

    setSortModel(newSort);
    
  };

  const [pageSize, setPageSize] = useState(25);

  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
      <div style={{height: '100%', width: '100%' }}>
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />

        <Box
          /* sx={{
            height: 300,
            width: 1,
            '& .super-app-theme--header': {
              backgroundColor: 'rgba(255, 7, 0, 0.55)',
            },
          }}*/
        >

    
        <DataGrid

          sortModel={sortModel}
          rows={usuarioInformation.map(usuario => ({
            id: usuario.id,
            user: usuario.user,
            mail: usuario.mail,
            pass: usuario.pass,
            rolId: usuario['rol.descripcion'],
            deleteId: usuario.id,
          }))}

          onCellEditCommit={modifyData}
          columns={columns(setIsPromptOpen, setRowIdToDelete)}
          onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
       
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          pagination

          autoHeight={true}
          disableSelectionOnClick
          
          scrollbarSize

          components={{
            Toolbar: CustomToolbar,
          }}
        
        />
        </Box>
      </div>
    );
}

function ComboBox({ roles, props }) {
  const { id, api, field } = props;

  roles = [
    ...roles,
    {
      rol_descripcion: '',
    },
  ];
  const [selectedRol, setSelectedRol] = useState({
    rol_descripcion: '',
  });

  return (
    <Autocomplete
      value={selectedRol}
      onChange={async (event, newValue) => {        
        setSelectedRol(newValue);
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}      
      id="combo-box-demo"
      options={roles}
      isOptionEqualToValue={(op, val) => op.rol_descripcion === val.rol_descripcion}
      getOptionLabel={option => option.rol_descripcion}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="Rol" />}
    />
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['user', 'mail', 'rolId'] }} />
    </GridToolbarContainer>
  );
}

function Passformat(params) {
  //const sendRow = params.row.onIrDetalle;  
  //const empresa = params.row.empresa;
  return '***********';
} 
