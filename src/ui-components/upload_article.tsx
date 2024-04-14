import TagItem from "./tag";
import { useState, useEffect } from "react";

const UploadArticleItem = (props) => {
    const [ seoTitle, setSeoTitle ] = useState(props.upload_opened ? (props.inputs.title) : "");
    const [ seoDescription, setSeoDescription ] = useState(props.upload_opened ? (props.inputs.title) : "");
    const [ urlSlug, setUrlSlug ] = useState(props.upload_opened ? (props.inputs.title) : "");

    useEffect(() => {
        setSeoTitle(props.upload_opened ? (props.inputs.title) : "");
        setSeoDescription(props.upload_opened ? (props.inputs.subtitle) : "");
        setUrlSlug(props.upload_opened ? (slugify(props.inputs.title)) : "");
    }, [props.upload_opened])

    return (
        <div className={`slide-parent ${props.show_upload ? "active" : ""}`}>
            <div className="flex flex-col items-center gap-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm w-full p-4 pt-6">
                    <input type="text" className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-lg' placeholder='Author' />
                    <TagItem />
                    <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} placeholder='SEO title' type="text" className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-lg' />
                    <input placeholder='SEO keywords' type="text" className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-lg' />
                    <input value={urlSlug} onChange={(event) => setUrlSlug(event.target.value)} placeholder='Url slug' type="text" className='col-span-2 border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-lg' />
                    <textarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} placeholder='SEO description' className='col-span-2 max-h-48 border focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-lg'></textarea>
                </div>
                <button className="text-lg text-white rounded-xl px-5 py-2 shadow-md bg-green-600 hover:bg-green-700">
                    Publish article
                </button>
            </div>
            <style>
                {
                    `
                        .slide-parent {
                            overflow: hidden; /* Hide overflowing content */
                            max-height: 0; /* Initially collapse the parent */
                            transition: max-height 0.3s ease-in-out; /* Transition for height change */
                        }
                        .slide-parent.active {
                            max-height: 400px;
                        }
                    `
                }
            </style>
        </div>
    )
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export default UploadArticleItem;