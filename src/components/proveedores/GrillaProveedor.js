import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarCUIT } from 'src/utils/utils';

const columns = (rubros, subRubros, setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'razonSocial',
    headerName: 'Razón Social',
    width: 170,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'CUIT',
    headerName: 'CUIT',
    width: 130,
    // editable: true,
    headerAlign: 'center',
    valueFormatter: ({ value }) => mostrarCUIT(value),
  },
  {
    field: 'telefono',
    headerName: 'Teléfono',
    width: 140,
    editable: true,
    headerAlign: 'center',
    valueFormatter: ({ value }) => {
      if (value) {
        value = value.split('');
        value.splice(2, 0, '-');
        value.splice(7, 0, '-');
        return value.join('');
      }
    },
  },
  {
    field: 'mail',
    headerName: 'Mail',
    width: 150,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'CBU',
    headerName: 'CBU',
    width: 200,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'banco',
    headerName: 'Banco',
    width: 120,
    editable: true,
    headerAlign: 'center',
  },
  {
    field: 'nroCuenta',
    headerName: '# Cuenta',
    width: 140,
    editable: true,
    headerAlign: 'center',
  },

  {
    field: 'rubroId',
    headerName: 'Rubro',
    width: 140,
    editable: true,
    // renderCell: ({ value }) => value.nombre,
    renderEditCell: props => <ComboBox rubros={rubros} props={props} />,
    headerAlign: 'center',
  },

  {
    field: 'subrubroId',
    headerName: 'Sub Rubro',
    width: 140,
    editable: true,
    // renderCell: ({ value }) => value.nombre,
    renderEditCell: props => <ComboBoxSub subRubros={subRubros} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'enviar_OP_auto',
    headerName: 'Enviar',
    type: 'boolean',
    width: 50,
    editable: true,
    headerAlign: 'center',
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
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];


export function GrillaProveedor({ idSociety }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  const {
    data: proveedorInformation,
    isLoading,
    error,
  } = useQuery(['proveedor', idSociety], () => getMethod(`proveedor/listar/${idSociety.id}`));

  const queryClient = useQueryClient();

  const { data: rubros } = useQuery(['rubros', idSociety], () =>
    getMethod(`rubro/listar/${idSociety.id}`)
  );


  const { data: subRubros } = useQuery(['subrubros', idSociety], () =>
    getMethod(`subrubro/listar/${idSociety.id}/0`)
  );

  const { mutate: eliminate } = useMutation(
    async idProveedor => await deleteMethod(`proveedor/eliminar/${idSociety.id}`, { id: idProveedor }),
    {
      onMutate: async idProveedor => {
        await queryClient.cancelQueries(['proveedor', idSociety]);
        const prevData = queryClient.getQueryData(['proveedor', idSociety]);
        const newData = prevData.filter(proveedor => proveedor.id !== idProveedor);
        queryClient.setQueryData(['proveedor', idSociety], newData);
        return prevData;
      },
      onError: (err, idProveedor, context) => queryClient.setQueryData(['proveedor', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['proveedor', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`proveedor/modificar/${idSociety.id}`, {
        id,
        [field]: value,
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['proveedor', idSociety]);
        const prevData = queryClient.getQueryData(['proveedor', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(proveedor => proveedor.id !== id),
          { ...prevData.find(proveedor => proveedor.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['proveedor', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['proveedor', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['proveedor', idSociety]),
    }
  );

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'razonSocial',
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
    }
    setSortModel(newSort);    
  };

  const [pageSize, setPageSize] = useState(25);
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
      <div style={{ width: '100%' }}>
        <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
        <DataGrid
          rows={proveedorInformation.map(proveedor => ({
            id: proveedor.id,
            rubroId: rubros?.find(rubro => rubro.id === proveedor.rubroId)?.rubro,
            rubro_filtro: proveedor.rubroId,
            subrubroId: subRubros?.find(subRubro => subRubro.id === proveedor.subrubroId)?.subRubro,
           
            razonSocial: proveedor.razonSocial,
            CUIT: proveedor.CUIT,
            mail: proveedor.mail,
            telefono: proveedor.telefono,
            CBU: proveedor.CBU,
            banco: proveedor.banco,
            nroCuenta: proveedor.nroCuenta,        

            enviar_OP_auto: proveedor.enviar_OP_auto,
            deleteId: proveedor.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(rubros, subRubros, setIsPromptOpen, setRowIdToDelete)}
          
          sortModel={sortModel}
          onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
       
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          pagination

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
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: ['razonSocial', 'CUIT', 'mail', 'telefono', 'CBU', 'banco', 'nroCuenta','rubroId','subrubroId'] }} />
    </GridToolbarContainer>
  );
}

function ComboBox({ rubros, props }) {
  const { id, api, field } = props;

  rubros = [
    ...rubros,
    {
      rubro: '',
    },
  ];
  const [selectedRubro, setSelectedRubro] = useState({
    rubro: '',
  });

  return (
    <Autocomplete
      value={selectedRubro}
      onChange={async (event, newValue) => {
        
        setSelectedRubro(newValue);
     
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      // disablePortal
      id="combo-box-demo"
      options={rubros}
      isOptionEqualToValue={(op, val) => op.rubro === val.rubro}
      getOptionLabel={option => option.rubro}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="Rubro" />}
    />
  );
}

function ComboBoxSub({ subRubros, props }, params) {
  const { id, api, field } = props;

  subRubros = [
    
    ...subRubros.filter(subR => subR.rubroId === parseInt(props?.row?.rubro_filtro)),
    {
      subRubro: '',
    },
  ];

  const [selectedsubRubro, setSelectedsubRubro] = useState({
    subRubro: '',
  });

  return (
    <Autocomplete
      value={selectedsubRubro}
      onChange={async (event, newValue) => {
        
        setSelectedsubRubro(newValue);
      
        
        api.setEditCellValue({ id, field, value: newValue.id }, event);
        await props.api.commitCellChange({ id, field });
        api.setCellMode(id, field, 'view');
      }}
      // disablePortal
      id="combo-box-demo"
      options={subRubros}
      isOptionEqualToValue={(op, val) => op.subRubro === val.subRubro}
      getOptionLabel={option => option.subRubro}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label="subRubro" />}
    />
  );
}

