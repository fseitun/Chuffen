import { getMethod } from 'src/utils/api';

export async function nameToId(nombreSociedad) {
  const data = await getMethod(`sociedad/mostrar/${nombreSociedad}`);
  localStorage.removeItem('idSociety');
  if (data) {
    localStorage.setItem('idSociety', JSON.stringify({ id: data.id, name: nombreSociedad }));
    let respuesta = await data.id;
    return respuesta;
  }
}
