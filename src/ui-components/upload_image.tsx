import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { XMark } from '@medusajs/icons';

const UploadImageItem = (props) => {
    const [imageUploadError, setImageUploadError] = useState<boolean>(false);

    useEffect(() => {
        props.setSelectedFile(props.loadedThumbnailImage);
    }, [props.loadedThumbnailImage]);

    const handleImageError = () => {
        props.setSelectedFile(previous_file => previous_file.replace("blob:", ""));
        setImageUploadError(true);
    }

    const onDrop = useCallback((acceptedFiles) => {
        // Ensure only one file is accepted
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          if (file.type.startsWith('image/')) {
            const blobUrl = URL.createObjectURL(file);
            props.setSelectedFile(blobUrl);
            setImageUploadError(false);
            props.fileChangeHandler();
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
        <div className='relative h-[32rem] border border-dashed border-gray-400 text-gray-400 rounded-md max-w-7xl w-full'>
            <div {...getRootProps()} className='w-full flex justify-center items-center h-full'>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the thumbnail image here...</p>
                ) : (
                    <p>Drag and drop the thumbnail image here, or click to select the file</p>
                )}
            </div>
            {props.selectedFile && (
                <div className='overflow-hidden absolute top-0 left-0 w-full h-full bg-transparency-pattern'>
                    {
                        imageUploadError ? 
                        <div className='w-full h-full grid place-items-center'>
                            <p className='text-center max-w-md text-red-500 p-1.5 font-medium bg-black'>
                                The loaded thumbnail image does not exist in the database, delete this image by clicking in the top left button before adding a new image
                            </p>
                        </div> : 
                        ""
                    }
                    <img onError={handleImageError} src={props.selectedFile} id='thumbnail' alt="" className='w-full h-full object-cover' />
                </div>
            )}
            {props.selectedFile && (
                <div className='absolute top-2.5 left-2.5 flex justify-center'>
                    <button onClick={() => {
                        props.setSelectedFile(null);
                        props.fileChangeHandler();
                        }} className='p-1.5 bg-red-600 bg-opacity-50 text-white font-medium rounded-xl'>
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