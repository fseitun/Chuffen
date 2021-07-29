import { useReducer } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toaster() {
  const [state, dispatch] = useReducer(reducer, {
    collection: data,
    toRemove: []
  });

  const removeRow = (e) => {
    const id = e.target.dataset.rowId;
    dispatch({
      id,
      type: 'QUEUE_FOR_REMOVAL'
    });

    toast(<Undo onUndo={() => dispatch({ id, type: 'UNDO' })} />, {
      onClose: () => dispatch({ type: 'CLEAN_COLLECTION' })
    });
  };

  const renderRows = () => {
    return state.collection
      .filter((v) => !state.toRemove.includes(v.id))
      .map((v) => (
        <tr key={v.id}>
          <td>{v.firstName}</td>
          <td>{v.lastName}</td>
          <td>
            <button onClick={removeRow} data-row-id={v.id}>
              Delete
            </button>
          </td>
        </tr>
      ));
  };

  return (
    <>
      <ToastContainer closeOnClick={false} closeButton={false} />
    </>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'QUEUE_FOR_REMOVAL':
      return {
        collection: state.collection,
        toRemove: [...state.toRemove, action.id]
      };
    case 'CLEAN_COLLECTION':
      return {
        collection: state.collection.filter(
          (v) => !state.toRemove.includes(v.id)
        ),
        toRemove: []
      };
    case 'UNDO':
      return {
        collection: state.collection,
        toRemove: state.toRemove.filter((v) => v !== action.id)
      };
    default:
      return state;
  }
}

function Undo({ onUndo, closeToast }) {
  const handleClick = () => {
    onUndo();
    closeToast();
  };
  return (
    <div>
      <h3>
        Row Deleted <button onClick={handleClick}>UNDO</button>
      </h3>
    </div>
  );
}
