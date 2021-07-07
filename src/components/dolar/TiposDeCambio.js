import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import { DatagridDolar } from 'src/components/dolar/DatagridDolar';
import { listarDolar } from 'src/components/API';

export function TiposDeCambio({ sociedad, selectionModel, setSelectionModel }) {
  const { data, isLoading, error } = useQuery(['dolar', sociedad], () =>
    listarDolar(sociedad)
  );

  if (isLoading) return 'Cargando...';
  if (error) return `Hubo un error: ${error.message}`;

  const filas = data.map((el) => ({
    id: el.id,
    fecha: el.fecha,
    BCRA: el.BCRA,
    blue: el.blue,
    descripcion: el.descripcion,
    mep: el.mep
  }));

  return (
    <DatagridDolar
      dolar={filas}
      selectionModel={selectionModel}
      setSelectionModel={setSelectionModel}
    />
  );
}

TiposDeCambio.propTypes = {
  sociedad: PropTypes.number,
  selectionModel: PropTypes.array.isRequired,
  setSelectionModel: PropTypes.func.isRequired
};
