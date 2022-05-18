import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { postMethod } from 'src/utils/api';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Dropzone = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  &:focus {
    border-color: #2196f3;
  }
`;

export function Uploader({ fideId, setNewLogoFlag }) {
  let formData = new FormData();
  const onDrop = useCallback(acceptedFiles => {
    
    formData.append('logo', acceptedFiles[0]);
    formData.append('id', fideId);

    setNewLogoFlag(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
  });

  
  return (
    <Container>
      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        <p>subir logo</p>
      </Dropzone>
    </Container>
  );
}
