import * as React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { mostrarCUIT } from 'src/utils/utils';
import { useContext } from 'react';
import { CondicionIVAContext, CategoriasComboContext} from 'src/App';

const columns = (colVisibles, puedeEditar, categorias, condicion_de_IVA, tipo, rubros, subRubros, setIsPromptOpen, setRowIdToDelete) => [
  {
    field: 'id',
    headerName: 'id',
    width: 60,
    hide: colVisibles?.find(i => i.c === 'id').h,
    editable: false,
    headerAlign: 'center',
  },

  {
    field: 'razonSocial',
    headerName: 'Razón Social',
    width: 170,
    hide: colVisibles?.find(i => i.c === 'razonSocial').h,
    editable: puedeEditar,
    headerAlign: 'center',
  },
  {
    field: 'CUIT',
    headerName: 'CUIT',
    width: 130,
    hide: colVisibles?.find(i => i.c === 'CUIT').h,
    editable: true,
    headerAlign: 'center',
    valueFormatter: ({ value }) => mostrarCUIT(value),
  },
  {
    field: 'rubroId',
    headerName: 'Rubro',
    width: 140,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'rubroId').h,
    // renderCell: ({ value }) => value.nombre,
    renderEditCell: props => <ComboBoxRu rubros={rubros} props={props} />,
    headerAlign: 'center',
  },

  {
    field: 'condIVA',
    headerName: 'Cond. IVA',
    width: 200,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'condIVA').h,
    renderEditCell: props => <ComboBox listItems={condicion_de_IVA} label={"Condicion frente a IVA"} props={props} />,
    headerAlign: 'center',
  },

  {
    field: 'ganancias',
    headerName: 'Ganancias',
    type: 'boolean',
    width: 160,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'ganancias').h,
    headerAlign: 'center',
  },

  {
    field: 'categoria',
    headerName: 'Categoria',
    width: 200,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'categoria').h,
    renderEditCell: props => <ComboBox listItems={categorias} label={"Categoria"} props={props} />,
    headerAlign: 'center',
  },

  {
    field: 'esRetSUSS',
    headerName: 'Ret SUSS',
    type: 'boolean',
    width: 160,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'esRetSUSS').h,
    headerAlign: 'center',
  },
  {
    field: 'esRetIVA',
    headerName: 'Ret IVA',
    type: 'boolean',
    width: 160,
    hide: true, 
    editable: puedeEditar,
    // hide: (tipo===1) || colVisibles?.find(i => i.c === 'esRetIVA').h,
    headerAlign: 'center',
  },

  {
    field: 'CBU',
    headerName: 'CBU',
    width: 200,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'CBU').h,
    headerAlign: 'center',
  },
  {
    field: 'banco',
    headerName: 'Banco',
    width: 120,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'banco').h,
    headerAlign: 'center',
  },
  {
    field: 'nroCuenta',
    headerName: '# Cuenta',
    width: 140,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'nroCuenta').h,
    headerAlign: 'center',
  },

  {
    field: 'telefono',
    headerName: 'Teléfono',
    width: 140,
    hide: colVisibles?.find(i => i.c === 'telefono').h,
    editable: puedeEditar,
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
    hide: colVisibles?.find(i => i.c === 'mail').h,
    editable: puedeEditar,
    headerAlign: 'center',
  },




  {
    field: 'subrubroId',
    headerName: 'Sub Rubro',
    width: 140,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'subrubroId').h,
    // renderCell: ({ value }) => value.nombre,
    renderEditCell: props => <ComboBoxSub subRubros={subRubros} props={props} />,
    headerAlign: 'center',
  },
  {
    field: 'enviar_OP_auto',
    headerName: 'Enviar',
    type: 'boolean',
    width: 120,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'enviar_OP_auto').h,
    headerAlign: 'center',
  },
  {
    field: 'actividad',
    headerName: 'Actividad',
    type: 'singleSelect',
    valueOptions: ['limpieza', 'seguridad', 'otra'],
    width: 150,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'actividad').h,
    headerAlign: 'center',
  },

  {
    field: 'domicilio',
    headerName: 'Domicilio',
    width: 200,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'actividad').h,
    headerAlign: 'center',
  },
  
  
  {
    field: 'esProveedor',
    headerName: 'Es Provee.',
    type: 'boolean',
    width: 160,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'esProveedor').h,
    headerAlign: 'center',
  },
  {
    field: 'esFiduciante',
    headerName: 'Es Fidu',
    type: 'boolean',
    width: 160,
    editable: puedeEditar,
    hide: (tipo===1) || colVisibles?.find(i => i.c === 'esFiduciante').h,
    headerAlign: 'center',
  },
  
  {
    field: 'deleteIcon',
    headerName: ' ',
    width: 50,
    hide: !puedeEditar,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleteId, esProveedor, esFiduciante } }) => (
      (esProveedor===1&&tipo===1)||(esFiduciante===1&&tipo===0)? "":<DeleteIcon
        onClick={e => {
          setRowIdToDelete(deleteId);
          setIsPromptOpen(true);
        }}
      />
    ),
  },
];


