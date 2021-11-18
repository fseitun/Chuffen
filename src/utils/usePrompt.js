import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

export function usePrompt() {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  return { Prompt, setIsPromptOpen };

  function Prompt({
    ok = false,
    action = () => {},
    message = '¿Estás seguro de eliminar este registro?',
  }) {
    // console.log('action', action);
    return (
      <div>
        <Dialog
          open={isPromptOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
          <DialogActions>
            {ok ? (
              <Button onClick={handleClose}>Ok</Button>
            ) : (
              <>
                <Button onClick={handleClose}>No</Button>
                <Button onClick={() => handleActionAndClose(action)} autoFocus>
                  Sí
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  function handleClose() {
    setIsPromptOpen(false);
  }

  function handleActionAndClose(action) {
    action();
    handleClose();
  }
}