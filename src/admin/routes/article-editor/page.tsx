import { useEffect, useState, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import UploadArticleItem from "../../../ui-components/upload_article";
import UploadImageItem from "../../../ui-components/upload_image";
import { Button, Container } from "@medusajs/ui";
import { useAdminCustomQuery, useAdminCustomPost, useAdminCustomDelete, useAdminUploadFile, useAdminDeleteFile  } from "medusa-react";
import { listenChangesSave, getIdFromCurrentUrl, addIdFromCurrentUrl, removeIdFromCurrentUrl, createPathRequest, loadArticle, formatDateManually, mergeUniqueArrays } from "../../../javascript/utils";
import { createFileFromBlobURL } from "../../../javascript/file_manipulation";

// Editor JS plugins
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";
import NestedList from "@editorjs/nested-list";
import SimpleImage from "simple-image-editorjs";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";

const ArticleEditorPage = () => {
    const [show_upload, setShowUpload] = useState(false);
    const [uploadOpened, setUploadOpened] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [statusSaved, setStatusSaved] = useState("Not saved");
    const [statusSavedError, setStatusSavedError] = useState(false);
    const [draftStatus, setDraftStatus] = useState(true);
    const [isIdValid, setIsIdValid] = useState(true);
    const [inputs, setInputs] = useState({
        title: "",
        subtitle: "",
    });

    // Load article if there is an existing id
    const loaded_article_id = useRef(getIdFromCurrentUrl());
    const [ isArticleLoading, setIsArticleLoading ] = useState(true);

    // Images need to be stored in a variable right after the body loads
    const imagesCache = useRef([]);

    // Store body to load
    const [ loadedBody, setLoadedBody ] = useState(null);

    // Store thumbnail image to load
    const [ loadedThumbnailImage, setLoadedThumbnailImage ] = useState<string | null>(null);

    // NOTE
    /*
    Even if the rule of hooks don't allow to conditionally render them in this case it
    is needed to not send useless requests to the server, and because loaded_article_id value
    should not change across all the iterations
    */
    if (loaded_article_id.current) {
        const { data, isLoading } = useAdminCustomQuery(
            createPathRequest(loaded_article_id.current),
            []
        )

        useEffect(() => {
            if (!isLoading) {
                if (data.article) {
                    loadArticle(data.article);
                    setLoadedBody(data.article.body);
                    setLoadedThumbnailImage(data.article.thumbnail_image);

                    // Save already existing images inside a state
                    let article_images;
                    if (data.article.body_images && data.article.thumbnail_image) {
                        article_images = mergeUniqueArrays(data.article.body_images, [data.article.thumbnail_image])
                    } else if (data.article.body_images) {
                        article_images = data.article.body_images;
                    } else if (data.article.thumbnail_image) {
                        article_images = [data.article.thumbnail_image];
                    } else {
                        article_images = [];
                    }
                    imagesCache.current = mergeUniqueArrays(imagesCache.current, article_images);

                    // Save time article loaded
                    const dateSaved = new Date();
                    setStatusSaved(`Loaded at ${formatDateManually(dateSaved)}`);
                    setStatusSavedError(false);
                } else {
                    setIsIdValid(false);
                }

                /*
                NOTE: 
                this needs to be runned at the end because in react state are scheduled if there
                is a loaded body, I want to change that state before the loading state
                */
                setIsArticleLoading(isLoading);
            }
        }, [isLoading])
    } else {
        useEffect(() => {
            setIsArticleLoading(false);
        }, [])
    }

    // Auto save debounce if the user doesn't write in the last N seconds
    let timeoutId;
    function debounceAutoSave() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(autoSave, 2000);
    }

    // Run debounce auto save when thumbnail image change, create state for the image url of the file
    function fileChangeHandler() {
        debounceAutoSave();
    }


    async function initializeEditor() {
        return new Promise((resolve, reject) => {
          const editor = new EditorJS({
            holder: "editorjs",
            placeholder: "Body",
            tools: {
              paragraph: {
                class: Paragraph,
                inlineToolbar: true,
              },
              header: Header,
              quote: Quote,
              warning: Warning,
              delimiter: Delimiter,
              list: {
                class: NestedList,
                inlineToolbar: true,
                config: {
                  defaultStyle: "unordered",
                },
              },
              image: SimpleImage,
              table: {
                class: Table,
                inlineToolbar: true,
              },
              code: CodeTool,
              Marker: {
                class: Marker,
              },
              inlineCode: {
                class: InlineCode,
              },
              underline: Underline,
            },
            onReady: () => {
              resolve(editor);
            },
            onChange: () => {
                debounceAutoSave();
            }
          });
        });
    }

    let editor = useRef(null);
    async function setupEditor() {
        try {
            editor.current = await initializeEditor();
            console.log('Editor is ready');
        } catch (error) {
            console.error('Error initializing editor:', error);
        }
    }

    // With MedusaJS the component is initialized two times, this is here to prevent creating multiple editors for nothing
    let runned = false;
    useEffect(() => {
        if (!runned && !isArticleLoading && isIdValid) {

            setupEditor().then(() => {
                // Load already existing body if there is one
                if (loadedBody) {
                    editor.current.render(loadedBody);
                }

                // Add listeners to every input for autoSave
                listenChangesSave(debounceAutoSave); 

                const title = document.getElementById("title");
                title.addEventListener("keydown", (event) => {
                    if (event.key == "Enter" || event.key == "ArrowDown") {
                        event.preventDefault();
                        document.getElementById("subtitle").focus();
                    }
                });
                const subtitle = document.getElementById("subtitle") as any;
                subtitle.addEventListener("keydown", (event) => {
                    if (event.key == "Enter" || event.key == "ArrowDown") {
                        event.preventDefault();
                        editor.current.focus();
                    } else if (event.key == "Backspace" || event.key == "ArrowUp") {
                        if (!subtitle.value) {
                            document.getElementById("title").focus();
                        }
                    }
                });
                const editorContainer = document.getElementById("editorjs");
                editorContainer.addEventListener("keydown", (event) => {
                    // NOTE: 
                    // there is no debounceAutoSave here because it is runned inside the onChange property of the editor
                    // because if it was runned here I would apply only to key press actions
                    if (event.key === "Backspace" || event.key == "ArrowUp") {
                        const editorBlocks = editor.current.blocks.getBlocksCount();
                        if (editorBlocks === 1) {
                            const firstBlock = editor.current.blocks.getBlockByIndex(0);
                            if (firstBlock.isEmpty) {
                                document.getElementById("subtitle").focus();
                            }
                        }
                    }
                });

                // Resize textarea so they are like inputs but with breakline
                const autoResizeInputs = document.querySelectorAll(".auto-resize");
                for (let input of autoResizeInputs) {
                    input.addEventListener("input", autoResize, false);

                    function autoResize() {
                        this.style.height = "auto";
                        this.style.height = this.scrollHeight + "px";
                    }
                }

                runned = true;
            });
        }
    }, [isArticleLoading]);

    async function blogEmpty() {
        const articleContent = await getContent();

        // Check if the blocks of the body are empty or not
        let is_body_empty = true;
        if (articleContent.body && articleContent.body["blocks"]) {
            for (let block of articleContent.body["blocks"]) {
                if (block.type == "paragraph") {
                    if (block.data.text) {
                        is_body_empty = false;
                    }
                } else if (block.type == "image"){
                    if (block.data.url && block.data.caption) {
                        is_body_empty = false;
                    }
                } 
                else {
                    is_body_empty = false;
                }
            }
        }

        let is_empty = true;
        if ((articleContent.tags && articleContent.tags.length)
            || articleContent.seo_title 
            || articleContent.seo_keywords 
            || articleContent.url_slug 
            || articleContent.seo_description 
            || articleContent.thumbnail_image
            || articleContent.title
            || articleContent.subtitle
            || (articleContent.body_images && articleContent.body_images.length)
            || !is_body_empty
        ) {
            is_empty = false;
        }

        return is_empty;
    }

    // Create custom logic with useState the re inits everything when there is need so the path can change and be dynamic
    // https://chatgpt.com/c/9bca7fa2-850c-4438-8441-6902911ead49
    const [articleId, setArticleId] = useState<string | null>(getIdFromCurrentUrl() ? getIdFromCurrentUrl() : "");

    // Query parameters are used for the frontend code and req parameters for the backend because it is more easy to work with urls in this way
    const customPost = useAdminCustomPost(
        createPathRequest(articleId), []
    )
    const mutatePost = customPost.mutate;
    const customDelete = useAdminCustomDelete(
        createPathRequest(articleId), []
    )
    const mutateDelete = customDelete.mutate;

    const successAutoSave = async (response) => {
        console.log(`INFO - ARTICLE UPLOAD/DELETE - RESPONSE`)
        console.log(response)
        console.log("-------------")

        // Show error if there is
        if (!response.success) {
            setStatusSaved(`Unable to save, server error: ${response.error}`);
            return setStatusSavedError(true);
        }

        // If page is blank that means that the article is deleted, show a message
        if (await blogEmpty()) {
            // If the blog is deleted I want the submit button to become as it would be with the draft upload and reset the page
            setDraftStatus(true);

            // Reset article_id
            setArticleId("");

            // Change saved status to deleted
            setStatusSaved("Article deleted because the content is empty")

            // If blog is empty and so is deleted remove the id
            const newUrl = removeIdFromCurrentUrl();
            if (newUrl != window.location.toString()) {
                window.history.pushState({ path: newUrl}, '', newUrl);
            }
            
            return;
        }
        // Save article id if there is one
        setArticleId(response.article.id.split("blog_article_")[1]);

        // Change url slug with /:id_blog_post and only if path is different
        const newUrl = addIdFromCurrentUrl(response.article.id.split("blog_article_")[1])
        if (newUrl != window.location.toString()) {
            window.history.pushState({ path: newUrl}, '', newUrl)
        }

        // Change state and show time saved
        const dateSaved = new Date();
        setStatusSaved(`Saved at ${formatDateManually(dateSaved)}`);
        setStatusSavedError(false);

        // If the blog is created I want the submit button to become as it would be with the draft upload and reset the page
        setDraftStatus(true);
    }
    const errorAutoSave = () => {
        setStatusSaved("Unable to save, try again later");
        setStatusSavedError(true);
    }

    const autoSave = async () => {

        // Upload the changes
        const articleContent = await getContent(true);

        if (articleContent.error) {
            setStatusSaved(articleContent.error);
            return setStatusSavedError(true);
        }

        // Check if blog is empty and if yes delete it
        const is_blog_empty = await blogEmpty();
        if (!is_blog_empty && !getIdFromCurrentUrl()) {
            // Create element
            mutatePost({...articleContent}, {onSuccess: successAutoSave, onError: errorAutoSave});
        } else if (!is_blog_empty && getIdFromCurrentUrl()) {
            // Modify element
            mutatePost({...articleContent}, {onSuccess: successAutoSave, onError: errorAutoSave});
        } else {
            // Delete element
            mutateDelete({id: getIdFromCurrentUrl()}, {onSuccess: successAutoSave, onError: errorAutoSave})
        }
    }

    const handleChangeDraft = async (new_draft_status) => {
        if (!getIdFromCurrentUrl() || await blogEmpty()) {
            setSubmitError("You cannot changed the draft status if the article is empty or the article is not saved");
            setSubmitSuccess("");
            return { error: true };
        }

        return mutatePost(
            {
                change_draft_status: true, // Needed so the backend can recognize to change only the draft column
                draft: new_draft_status // States are not changed instantly this prevents any "timing" errors
            },
            {
                onSuccess: async (event) => {
                    if (event.error) {
                        setSubmitError(event.error);
                        setSubmitSuccess("");
                    }
                    else {
                        setSubmitError("");
                        setSubmitSuccess("Draft status changed successfully");
                    }
                },
                onError: async (event) => {
                    setSubmitError(event.error);
                    setSubmitSuccess("");
                }
            }
        );
    }

    const uploadFile = useAdminUploadFile();
    const deleteFile = useAdminDeleteFile();
    const [selectedFile, setSelectedFile] = useState<string | null>(null); // For thumbnail image
    const getContent = async (upload_images: boolean = false) => {
        let body = editor.current ? (await editor.current.save()) : null;
        if (body && !body["blocks"].length) {
            body = null; // If there is no body blocks delete it
        }

        // Save images inside the body
        const body_images: string[] = [];

        // Create an array to hold all the Promises
        const uploadPromises = [];

        // Hold all the upload images, in case there is an error it is more easy to delete them
        const uploadedImages: string[] = [];

        // This is needed in case some files need to be deleted from the database
        const alreadyUploadedImages: string[] = [];

        // Upload all images inside the body if they are not already inside the db
        if (body && body["blocks"]) {
            for (let block of body["blocks"]) {
                if (block.type == "image") {
                    if (upload_images && block.data.url) { // If also it isn't an empty string
                        /* 
                        STEPS
                        1. check for new values, to do so look and the urls that have blob: inside
                        2. upload the new images, if it succeed cache the new images, if it fails show an error
                        */

                        if (block.data.url.includes("blob:")) {
                            const uploadPromise = new Promise(async (resolve, reject) => {
                                uploadFile.mutate(await createFileFromBlobURL(block.data.url, "blog_article_body"), {
                                    onSuccess: ({ uploads }) => {
                                        block.data.url = uploads[0].url;
                                        body_images.push(uploads[0].url);
                                        uploadedImages.push(block.data.url);

                                        // Select the element using the data-id
                                        const element = document.querySelector(`.ce-block[data-id="${block.id}"]`);
                                        // Check if the element exists
                                        if (element) {
                                            // Find the img element within the selected element
                                            const imgElement = element.querySelector('.cdx-simple-image__picture img');
                                            // Check if the img element exists
                                            if (imgElement) {
                                                // Change the src attribute of the img element
                                                imgElement.src = block.data.url;
                                            } else {
                                                reject();
                                            }
                                        } else {
                                            reject();
                                        }

                                        resolve(undefined);
                                    },
                                    onError: () => {
                                        reject();
                                    }
                                })
                            })
                            uploadPromises.push(uploadPromise);
                        } else {
                            body_images.push(block.data.url);
                            alreadyUploadedImages.push(block.data.url);
                        }
                    } else {
                        body_images.push(block.data.url)
                    }
                }
            }
        }
        // Upload thumbnail image
        let thumbnail_image_url = document.getElementById("thumbnail")?.src ?? null;
        if (thumbnail_image_url && upload_images) {
            if (thumbnail_image_url.includes('blob:')) {
                const uploadPromise = new Promise(async (resolve, reject) => {
                    uploadFile.mutate(await createFileFromBlobURL(thumbnail_image_url, "blog_article_thumbnail"), {
                        onSuccess: ({ uploads }) => {
                            thumbnail_image_url = uploads[0].url;
                            uploadedImages.push(thumbnail_image_url);
                            setSelectedFile(thumbnail_image_url);
                            resolve(undefined);
                        },
                        onError: () => {
                            reject();
                        }
                    })
                })
                uploadPromises.push(uploadPromise);
            } else {
                alreadyUploadedImages.push(thumbnail_image_url)
            }
        }

        // Wait for all upload promises to resolve
        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            /*
            If there is at least on rejected promises delete all files that 
            were added from the DB
            */
            for (let image of uploadedImages) {
                const file_key = image.split('/').slice(-1)[0];
                deleteFile.mutate({
                    file_key: file_key
                })
            }
            return { error: "One or more image uploads/deletion failed"};
        }

        /*
        If the first part of the managing file process works that means that elements can be 
        deleted without any error. And even if there will be any image without a body or thumbnail
        this issue can be easily addressed with a cron job
        */

        // Delete images if they are not inside the body or thumbnail anymore
        if (upload_images) {
            console.log(imagesCache.current)
            for (let image of imagesCache.current) {
                if (!alreadyUploadedImages.includes(image)) {
                    const file_key = image.split('/').slice(-1)[0];
                    deleteFile.mutate({
                        file_key: file_key
                    })
                }
            }
        }

        if (upload_images) {
            console.log(mergeUniqueArrays(alreadyUploadedImages, uploadedImages))
            imagesCache.current = mergeUniqueArrays(alreadyUploadedImages, uploadedImages);
        }

        let article = {
            author: document.getElementById("author")?.value,
            tags: document.getElementById("tags")?.value ? (JSON.parse(document.getElementById("tags").value)).map(obj => obj.value) : [],
            seo_title: document.getElementById("seo-title")?.value,
            seo_keywords: document.getElementById("seo-keywords")?.value,
            url_slug: document.getElementById("url-slug")?.value,
            seo_description: document.getElementById("seo-description")?.value,

            thumbnail_image: thumbnail_image_url,
            title: document.getElementById("title")?.value,
            subtitle: document.getElementById("subtitle")?.value,
            body: body,
            body_images: body_images.length ? body_images : null,

            draft: draftStatus
        }

        // Delete key if it is not mandatory and it does not exists
        for (let key of Object.keys(article)) {
            if (!["title", "draft"].includes(key)) {
                if (!article[key] || (Array.isArray(article[key]) && !article[key].length)) {
                    delete article[key]
                }
            }
        }
        return article;
    }

    return (
        <div>
            <div className={`${isArticleLoading ? "" : "hidden"} grid place-items-center my-5`}>
                <p className="font-light">Loading article...</p>
            </div>
            <div className={`${isArticleLoading ? "hidden" : ""}`}>
                {
                    isIdValid ? 
                    (
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center text-xs">
                                    <p className={`${statusSavedError ? "text-red-400" : "text-gray-400"} text-sm`}>{statusSaved}</p>
                                    <Button
                                        className="px-5 py-1.5"
                                        variant="secondary"
                                        onClick={() => {
                                            setShowUpload(!show_upload);
                                            setUploadOpened(true);
                                        }}
                                        size="small"
                                    >
                                        Upload
                                    </Button>
                                </div>
                                <UploadArticleItem
                                    show_upload={show_upload}
                                    upload_opened={uploadOpened}
                                    inputs={inputs}
                                    handleChangeDraft={handleChangeDraft}
                                    submitError={submitError}
                                    submitSuccess={submitSuccess}
                                    draftStatus={draftStatus}
                                    setDraftStatus={setDraftStatus}
                                />
                            </div>

                            <Container className="flex flex-col items-center gap-6 p-5 mb-12">
                                <UploadImageItem 
                                fileChangeHandler={fileChangeHandler} 
                                loadedThumbnailImage={loadedThumbnailImage}
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                />
                                <div className="flex flex-col gap-0.5 px-11 max-w-7xl w-full">
                                    <textarea
                                        rows={1}
                                        className="auto-resize overflow-hidden resize-none h-auto font-semibold text-4xl text-gray-700 bg-transparent focus:outline-none auto-height-input"
                                        placeholder="Title"
                                        onChange={(event) => {
                                            setInputs({ ...inputs, title: event.target.value });
                                        }}
                                        name="title"
                                        id="title"
                                    ></textarea>
                                    <textarea
                                        rows={1}
                                        className="auto-resize overflow-hidden resize-none font-medium h-auto text-xl text-gray-500 bg-transparent focus:outline-none auto-height-input"
                                        placeholder="Subtitle"
                                        onChange={(event) => {
                                            setInputs({
                                                ...inputs,
                                                subtitle: event.target.value,
                                            });
                                        }}
                                        name="subtitle"
                                        id="subtitle"
                                    ></textarea>
                                    <div
                                        id="editorjs"
                                        className="text-gray-700 break-words mt-1"
                                    ></div>
                                </div>
                            </Container>

                            <style>
                                {`
                                    .ce-block__content, 
                                    .ce-toolbar__content {
                                    max-width: 100%; 
                                    }
                                    .ce-toolbar__plus svg path {
                                        stroke: rgb(55 65 81);
                                    }
                                    .ce-toolbar__settings-btn {
                                        margin-left: -0.125rem;
                                    }
                                    .ce-toolbar__actions {
                                        margin-right: -0.0625rem;
                                    }
                                    .codex-editor__redactor {
                                        padding-bottom: 13rem !important; 
                                        min-height: 16rem;
                                    }
                                    h1 {
                                        font-size: 2rem;
                                    }
                                    h2 {
                                        font-size: 1.5rem;
                                    }
                                    h3 {
                                        font-size: 1.17rem;
                                    }
                                    h4 {
                                        font-size: 1rem;
                                    }
                                    h5 {
                                        font-size: 0.83rem;
                                    }
                                    h6 {
                                        font-size: 0.67rem;
                                    }
                                    `}
                            </style>
                        </div>
                    ) :
                    (
                        <div className="flex flex-col items-center my-5">
                            <h6 className="font-bold text-2xl">
                                404
                            </h6>
                            <p className="text-sm max-w-sm text-center">
                                The ID in the query does not correspond to any article
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
export default ArticleEditorPage;