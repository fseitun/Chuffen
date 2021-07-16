import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { DataGrid } from '@material-ui/data-grid';
// import { format } from 'date-fns';

import { listarDolar } from 'src/components/API';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
    type: 'date'
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

export function GrillaDolar({ sociedad, selectionModel, setSelectionModel }) {
  const { data, isLoading, error } = useQuery(['dolar', sociedad], () =>
    listarDolar(sociedad)
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

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
        // onRowSelected={(e) => console.log(e)}
        onSelectionModelChange={(newSelection) => {
          console.log(newSelection);
          setSelectionModel(newSelection.selectionModel);
        }}
        selectionModel={selectionModel}
      />
    </div>
  );
}

GrillaDolar.propTypes = {
  sociedad: PropTypes.number,
  selectionModel: PropTypes.array.isRequired,
  setSelectionModel: PropTypes.func.isRequired
};