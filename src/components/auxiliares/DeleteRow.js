import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

export function DeleteRow({
  isPromptOpen,
  setIsPromptOpen,
  rowData: {
    id,
    row: { onDelete },
  },
}) {
  // console.log('id', id);
  // console.log('onDelete', onDelete);
  return (
    <>
      <DeleteIcon onClick={() => setIsPromptOpen(true)} />
      <PromptUser />
    </>
  );

  function PromptUser() {
    return (
      <div>
        <Dialog
          open={isPromptOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">¿Eliminar fila?</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={handleDeleteAndClose} autoFocus>
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

    function handleClose() {
      setIsPromptOpen(false);
    }

    function handleDeleteAndClose() {
      onDelete();
      handleClose();
    }
  }
}
