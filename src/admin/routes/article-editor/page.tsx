import { useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import UploadArticleItem from '../../../ui-components/upload_article';

const ArticleEditorPage = () => {
    const [ show_upload, setShowUpload ] = useState(false);
    const [ uploadOpened, setUploadOpened ] = useState(false);
    const [ inputs, setInputs ] = useState({
        "title": "",
        "subtitle": ""
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
                    event.preventDefault();
                    document.getElementById("subtitle").focus();
                }
            })
            const subtitle = document.getElementById("subtitle");
            subtitle.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    event.preventDefault();
                    editor.focus();
                } else if (event.key == "Backspace") {
                    if (!subtitle.value) {
                        document.getElementById("title").focus();
                    }
                }
            })
            const editorContainer = document.getElementById('editorjs');
            editorContainer.addEventListener('keydown', (event) => {
                if (event.key === 'Backspace') {
                    const editorBlocks = editor.blocks.getBlocksCount();
                    if (editorBlocks === 1) {
                        const firstBlock = editor.blocks.getBlockByIndex(0);
                        if (firstBlock.isEmpty) {
                            document.getElementById("subtitle").focus();
                        }
                    }
                }
            });

            // Resize textarea so they are like inputs but with breakline
            const autoResizeInputs = document.querySelectorAll(".auto-resize");
            for (let input of autoResizeInputs) {
                input.addEventListener('input', autoResize, false);
    
                function autoResize() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                }
            }

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

            <textarea rows={1} className='auto-resize overflow-hidden resize-none h-auto font-semibold text-4xl text-gray-500 bg-transparent focus:outline-none auto-height-input' placeholder='Title' onChange={(event) => {setInputs({...inputs, title: event.target.value})}} name="title" id="title"></textarea>
            <textarea rows={1} className='auto-resize overflow-hidden resize-none h-auto text-lg text-gray-500 bg-transparent focus:outline-none auto-height-input' placeholder='Subtitle' onChange={(event) => {setInputs({...inputs, subtitle: event.target.value})}} name="subtitle" id="subtitle"></textarea>
            <div id="editorjs"></div>
        </div>
    )
}
export default ArticleEditorPage;