import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'razonSocial', headerName: 'Razón Social', width: 150 },
  { field: 'CUIT', headerName: 'CUIT', width: 200, editable: true },
  {
    field: 'mail',
    headerName: 'Correo Electrónico',
    width: 200,
    editable: true
  },
  { field: 'telefono', headerName: 'Teléfono', width: 200, editable: true },
  { field: 'telefono2', headerName: 'Teléfono 2', width: 200, editable: true },
  {
    field: 'Descripcion',
    headerName: 'Descripción',
    width: 200,
    editable: true
  },
  {
    field: 'cuentaBancariaId',
    headerName: 'Cuenta Bancaria',
    width: 200,
    editable: true
  }
];

export default function DatagridProveedores(props) {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={props.proveedores}
        columns={columns}
        pageSize={25}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

DatagridProveedores.propTypes = {
  proveedores: PropTypes.array.isRequired
};