export function GrillaEmpresa({ empresaInformation, isLoading, error, loggedUser, idSociety, filtRS, tipo }) {
  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();

  var puedeEditar = true;  
  var acceso = null;
  if(tipo===1){
    acceso = loggedUser?.['rol.fidu'];
  }else{
    acceso = loggedUser?.['rol.proveedor'];
  }
  if( acceso ==='vista'){puedeEditar =false}

  var categorias = useContext(CategoriasComboContext);
  var condicion_de_IVA = useContext(CondicionIVAContext);

  
  const queryClient = useQueryClient();

  const { data: rubros } = useQuery(['rubros', idSociety], () =>
    getMethod(`rubro/listar/${idSociety.id}`)
  );


  const { data: subRubros } = useQuery(['subrubros', idSociety], () =>
    getMethod(`subrubro/listar/${idSociety.id}/0`)
  );

  const { mutate: eliminate } = useMutation(
    async idEmpresa => await deleteMethod(`empresa/eliminar/${idSociety.id}`, { id: idEmpresa }),
    {
      onMutate: async idEmpresa => {
        await queryClient.cancelQueries(['empresa', idSociety]);
        const prevData = queryClient.getQueryData(['empresa', idSociety]);
        const newData = prevData.filter(empresa => empresa.id !== idEmpresa);
        queryClient.setQueryData(['empresa', idSociety], newData);
        return prevData;
      },
      onError: (err, idEmpresa, context) => queryClient.setQueryData(['empresa', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['empresa', idSociety]),
    }
  );

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) =>
      await postMethod(`empresa/modificar/${idSociety.id}`, {
        id,
        [field]: field==='esProveedor'? (value?1:0):(field==='esFiduciante'? (value?1:0):value),
      }),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['empresa', idSociety]);
        const prevData = queryClient.getQueryData(['empresa', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(empresa => empresa.id !== id),
          { ...prevData.find(empresa => empresa.id === id), [field]: value },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['empresa', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['empresa', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['empresa', idSociety]),
    }
  );

  var colDefaultVisibles = [];

  if(tipo===1){
    colDefaultVisibles = [
        {c:'razonSocial',  h:false},
        {c:'CUIT',  h:false},
        {c:'telefono',  h:false},
        {c:'mail',  h:false},
        ];
  }else{   
    colDefaultVisibles = [
        {c:'id',  h:false},
        {c:'razonSocial',  h:false},
        {c:'CUIT',  h:false},
        {c:'rubroId',  h:false}, 
        {c:'condIVA',  h:false},
        {c:'ganancias',  h:false},
        {c:'categoria',  h:false},
        {c:'esRetSUSS',  h:false},
        {c:'esRetIVA',  h:false},       

        {c:'CBU',  h:false},
        {c:'banco',  h:false},
        {c:'nroCuenta',  h:false},
        {c:'telefono',  h:false},
        {c:'mail',  h:false},  
            
        {c:'enviar_OP_auto',  h:false},
        {c:'actividad',  h:false},
        {c:'domicilio',  h:false},
        
        {c:'esProveedor',  h:true},
        {c:'esFiduciante',  h:true},  
        {c:'subrubroId',  h:true}, 

      ];
  }
  const [colVisibles, setColVisibles] = useState(colDefaultVisibles);

  const change = (col) => { 
    let cols = colVisibles;
    let foundIndex = cols?.findIndex(item => item.c === col.field);
    if(foundIndex>-1){
      cols[foundIndex] = {c:col.field,  h:!col.isVisible};
      setColVisibles(cols);
    }
  };

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'razonSocial',
      sort: 'asc',
    },
  ]);

  function filtrar(element, filtRS){    
    
    if(filtRS === -1){
      return true;
    }else{
      if(element.id===filtRS){return true;}else{return false;}
    }

  }

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
          rows={empresaInformation.filter(element =>filtrar(element, filtRS)).map(empresa => ({
            id: empresa?.id,
            rubroId: rubros?.find(rubro => rubro.id === empresa.rubroId)?.rubro,
            rubro_filtro: empresa?.rubroId,
            subrubroId: subRubros?.find(subRubro => subRubro.id === empresa.subrubroId)?.subRubro,
            id: empresa?.id,
            razonSocial: empresa?.razonSocial,
            CUIT: empresa?.CUIT,
            mail: empresa?.mail,
            telefono: empresa?.telefono,
            CBU: empresa?.CBU,
            banco: empresa?.banco,
            nroCuenta: empresa?.nroCuenta,
            esProveedor: empresa?.esProveedor,
            esFiduciante: empresa?.esFiduciante,
            enviar_OP_auto: empresa?.enviar_OP_auto,
            actividad: empresa?.actividad,
            domicilio: empresa?.domicilio,
            esRetSUSS: empresa?.esRetSUSS===0? false: true,
            esRetIVA: empresa?.esRetIVA===0? false: true,
            categoria: categorias?.find(i => i.id === empresa.categoria)?.descripcion,
            //categoria: empresa?.categoria,
            condIVA: condicion_de_IVA?.find(i => i.id === empresa.condIVA)?.descripcion,
            ganancias: empresa?.ganancias===0? false: true,

            deleteId: empresa?.id,
          }))}
          onCellEditCommit={modifyData}
          columns={columns(colVisibles, puedeEditar, categorias, condicion_de_IVA, tipo, rubros, subRubros, setIsPromptOpen, setRowIdToDelete)}
          
          sortModel={sortModel}
          onSortModelChange={(model) => model[0]!==sortModel[0]?onSort(model):false}
          onColumnVisibilityChange={(model) => change(model)}
       
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

function ComboBoxRu({ rubros, props }) {
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

//Recibe un listItems que es un OBJ con id y descrpcion
//
function ComboBox({ listItems, label, props }) {
  const { id, api, field } = props;

  listItems = [
    ...listItems,
    {
      descripcion: '',
    },
  ];
  const [selectedRet, setSelectedRol] = useState({
    descripcion: '',
  });

  return (
    <Autocomplete
      value={selectedRet}
      onChange={async (event, newValue) => {        
        setSelectedRol(newValue);    
        if(newValue?.id){
          api.setEditCellValue({ id, field, value: newValue.id }, event);
          await props.api.commitCellChange({ id, field });
          api.setCellMode(id, field, 'view');
        }
      }}
      id="combo-box-demo"
      options={listItems}
      isOptionEqualToValue={(op, val) => op.descripcion === val.descripcion}
      getOptionLabel={option => option.descripcion}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label={label} />}
    />
  );
}
