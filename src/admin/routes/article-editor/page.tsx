import { useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import UploadArticleItem from "../../../ui-components/upload_article";
import UploadImageItem from "../../../ui-components/upload_image";
import { Button, Container } from "@medusajs/ui";
import { useAdminCustomPost } from "medusa-react";

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

type EditorState = EditorJS | null;

const ArticleEditorPage = () => {
    const [show_upload, setShowUpload] = useState(false);
    const [uploadOpened, setUploadOpened] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [editor, setEditor] = useState<EditorState>(null);
    const [inputs, setInputs] = useState({
        title: "",
        subtitle: "",
    });

    // With MedusaJS the component is initialized two times, this is here to prevent creating multiple editors for nothing
    let runned = false;
    useEffect(() => {
        if (!runned) {
            let editor_el = new EditorJS({
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
            });
            setEditor(editor_el);
            const title = document.getElementById("title");
            title.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    event.preventDefault();
                    document.getElementById("subtitle").focus();
                }
            });
            const subtitle = document.getElementById("subtitle") as any;
            subtitle.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    event.preventDefault();
                    editor.focus();
                } else if (event.key == "Backspace") {
                    if (!subtitle.value) {
                        document.getElementById("title").focus();
                    }
                }
            });
            const editorContainer = document.getElementById("editorjs");
            editorContainer.addEventListener("keydown", (event) => {
                if (event.key === "Backspace") {
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

    const { mutate } = useAdminCustomPost(
        "/blog/articles",
        [""]
    )

    const onSubmit = async (article) => {
        return mutate(
            {
                ...article
            },
            {
                onSuccess: async (event) => {
                    console.log(event)
                },
                onError: async (event) => {
                    console.log(event)
                }
            }
        )
    }

    const handleClick = async () => {
        const article = await getContent();
        if (!article) {
            return
        }
        onSubmit(article)
    }

    const getContent = async () => {
        let article = {
            author: document.getElementById("author")?.value,
            tags: document.getElementById("tags")?.value,
            seo_title: document.getElementById("seo-title")?.value,
            seo_keywords: document.getElementById("seo-keywords")?.value,
            url_slug: document.getElementById("url-slug")?.value,
            seo_description: document.getElementById("seo-description")?.value,

            image: document.getElementById("thumbnail")?.src,
            title: document.getElementById("title")?.value,
            subtitle: document.getElementById("subtitle")?.value,
            body: await editor?.save()
        }
        return article;
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col">
                <div className="flex justify-between items-center text-xs">
                    <p className="text-gray-400 text-sm">Saved</p>
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
