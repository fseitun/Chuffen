import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';

const ResultadoListaDeRubros = ({ rubros, ...rest }) => {
  const [selectedRubroIds, setSelectedRubroIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedRubroIds;

    if (event.target.checked) {
      newSelectedRubroIds = rubros.map((rubro) => rubro.id);
    } else {
      newSelectedRubroIds = [];
    }

    setSelectedRubroIds(newSelectedRubroIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedRubroIds.indexOf(id);
    let newSelectedRubroIds = [];

    if (selectedIndex === -1) {
      newSelectedRubroIds = newSelectedRubroIds.concat(selectedRubroIds, id);
    } else if (selectedIndex === 0) {
      newSelectedRubroIds = newSelectedRubroIds.concat(
        selectedRubroIds.slice(1)
      );
    } else if (selectedIndex === selectedRubroIds.length - 1) {
      newSelectedRubroIds = newSelectedRubroIds.concat(
        selectedRubroIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedRubroIds = newSelectedRubroIds.concat(
        selectedRubroIds.slice(0, selectedIndex),
        selectedRubroIds.slice(selectedIndex + 1)
      );
    }

    setSelectedRubroIds(newSelectedRubroIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRubroIds.length === rubros.length}
                    color="primary"
                    indeterminate={
                      selectedRubroIds.length > 0 &&
                      selectedRubroIds.length < rubros.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>id</TableCell>
                <TableCell>Rubro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rubros.slice(0, limit).map((rubro) => (
                <TableRow
                  hover
                  key={rubro.id}
                  selected={selectedRubroIds.indexOf(rubro.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRubroIds.indexOf(rubro.id) !== -1}
                      onChange={(event) => handleSelectOne(event, rubro.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{rubro.id}</TableCell>
                  <TableCell>{rubro.rubro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={rubros.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ResultadoListaDeRubros.propTypes = {
  rubros: PropTypes.array.isRequired
};

export default ResultadoListaDeRubros;
