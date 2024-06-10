import { RouteConfig } from "@medusajs/admin";
import {
    DocumentSeries,
    ArchiveBox,
    MagnifyingGlass,
    Funnel,
    TrianglesMini,
} from "@medusajs/icons";
import { ArticleCard } from "../../../ui-components/article_card";
import { Link } from "react-router-dom";
import { Button, Container, Input } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { useAdminCustomQuery, useAdminCustomDelete, useAdminDeleteFile } from "medusa-react";
import { createPathRequest } from "../../../javascript/utils";

const ArticlePage = () => {
    const [error, setError] = useState("");

    const { data, isLoading } = useAdminCustomQuery(
        "/blog/articles",
        [""]
    )

    useEffect(() => {
        if (data?.error) {
            setError(data.error)
        }
    }, [data]);

    // Handler in case an article needs to be deleted
    const [articleIdDelete, setArticleIdDelete] = useState<string>("");
    const [deletePopupShow, setDeletePopupShow] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [successError, setSuccessError] = useState<string | null>(null);
    const customDelete = useAdminCustomDelete(
        createPathRequest(articleIdDelete), []
    )
    const mutateDelete = customDelete.mutate;
    const deleteFile = useAdminDeleteFile();
    function deleteHandlerPopup(id: string) {
        setDeletePopupShow(true);
        setArticleIdDelete(id);
    }
    async function deleteArticle() {
        const article = data["articles"].filter(article => article.id == articleIdDelete)[0];

        const uploadPromises = [];
        if (article.body_images) {
            for (let image of article.body_images) {
                let file_key = image.split('/').slice(-1)[0];
                const uploadPromise = new Promise(async (resolve, reject) => {
                    deleteFile.mutate({ file_key: file_key }, {
                        onSuccess: () => {
                            resolve(undefined);
                        },
                        onError: () => {
                            reject();
                        }
                    })
                })
                uploadPromises.push(uploadPromise);
            }
        }

        try {
            await Promise.all(uploadPromises);
        } catch (e) {
            setSuccessError("");
            return setDeleteError("One or more images inside the article could not be deleted")
        }

        mutateDelete(
            {}, {
                onSuccess: successDelete, 
                onError: errorDelete
            }
        )
    }
    function successDelete() {
        setSuccessError("Article deleted successfully");
        setDeleteError(null);
    }
    function errorDelete() {
        setSuccessError(null);
        setDeleteError("Couldn't connect to the server, by mindful that the images inside the article are deleted");
    }

    return (
        <div className="flex flex-col gap-7 items-center break-words relative">
            { deletePopupShow ? 
            <div style={{transform: "scale(1.2"}} className="z-50 top-0 left-0 h-full w-full backdrop-blur-lg rounded-lg absolute grid place-items-center">
                <Container className="flex flex-col justify-center gap-5 text-center max-w-md items-center">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-lg font-medium">Are you sure your want to delete this article?</p>
                        <p className="text-xs text-gray-600">This action can't be undone</p>
                    </div>
                    <div className="flex justify-center w-full gap-4">
                        <Button variant="secondary" size="small" className="px-5 py-1" onClick={() => {setDeletePopupShow(false)}}>
                            Cancel
                        </Button>
                        <Button variant="danger" size="small" className="px-5 py-1" onClick={() => {setDeletePopupShow(false); deleteArticle()}}>
                            Delete
                        </Button>
                    </div>
                </ Container>
            </div>:
            ""
            }
            <div className="flex justify-between items-center w-full">
                <Link to="/a/article-editor">
                    <Button variant="primary">
                        <ArchiveBox />
                        New article
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="secondary">
                        <TrianglesMini />
                        Sort by
                    </Button>
                    <Button variant="secondary">
                        <Funnel />
                        Filter
                    </Button>
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        {/* <input type="text" className="focus:outline-none border border-gray-300 rounded-md py-1.5 pr-4 pl-10 placeholder-gray-400" placeholder="Search" /> */}
                        <Input className="bg-white" type="search" />
                    </div>
                </div>
            </div>
            {
                (deleteError || successError) ?
                <div className="flex justify-center">
                    {
                        deleteError ? 
                        <p className="text-center max-w-lg font-medium text-red-500">
                            {deleteError}
                        </p> :
                        ""
                    }
                    {
                        successError ? 
                        <p className="text-center max-w-lg font-medium text-red-500">
                            {successError}
                        </p> :
                        ""
                    }
                </div> :
                ""
            }
            {
                isLoading ?
                    (<p className="text-center max-w-sm text-green-500 mt-4 font-medium">Loading...</p>)
                :
                (
                    !error ? 
                        // JSON.stringify(data)
                        (data["articles"] && data["articles"].length ? 
                        <div className="grid grid-cols-3 w-full gap-x-3 gap-y-2.5">
                            {data["articles"].map((article) => 
                            <ArticleCard article={article} key={article.id} deleteHandlerPopup={deleteHandlerPopup}
                        />)}
                        </div> :
                        <p className="max-w-sm w-full text-center mt-4 font-medium">No articles yet</p>
                        )
                    :
                    (<p className={`${typeof error === 'object' ? "text-start" : "text-center"} max-w-sm text-red-500 mt-4 font-medium`}>{
                        typeof error === 'object' ? JSON.stringify(error) : error
                        }</p>)
                )
            }
        </div>
    );
};

export const config: RouteConfig = {
    link: {
        label: "Articles",
        icon: DocumentSeries,
    },
};

export default ArticlePage;
