import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import DatagridDolar from 'src/components/dolar/DatagridDolar';
import { listarDolar } from 'src/components/API';

export function TiposDeCambio({ sociedad }) {
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

  return <DatagridDolar dolar={filas} />;
}

TiposDeCambio.propTypes = {
  sociedad: PropTypes.number
};
