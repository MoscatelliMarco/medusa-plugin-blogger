import { useEffect, useCallback } from 'react'
import Tagify from '@yaireo/tagify'
import DragSort from "@yaireo/dragsort"
import TagStyle from '../../../css/tags'
import EditorStyle from '../../../css/editor'
import  { SimpleMdeReact } from "react-simplemde-editor";

const ArticleEditorPage = () => {
    useEffect(() => {
        // Tags logic
        const inputElem = document.querySelector('#tags')
        const tagify = new Tagify(inputElem, {})
        new DragSort(tagify.DOM.scope, {
            selector:'.'+tagify.settings.classNames.tag,
            callbacks: {
                dragEnd: onDragEnd
            }
        })
        function onDragEnd(elm){
            tagify.updateValueByDOMTags()
        }


        const toolbarOptions = [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image'],
          
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          
            ['clean']                                         // remove formatting button
        ];
        // Editor logic
        // new SimpleMDE({ element: document.getElementById("#editor") });
    }, [])

    let editorBody = "";
    const onChangeEditor = useCallback((value: string) => {
        editorBody = value;
        console.log(editorBody)
    }, []);

    return (
        <div className="flex flex-col gap-4">

            <TagStyle />
            <EditorStyle />

            <h1 className="text-3xl font-semibold text-gray-700 mb-3">Blog editor</h1>

            <div className="flex flex-col">
                <label htmlFor="title" className="font-medium text-gray-700 mr-1">Title</label>
                <input name="title" id="title" type="text" className="bg-transparent focus:outline-none border border-gray-300 text-lg font-medium w-full px-3 py-2 rounded" placeholder="Title" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="description" className="font-medium text-gray-700 mr-1">Description</label>
                <textarea name="description" id="description" className="bg-transparent focus:outline-none h-24 border border-gray-300 w-full px-3 py-1.5 rounded" placeholder="Description"></textarea>
            </div>
            <div className="w-full h-[1px] bg-gray-300 mt-3 mb-1.5"></div>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                    <label htmlFor="author" className="font-medium text-gray-700 mr-1">Author</label> 
                    <input name="author" id="author" type="text" className="bg-transparent focus:outline-none border border-gray-300 w-full px-3 py-1.5 rounded" placeholder="Author" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="tags" className="font-medium text-gray-700 mr-1">Tags</label> 
                    <input id="tags" name="tags" className="bg-transparent focus:outline-none border font-medium w-full px-3 py-1.5 h-full rounded" placeholder="Tags"/>
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300 mt-4 mb-2.5"></div>
            <div className="flex flex-col gap-0.5">
                <label htmlFor="editor" className="font-medium text-gray-700 mr-1">Body</label>
                <div id='editor'>
                    {/* 
                        TODO change codeMirro class to have bg transparent 
                        TODO change word correction to false
                    */}
                    <SimpleMdeReact onChange={onChangeEditor} options = {{
                        unorderedListStyle: "-",
                        previewImagesInEditor: true,
                        minHeight: "400px",
                        placeholder: "Body",
                        // uploadImage: true
                    }}/>
                </div>
                <style>
                    {
                        `
                        #editor ul li {
                            list-style: disc !important;
                            margin-left: 20px;
                        }
                        #editor ol li {
                            list-style: decimal !important;
                            margin-left: 20px;
                        }
                        #editor a {
                            text-decoration-line: underline;
                            color: blue;
                        }
                        #editor a:visited {
                            color: purple;
                        }
                        `
                    }
                </style>
            </div>

        </div>
    )
}
export default ArticleEditorPage;