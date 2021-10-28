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
    // console.log('fideId', fideId);
    formData.append('logo', acceptedFiles[0]);
    formData.append('id', fideId);
    // console.log([...formData.entries()], acceptedFiles[0], acceptedFiles[0].name);
    postMethod('fideicomiso/modificar/1', formData);
    setNewLogoFlag(true);
  }, []);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  // console.log('acceptedFileItems', acceptedFileItems);
  // console.log('fileRejectionItems', fileRejectionItems);
  return (
    <Container>
      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        <p>subir logo</p>
      </Dropzone>
    </Container>
  );
}
