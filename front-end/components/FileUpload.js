import React, { useCallback } from 'react';
import { useDropzone } from "react-dropzone";

const FileUpload = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        this.props.upload(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop files here </p>
                    : <p> {props.placeHolder} </p>
            }
        </div >
    )
    //TEST THIS!!!!
}

export default FileUpload;