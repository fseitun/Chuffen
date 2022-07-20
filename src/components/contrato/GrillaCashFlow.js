
import * as React from 'react';

import {
  DataGridPro,
  GridColumns,
  GridRowsProp,
  DataGridProProps,
  GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector
} from '@mui/x-data-grid-pro';
// import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';

import { LicenseInfo } from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(
  'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
);
// 'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e'

const rows: GridRowsProp = [
  {
    hierarchy: ['Sarah'],
    jobTitle: 'Head of Human Resources',
    recruitmentDate: new Date(2020, 8, 12),
    id: 0,
  },
  {
    hierarchy: ['Thomas', 'AAAAA'],
    jobTitle: 'Head of Sales',
    recruitmentDate: new Date(2017, 3, 4),
    id: 1,
  },
  {
    hierarchy: ['Thomas', 'Robert'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 11, 20),
    id: 2,
  },
  {
    hierarchy: ['Thomas', 'Karen'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 10, 14),
    id: 3,
  },
  {
    hierarchy: ['Thomas', 'Nancy'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2017, 10, 29),
    id: 4,
  },
  {
    hierarchy: ['Thomas', 'Daniel'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 21),
    id: 5,
  },
  {
    hierarchy: ['Thomas', 'Christopher'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 20),
    id: 6,
  },
  {
    hierarchy: ['Thomas', 'Donald'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2019, 6, 28),
    id: 7,
  },
  {
    hierarchy: ['Mary'],
    jobTitle: 'Head of Engineering',
    recruitmentDate: new Date(2016, 3, 14),
    id: 8,
  },
  {
    hierarchy: ['Mary', 'Jennifer'],
    jobTitle: 'Tech lead front',
    recruitmentDate: new Date(2016, 5, 17),
    id: 9,
  },
  {
    hierarchy: ['Mary', 'Jennifer', 'Anna'],
    jobTitle: 'Front-end developer',
    recruitmentDate: new Date(2019, 11, 7),
    id: 10,
  },
  {
    hierarchy: ['Mary', 'Michael'],
    jobTitle: 'Tech lead devops',
    recruitmentDate: new Date(2021, 7, 1),
    id: 11,
  },
  {
    hierarchy: ['Mary', 'Linda'],
    jobTitle: 'Tech lead back',
    recruitmentDate: new Date(2017, 0, 12),
    id: 12,
  },
  {
    hierarchy: ['Mary', 'Linda', 'Elizabeth'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2019, 2, 22),
    id: 13,
  },
  {
    hierarchy: ['Mary', 'Linda', 'William'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2018, 4, 19),
    id: 14,
  },
];

const columns: GridColumns = [
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
];

const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.hierarchy;

export function GrillaCashFlow() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        treeData
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}

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
      
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fields: [ 'id', 'tipo', 'letra','fideicomiso', 'empresa', 'cuit','numero'
      , 'montoTotal', 'neto', 'porcentajeIVA', 'iva', 'percepcionesIVA', 'IIBB_CABA','IIBB_BSAS','no_gravado'
      , 'moneda', 'es_ajuste', 'es_cuotas', 'createdAt','fechaIngreso', 'fechaVTO', 'OPnumero', 'estadoOP'] }} />
    </GridToolbarContainer>
  );
}