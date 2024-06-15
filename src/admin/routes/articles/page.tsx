import { RouteConfig } from "@medusajs/admin";
import { DocumentSeries } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { ArticleCard } from "../../../ui-components/article_card";
import { useEffect, useState, useRef } from "react";
import { useAdminCustomQuery, useAdminCustomDelete, useAdminDeleteFile } from "medusa-react";
import { createPathRequest } from "../../../javascript/utils";
import { objectToQueryString } from "../../../javascript/parse_query_params";
import useTimedState from "../../../javascript/useTimedState";
import ToolBar from "../../../ui-components/tool_bar";

const ArticlePage = () => {
    // Error loading the initial page
    const [error, setError] = useState<string | null>(null);

    // Keep track of articles loadings
    const [ articlesCount, setArticlesCount ] = useState({
        take: 12,
        skip: 0
    });
    const [ filtersSort, setFiltersSort ] = useState({});

    const { data, isLoading } = useAdminCustomQuery(
        "/blog/articles?" + objectToQueryString(
            {
                select: ["id", "thumbnail_image", "body_images" , "title", "subtitle", "created_at"],
                take: articlesCount.take,
                skip: articlesCount.skip,
                ...filtersSort
            }),
        [""]
    )

    /* 
    The GET request will change over time as the filters/order changes for this reason a state
    which keeps everything in order is required.
    */
    const [ articles, setArticles ] = useState([]);

    const [ articlesLoadState, setArticlesLoadState ] = useTimedState(null, 7000);
    const previousNumberArticles = useRef(0);

    useEffect(() => {
        if (JSON.stringify(filtersSort) != "{}") {
            setArticlesCount((articles_count) => {
                return {...articles_count, skip: 0}
            })
            setArticles([]);
            previousNumberArticles.current = 0;
        }
    }, [JSON.stringify(filtersSort)])

    useEffect(() => {
        if (data) {
            if (data?.error) {
                if (previousNumberArticles.current == 0) {
                    setError(data.error);
                } else {
                    setError(null);
                    // If it is not the first load don't show a full page error
                    setArticlesLoadState("Unable to load more articles: " + data.error)
                }
            } else if (data?.articles) {
                setError(null);
                setArticles(articles => [...articles, ...data.articles]);

                if (!data.articles.length && articles.length) {
                    setArticlesLoadState("There are no more articles left")
                }
            } else {
                setError("We couldn't find any articles, this is probably a bug of the plugin, please file a report");
            }
        }
    }, [data]);
    function loadMoreArticles() {
        setArticlesCount(articles_count => {
            return {...articles_count, skip: articles.length}
        })
    }

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
                if (image) {
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
            void 0, {
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
        <div className="flex flex-col gap-5 items-center break-words relative mb-12">
            <ToolBar setFiltersSort={setFiltersSort}/>
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
                isLoading && !articles.length ?
                    (<p className="text-center max-w-sm mt-4 font-medium">Loading...</p>)
                :
                (
                    !error ? 
                        // JSON.stringify(data)
                        (articles && articles.length ? 
                        <div className="grid grid-cols-3 w-full gap-x-3 gap-y-2.5">
                            {articles.map((article) => 
                                <div key={article.id} className="h-full">
                                    <ArticleCard article={article} setArticleIdDelete={setArticleIdDelete}/>
                                </div>
                            )}
                        </div> :
                        <p className="max-w-sm w-full text-center mt-4 font-medium">No articles found</p>
                        )
                    :
                    (<p className={`${typeof error === 'object' ? "text-start" : "text-center"} max-w-sm text-red-500 mt-4 font-medium`}>{
                        typeof error === 'object' ? JSON.stringify(error) : error
                        }</p>)
                )
            }
            {
                !isLoading && articles.length ? 
                <div>
                    <Button onClick={loadMoreArticles}>
                        Load more
                    </Button>
                </div> :
                ""
            }
            {
                articlesLoadState ?
                <p className="text-center max-w-xl font-medium">
                    {articlesLoadState}
                </p> :
                ""
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
