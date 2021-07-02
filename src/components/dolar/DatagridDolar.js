import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@material-ui/data-grid';
// import { format } from 'date-fns';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
    // valueFormatter: (params) => {
    //   const fecha = new Date(params.value);
    //   format(fecha, 'P');
    // }
  },
  {
    field: 'BCRA',
    headerName: 'BCRA',
    width: 120,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  },
  {
    field: 'mep',
    headerName: 'MEP',
    width: 120,
    editable: true,
    valueFormatter: (params) => Number(params.value).toFixed(2)
  }
];

export default function DatagridDolar(props) {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={props.dolar}
        columns={columns}
        pageSize={25}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
}

DatagridDolar.propTypes = {
  dolar: PropTypes.array.isRequired
};
