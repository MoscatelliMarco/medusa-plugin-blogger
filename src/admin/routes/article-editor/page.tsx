import { useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import UploadArticleItem from '../../../ui-components/upload_article';

const ArticleEditorPage = () => {
    const [ show_upload, setShowUpload ] = useState(false);

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
                    document.getElementById(title.dataset.move).focus();
                }
            })
            const subtitle = document.getElementById("subtitle");
            subtitle.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    if (subtitle.dataset.move == "editorjs") {
                        editor.focus();
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
            <div className='flex flex-col mb-7'>
                <div className='flex justify-end text-xs'>
                    <button onClick={() => setShowUpload(!show_upload)} className='px-5 py-1.5 bg-green-600 text-white font-medium rounded-full'>Upload</button>
                </div>
                <UploadArticleItem show_upload={show_upload} />
            </div>

            <div className='flex flex-col justify-center items-center w-full h-64 rounded bg-green-300'>
                IMAGE
            </div>

            <input id='title' data-move="subtitle" name='title' className='text-4xl font-semibold bg-transparent focus:outline-none' placeholder='Title' type="text" />
            <input id='subtitle' data-move="editorjs" name='subtitle' className='text-lg text-gray-500 bg-transparent focus:outline-none' placeholder='Subtitle' type="text" />

            <div id="editorjs"></div>

        </div>
    )
}
export default ArticleEditorPage;