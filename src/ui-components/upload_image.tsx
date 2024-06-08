import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { XMark } from '@medusajs/icons';

const UploadImageItem = (props) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles) => {
        // Ensure only one file is accepted
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          if (file.type.startsWith('image/')) {
            const blobUrl = URL.createObjectURL(file);
            setSelectedFile(blobUrl);
          } else {
            alert('Please upload an image file.');
          }
        }
      }, []);

      let previous_file_value = null;
      useEffect(() => {
        if (previous_file_value != selectedFile) {
            props.fileChangeHandler();
            previous_file_value = selectedFile;
        }
      }, [selectedFile])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.webp']
        },
        maxFiles: 1,
    });

    return (
        <div className='relative h-96 border border-dashed border-gray-400 text-gray-400 rounded-md max-w-5xl w-full'>
            <div {...getRootProps()} className='w-full flex justify-center items-center h-full'>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the thumbnail image here...</p>
                ) : (
                    <p>Drag and drop the thumbnail image here, or click to select the file</p>
                )}
            </div>
            {selectedFile && (
                <div className='overflow-hidden absolute top-0 left-0 w-full h-full bg-transparency-pattern'>
                    <img src={selectedFile} id='thumbnail' alt="Uploaded image" className='w-full h-full object-cover' />
                </div>
            )}
            {selectedFile && (
                <div className='absolute top-2.5 left-2.5 flex justify-center'>
                    <button onClick={() => setSelectedFile(null)} className='p-1.5 bg-red-600 bg-opacity-50 text-white font-medium rounded-xl'>
                        <XMark />
                    </button>
                </div>
            )}

            <style>
                {
                    `
                    .bg-transparency-pattern {
                        background-image: url('https://static.vecteezy.com/system/resources/thumbnails/003/659/551/small/abstract-black-and-white-grid-striped-geometric-seamless-pattern-illustration-free-vector.jpg');
                        background-repeat: repeat;
                        background-size: 150px 150px;
                    }
                    `
                }
            </style>
        </div>
    );
}

export default UploadImageItem;