import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@material-ui/data-grid';
import { modificarCeldaDolar } from 'src/components/API';

// import { format } from 'date-fns';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
    type: 'date',
    editable: true
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

export function DatagridDolar({
  dolar,
  selectionModel,
  setSelectionModel,
  sociedad
}) {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={dolar}
        columns={columns}
        pageSize={25}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        // rowHeight={40}
        scrollbarSize
        // onRowSelected={(e) => console.log(e)}
        onSelectionModelChange={(newSelection) => {
          console.log(newSelection);
          setSelectionModel(newSelection.selectionModel);
        }}
        selectionModel={selectionModel}
        onEditCellChange={handleModificacion}
      />
    </div>
  );
}

DatagridDolar.propTypes = {
  dolar: PropTypes.array.isRequired,
  selectionModel: PropTypes.array.isRequired,
  setSelectionModel: PropTypes.func.isRequired,
  sociedad: PropTypes.number.isRequired
};
