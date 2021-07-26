import React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport
} from '@material-ui/data-grid';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { listDollar, changeCellDollar, deleteDollar } from 'src/components/API';

const columns = [
  // { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
    type: 'date',
    valueFormatter: (params) =>
      new Date(params.value).toLocaleDateString('es-AR')
  },
  {
    field: 'BCRA',
    headerName: 'BCRA',
    width: 130,
    editable: true,
    valueFormatter: (params) =>
      Number(params.value).toFixed(2).toLocaleString('es-AR')
  },
  {
    field: 'mep',
    headerName: 'MEP',
    width: 130,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  },
  {
    field: 'deleteIcon',
    headerName: ' ',
    renderCell: DeleteButton
  }
];

export function GrillaDolar({ idSociedad }) {
  const queryClient = useQueryClient();

  const { mutate: deleteRowFromGrid } = useMutation(
    async (id) => {
      await deleteDollar(idSociedad, id);
    },
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['dolar', idSociedad])
    }
  );

  const { data, isLoading, error } = useQuery(['dolar', idSociedad], () =>
    listDollar(idSociedad)
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleCellModification(e) {
    let newData = {
      id: e.id,
      [e.field]: e.props.value
    };
    changeCellDollar(idSociedad, newData);
  }

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={data.map((el) => ({
          id: el.id,
          fecha: el.fecha,
          BCRA: el.BCRA,
          blue: el.blue,
          descripcion: el.descripcion,
          mep: el.mep,
          onDelete: () => deleteRowFromGrid(el.id)
        }))}
        columns={columns}
        pageSize={25}
        disableSelectionOnClick
        autoHeight
        sortModel={[
          {
            field: 'fecha',
            sort: 'asc'
          }
        ]}
        scrollbarSize
        onEditCellChangeCommitted={handleCellModification}
        components={{
          Toolbar: CustomToolbar
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

function DeleteButton(params) {
  const deleteRow = params.row.onDelete;
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={deleteRow}
    >
      Delete
    </Button>
  );
}

GrillaDolar.propTypes = {
  idSociedad: PropTypes.number
};
