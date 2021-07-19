import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { DataGrid } from '@material-ui/data-grid';
import { changeCellDollar } from 'src/components/API';

import { listarDolar } from 'src/components/API';

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
    width: 120,
    editable: true,
    valueFormatter: (params) =>
      Number(params.value).toFixed(2).toLocaleString('es-AR')
  },
  {
    field: 'mep',
    headerName: 'MEP',
    width: 120,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  }
];

export function GrillaDolar({ idSociedad, selectedRows, setSelectedRows }) {
  const { data, isLoading, error } = useQuery(['dolar', idSociedad], () =>
    listarDolar(idSociedad)
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  function handleModification(e) {
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
          mep: el.mep
        }))}
        columns={columns}
        pageSize={25}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        // rowHeight={40}
        scrollbarSize
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection.selectionModel);
        }}
        selectedRows={selectedRows}
        onEditCellChangeCommitted={handleModification}
      />
    </div>
  );
}

GrillaDolar.propTypes = {
  idSociedad: PropTypes.number,
  selectedRows: PropTypes.array.isRequired,
  setSelectedRows: PropTypes.func.isRequired
};
