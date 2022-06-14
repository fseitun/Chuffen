import * as React from 'react';
import { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { TipoProductosContext} from 'src/App';

const columns = () => [
  
  {
    field: 'codigo',
    headerName: 'Código',
    headerAlign: 'center',
    width: 200,
    editable: false,
  },
  {
    field: 'tipo',
    headerName: 'Tipo de producto',
    width: 240,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },

];


export function GrillaItem({ items}) {

  var tipoProductos = useContext(TipoProductosContext);

    return (
      <div style={{ width: '100%' }}>
        <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >
         

          <Grid item md={7}>

            <DataGrid
              rows={items.map(item => ({
                id: item.id,
                codigo: item.codigo,
                tipo: tipoProductos?.find(t => t.id === item.tipo)?.descripcion,
        
              }))}

              hideFooter
              columns={columns()}
              disableSelectionOnClick
              autoHeight              
            />
          </Grid>
        </Grid>  
      </div>
    );
}
