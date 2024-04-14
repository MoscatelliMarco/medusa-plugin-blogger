import { useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import UploadArticleItem from '../../../ui-components/upload_article';

const ArticleEditorPage = () => {
    const [ show_upload, setShowUpload ] = useState(false);
    const [ uploadOpened, setUploadOpened ] = useState(false);
    const [ inputs, setInputs ] = useState({
        "title": "",
        "description": ""
    });

    // With MedusaJS the component is initialized two times, this is here to prevent creating multiple editors for nothing
    let runned = false;
    useEffect(() => {
        if (!runned) {
            const editor = new EditorJS({
                holder : 'editorjs',
                placeholder: "Body"
            });
            const title = document.getElementById("title");
            title.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    // Set timeout is needed so the enter key isn't shifted to the next input
                    setTimeout(() => {
                        document.getElementById(title.dataset.move).focus();
                    }, 1)
                }
            })
            const subtitle = document.getElementById("subtitle");
            subtitle.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    if (subtitle.dataset.move == "editorjs") {
                        // Set timeout is needed so the enter key isn't shifted to the next input
                        setTimeout(() => {
                            editor.focus();
                        }, 1)
                    } else {
                        document.getElementById(title.dataset.move).focus();
                    }
                }
            })

            runned = true;
        }
    }, [])

    return (
        <div className="flex flex-col gap-2">
            <div className='flex flex-col mb-4'>
                <div className='flex justify-between items-center text-xs'>
                    <p className='text-gray-400 text-sm'>Saved</p>
                    <button onClick={() => {setShowUpload(!show_upload); setUploadOpened(true);}} className='px-5 py-1.5 bg-green-600 text-white font-medium rounded-full'>Upload</button>
                </div>
                <UploadArticleItem show_upload={show_upload} upload_opened={uploadOpened} inputs={inputs} />
            </div>

            <div className='flex flex-col justify-center items-center w-full h-64 rounded bg-green-300 mb-4'>
                IMAGE
            </div>

            <input onChange={(event) => {setInputs({...inputs, title: event.target.value})}} id='title' data-move="subtitle" name='title' className='text-4xl font-semibold bg-transparent focus:outline-none' placeholder='Title' type="text" />
            <input onChange={(event) => {setInputs({...inputs, description: event.target.value})}} id='subtitle' data-move="editorjs" name='subtitle' className='text-lg text-gray-500 bg-transparent focus:outline-none auto-height-input' placeholder='Subtitle' type="text" />

            <div id="editorjs"></div>
        </div>
    )
}
export default ArticleEditorPage;