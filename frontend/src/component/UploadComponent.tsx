import React, { useRef, useState } from 'react';
import { Box, Button, ButtonGroup, Input } from "@mui/material";

const UploadComponent: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [inputKey, setInputKey] = useState<number>(0);
    const audioRef = React.createRef<HTMLAudioElement>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedFile(file || null);
    };

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            fetch('http://localhost:5000/audio', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(result => {
                    console.log(result);
                    // Do something with the result, update state, etc.
                })
                .catch(error => {
                    console.error('Error uploading audio:', error);
                });
        } else {
            console.error('No file selected');
        }
    };

    const handleReset = () => {
        // Increment the key to force React to create a new input element
        setInputKey(prevKey => prevKey + 1);
        setSelectedFile(null);
    };

    return (
        <div>
            <Input
                key={inputKey}
                inputProps={{ accept: 'audio/*' }}
                name="audio-file-input"
                id="audio-file-input"
                type="file"
                sx={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <label htmlFor="audio-file-input">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                >
                    Choose Audio File
                </Button>
            </label>

            {selectedFile && (
                <div>
                    <p>Selected File: <strong>{selectedFile.name}</strong> </p>
                    <audio ref={audioRef} controls>
                        <source src={URL.createObjectURL(selectedFile)} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}

            <Box margin={5}>
                <ButtonGroup variant="contained" aria-label="Basic button group">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </ButtonGroup>
            </Box>
        </div>
    );
}

export default UploadComponent;
