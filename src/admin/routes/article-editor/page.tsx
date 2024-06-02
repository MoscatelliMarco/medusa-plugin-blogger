import { useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import UploadArticleItem from "../../../ui-components/upload_article";
import UploadImageItem from "../../../ui-components/upload_image";
import { Button, Container } from "@medusajs/ui";
import { useAdminCustomPost, useAdminCustomDelete } from "medusa-react";
import { useSearchParams } from 'react-router-dom';
import { listenChangesSave } from "../../../javascript/utils";

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
    const [draftStatus, setDraftStatus] = useState(true);
    const [inputs, setInputs] = useState({
        title: "",
        subtitle: "",
    });

    // If the id exists save it
    const [searchParams] = useSearchParams();
    useEffect(() => {
        // console.log(searchParams)
    }, [searchParams.get("id")])

    // Auto save debounce if the user doesn't write in the last N seconds
    let timeoutId;
    function debounceAutoSave() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(autoSave, 2000);
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

      let editor;
      async function setupEditor() {
        try {
          editor = await initializeEditor();
          console.log('Editor is ready');
        } catch (error) {
          console.error('Error initializing editor:', error);
        }
      }

    // With MedusaJS the component is initialized two times, this is here to prevent creating multiple editors for nothing
    let runned = false;
    useEffect(() => {
        if (!runned) {

            setupEditor();

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
                    editor.focus();
                } else if (event.key == "Backspace" || event.key == "ArrowUp") {
                    if (!subtitle.value) {
                        document.getElementById("title").focus();
                    }
                }
            });
            const editorContainer = document.getElementById("editorjs");
            editorContainer.addEventListener("change", (event) => {
                // NOTE: 
                // there is no debounceAutoSave here because it is runned inside the onChange property of the editor
                // because if it was runned here I would apply only to key press actions
                if (event.key === "Backspace" || event.key == "ArrowUp") {
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
                input.addEventListener("input", autoResize, false);

                function autoResize() {
                    this.style.height = "auto";
                    this.style.height = this.scrollHeight + "px";
                }
            }

            runned = true;
        }
    }, []);

    function formatDateManually(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day}  ${hours}:${minutes}:${seconds}`;
    }

    async function blogEmpty() {
        const articleContent = await getContent();

        // Check if the blocks of the body are empty or not
        let is_body_empty = true;
        for (let block of articleContent.body) {
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

    // Get article ID from url
    function getArticleIdFromUrl() {
        return window.location.toString().split("/a/article-editor/")[1]
    }

    // Create custom logic with useState the re inits everything when there is need so the path can change and be dynamic
    // https://chatgpt.com/c/9bca7fa2-850c-4438-8441-6902911ead49
    const base_path = "/blog/articles"
    const [articleId, setArticleId] = useState("");
    const createPath = (articleId) => articleId ? base_path + "/" + articleId : base_path
    const customPost = useAdminCustomPost(
        createPath(articleId), []
    )
    const mutatePost = customPost.mutate;
    const customDelete = useAdminCustomDelete(
        createPath(articleId), []
    )
    const mutateDelete = customDelete.mutate;

    const successAutoSave = async (response) => {
        console.log(`INFO - ARTICLE UPLOAD/DELETE - RESPONSE`)
        console.log(response)
        console.log("-------------")

        // Show error if there is
        if (!response.success) {
            return setStatusSaved(`Unable to save, server error: ${response.error}`)
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
            if (`${window.location.origin}/a/article-editor` != window.location.toString()) {
                window.history.pushState({ path: `${window.location.origin}/a/article-editor`}, '', `${window.location.origin}/a/article-editor`)
            }
            
            return;
        }
        // Save article id if there is one
        setArticleId(response.article.id.split("blog_article_")[1]);

        // Change url slug with /:id_blog_post and only if path is different
        if (`${window.location.origin}/a/article-editor/${response.article.id.split("blog_article_")[1]}` != window.location.toString()) {
            window.history.pushState({ path: `${window.location.origin}/a/article-editor/${response.article.id.split("blog_article_")[1]}`}, '', `${window.location.origin}/a/article-editor/${response.article.id.split("blog_article_")[1]}`)
        }

        // Change state and show time saved
        const dateSaved = new Date()
        setStatusSaved(`Saved: ${formatDateManually(dateSaved)}`)
    }
    const errorAutoSave = () => {
        setStatusSaved("Unable to save, try again later");
    }

    useEffect(() => {
        // Change url slug with /:id_blog_post and only if path is different
        window.history.pushState({ path: `${window.location.origin}/a/article-editor${articleId ? "/" + articleId : ""}`}, '', `${window.location.origin}/a/article-editor${articleId ? "/" + articleId : ""}`)
    }, [articleId]);

    const autoSave = async () => {

        // Upload the changes
        const articleContent = await getContent();

        // Check if blog is empty and if yes delete it
        const is_blog_empty = await blogEmpty();
        if (!is_blog_empty && !getArticleIdFromUrl()) {
            // If the blog is created I want the submit button to become as it would be with the draft upload and reset the page
            setDraftStatus(true);
            // Create element
            mutatePost({...articleContent}, {onSuccess: successAutoSave, onError: errorAutoSave});
        } else if (!is_blog_empty && getArticleIdFromUrl()) {
            // Modify element
            mutatePost({...articleContent}, {onSuccess: successAutoSave, onError: errorAutoSave});

            // Change url slug with /:id_blog_post
            // window.history.pushState({ path: `${window.location.origin}/a/article-editor/${"blog_post_id"}`}, '', `${window.location.origin}/a/article-editor/${"blog_post_id"}`)
        } else {
            // Delete element
            console.log("DELETE ELEMENT IN PROGRESS")
            mutateDelete({id: getArticleIdFromUrl()}, {onSuccess: successAutoSave, onError: errorAutoSave})
        }
    }

    const onSubmit = async () => {
        return mutatePost(
            {
                changed_draft_status: true, // Needed so the backend can recognize to change only the draft column
                draft: draftStatus
            },
            {
                onSuccess: async (event) => {
                    if (event.error) {
                        setSubmitError(JSON.stringify(event))
                    }
                    else {
                        setSubmitSuccess("Draft status changed successfully")
                    }
                },
                onError: async (event) => {
                    setSubmitError(JSON.stringify(event))
                }
            }
        )
    }

    const handleClick = async () => {
        if (!getArticleIdFromUrl() || blogEmpty()) {
            return setSubmitError("You cannot changed draft status if the article is empty")
        }
        onSubmit()
    }

    const getContent = async () => {
        const body = (await editor?.save()) ? (await editor?.save())["blocks"] : [];
        const body_images: string[] = [];

        for (let block of body) {
            if (block.type == "image") {
                body_images.push(block.data.url)
            }
        }

        let article = {
            author: document.getElementById("author")?.value,
            tags: document.getElementById("tags")?.value ? (JSON.parse(document.getElementById("tags").value)).map(obj => obj.value) : [],
            seo_title: document.getElementById("seo-title")?.value,
            seo_keywords: document.getElementById("seo-keywords")?.value,
            url_slug: document.getElementById("url-slug")?.value,
            seo_description: document.getElementById("seo-description")?.value,

            thumbnail_image: document.getElementById("thumbnail") ? document.getElementById("thumbnail").src : "",
            title: document.getElementById("title")?.value,
            subtitle: document.getElementById("subtitle")?.value,
            body: body,
            body_images: [],

            draft: draftStatus
        }

        // Delete key if it is not mandatory and it does not exists
        for (let key of Object.keys(article)) {
            if (!["title", "body", "draft"].includes(key)) {
                if (!article[key] || (Array.isArray(article[key]) && !article[key].length)) {
                    delete article[key]
                }
            }
        }
        return article;
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col">
                <div className="flex justify-between items-center text-xs">
                    <p className="text-gray-400 text-sm">{statusSaved}</p>
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
                    handleSubmit={handleClick}
                    submitError={submitError}
                    submitSuccess={submitSuccess}
                    draftStatus={draftStatus}
                    setDraftStatus={setDraftStatus}
                />
            </div>

            <Container className="flex flex-col items-center gap-6 p-5">
                <UploadImageItem />

                <div className="flex flex-col gap-0.5 px-12 max-w-5xl w-full">
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
    );
};
export default ArticleEditorPage;
