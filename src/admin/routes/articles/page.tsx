import { RouteConfig } from "@medusajs/admin";
import { DocumentSeries } from "@medusajs/icons";
import { ArticleCard } from "../../../ui-components/article_card";
import { useEffect, useState } from "react";
import { useAdminCustomQuery, useAdminCustomDelete, useAdminDeleteFile } from "medusa-react";
import { createPathRequest } from "../../../javascript/utils";
import { objectToQueryString } from "../../../javascript/parse_query_params";
import useTimedState from "../../../javascript/useTimedState";
import ToolBar from "../../../ui-components/tool_bar";

const ArticlePage = () => {
    const [error, setError] = useState("");

    const { data, isLoading } = useAdminCustomQuery(
        "/blog/articles?" + objectToQueryString({select: ["id", "thumbnail_image", "body_images" , "title", "subtitle", "created_at"]}),
        [""]
    )

    /* 
    The GET request will change over time as the filters/order changes for this reason a state
    which keeps everything in order is required.
    */
    const [ articles, setArticles ] = useState([]);

    useEffect(() => {
        if (data?.error) {
            setError(data.error);
        } else if (data?.articles) {
            setArticles(data.articles);
        }
    }, [data]);

    // Handler in case an article needs to be deleted
    const [articleIdDelete, setArticleIdDelete] = useState<string>("");
    const [deleteError, setDeleteError] = useTimedState(null, 5000);
    const [deleteSuccess, setDeleteSuccess] = useTimedState(null, 5000);
    const customDelete = useAdminCustomDelete(
        createPathRequest(articleIdDelete), []
    )
    const mutateDelete = customDelete.mutate;
    const deleteFile = useAdminDeleteFile();
    useEffect(() => {
        if (articleIdDelete) {
            deleteArticle();
        }
    }, [articleIdDelete])
    async function deleteArticle() {
        const article = articles.filter(article => article.id == articleIdDelete)[0];

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
        if (article.thumbnail_image) {
            let file_key = article.thumbnail_image.split('/').slice(-1)[0];
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

        try {
            await Promise.all(uploadPromises);
        } catch (e) {
            setDeleteSuccess("");
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
        setArticles(articles => articles.filter(article => article.id != articleIdDelete))
        setDeleteSuccess("Article deleted successfully");
        setDeleteError(null);
    }
    function errorDelete() {
        setDeleteSuccess(null);
        setDeleteError("Couldn't connect to the server, by mindful that the images inside the article are deleted");
    }

    return (
        <div className="flex flex-col gap-7 items-center break-words relative">
            <ToolBar />
            {
                (deleteError || deleteSuccess) ?
                <div className="flex justify-center">
                    {
                        deleteError ? 
                        <p className="text-center max-w-lg font-medium text-red-500">
                            {deleteError}
                        </p> :
                        ""
                    }
                    {
                        deleteSuccess ? 
                        <p className="text-center max-w-lg font-medium text-blue-500">
                            {deleteSuccess}
                        </p> :
                        ""
                    }
                </div> :
                ""
            }
            {
                isLoading ?
                    (<p className="text-center max-w-sm mt-4 font-medium">Loading...</p>)
                :
                (
                    !error ? 
                        // JSON.stringify(data)
                        (articles && articles.length ? 
                        <div className="grid grid-cols-3 w-full gap-x-3 gap-y-2.5">
                            {articles.map((article) => 
                            <ArticleCard article={article} key={article.id} setArticleIdDelete={setArticleIdDelete}
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
