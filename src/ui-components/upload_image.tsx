import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { XMark } from '@medusajs/icons';

const UploadImageItem = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        // Ensure only one file is accepted
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                setSelectedFile(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file.');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.webp']
        },
        maxFiles: 1,
    });

    return (
        <div className='relative h-96 border border-dashed border-gray-400 text-gray-400 rounded-md'>
            <div {...getRootProps()} className='w-full flex justify-center items-center h-full'>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag and drop some files here, or click to select files</p>
                )}
            </div>
            {selectedFile && (
                <div className='overflow-hidden absolute top-0 left-0 w-full h-full bg-transparency-pattern'>
                    <img src={selectedFile} alt="Uploaded" className='w-full h-full object-cover' />
                </div>
            )}
            {selectedFile && (
                <div className='absolute top-4 left-4 flex justify-center'>
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