import TagItem from "./tag";
import { useState, useEffect } from "react";
import { Button, Textarea, Input, Container, Checkbox } from "@medusajs/ui";

const UploadArticleItem = (props) => {
    const [ seoTitle, setSeoTitle ] = useState(props.upload_opened ? (props.inputs.title) : "");
    const [ seoDescription, setSeoDescription ] = useState(props.upload_opened ? (props.inputs.title) : "");
    const [ urlSlug, setUrlSlug ] = useState(props.upload_opened ? (props.inputs.title) : "");

    useEffect(() => {
        setSeoTitle(props.upload_opened ? (props.inputs.title) : "");
        setSeoDescription(props.upload_opened ? (props.inputs.subtitle) : "");
        setUrlSlug(props.upload_opened ? (slugify(props.inputs.title)) : "");
        document.getElementById("draft").click();
    }, [props.upload_opened])

    return (
        <div className={`slide-parent ${props.show_upload ? "active" : ""}`}>
            <Container className="py-5 mt-4">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex justify-center">
                        <p className="text-center font-light text-xs text-gray-400/80 max-w-sm">*Note that these inputs are not mandatory, as their application depends on your frontend</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm w-full p-4">
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="author" className="text-xs text-gray-400 ml-2 font-medium">Author</label>
                            <Input id="author" name="author" type="text" placeholder='Author' />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="tags" className="text-xs text-gray-400 ml-2 font-medium">Tags</label>
                            <TagItem />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-title" className="text-xs text-gray-400 ml-2 font-medium">SEO title</label>
                            <Input id="seo-title" name="seo-title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} placeholder='SEO title' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-keywords" className="text-xs text-gray-400 ml-2 font-medium">SEO keywords</label>
                            <Input id="seo-keywords" name="seo-keywords" placeholder='SEO keywords' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="url-slug" className="text-xs text-gray-400 ml-2 font-medium">Url slug</label>
                            <Input id="url-slug" value={urlSlug} onChange={(event) => setUrlSlug(event.target.value)} placeholder='Url slug' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-description" className="text-xs text-gray-400 ml-2 font-medium">SEO description</label>
                            <Textarea id="seo-description" name="seo-description" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} placeholder='SEO description' ></Textarea>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5">
                        <div className="flex gap-1 items-center justify-end mr-1">
                            <Checkbox id="draft"/>
                            <label htmlFor="draft" className="text-gray-800">Draft</label>
                        </div>
                        <Button onClick={props.handleSubmit} size="large" className="px-6 py-1.5 mb-0.5">
                            Publish
                        </Button>
                    </div>
                    <div className="max-w-md text-red-500 text-center">
                        <p>{props.submitError}</p>
                    </div>
                    <div className="max-w-md text-blue-500 text-center">
                        <p>{props.submitSuccess}</p>
                    </div>
                </div>
            </Container>
            <style>
                {
                    `
                        .slide-parent {
                            overflow: hidden; /* Hide overflowing content */
                            max-height: 0; /* Initially collapse the parent */
                            transition: max-height 0.3s ease-in-out; /* Transition for height change */
                        }
                        .slide-parent.active {
                            max-height: 500px;
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