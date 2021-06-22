import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'user', headerName: 'Nombre', width: 200, editable: true },
  {
    field: 'mail',
    headerName: 'Correo Electrónico',
    width: 200,
    editable: true
  }
];

export default function DatagridUsuarios(props) {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={props.usuarios}
        columns={columns}
        pageSize={25}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

DatagridUsuarios.propTypes = {
  usuarios: PropTypes.array.isRequired
};
