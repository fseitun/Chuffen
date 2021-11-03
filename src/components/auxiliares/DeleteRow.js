import { Box, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function DeleteRow({ row: { id, onDelete } }) {
  // console.log('id', id);
  // console.log('onDelete', onDelete);
  return (
    <DeleteIcon
      onClick={() => {
        console.log('id', id);
        return notify(onDelete, id);
      }}
    />
  );
}

function notify(onDelete, id) {
  toast(({ closeToast }) => (
    <Box>
      <Button
        sx={{ p: 1, m: 1 }}
        variant="contained"
        color="secondary"
        size="small"
        onClick={closeToast}
      >
        No quiero borrar
      </Button>
      <Button
        sx={{ p: 1, m: 1 }}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => {
          console.log('id', id);
          onDelete(id);
          closeToast();
        }}
      >
        Sí quiero borrar
      </Button>
    </Box>
  ));
}
