import { RouteConfig } from "@medusajs/admin";
import {
    DocumentSeries,
    ArchiveBox,
    MagnifyingGlass,
    Funnel,
    TrianglesMini,
} from "@medusajs/icons";
import ArticleItem from "../../../ui-components/article_item";
import { Link } from "react-router-dom";
import { Button, Input, Container } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { useAdminCustomQuery } from "medusa-react";

const ArticlePage = () => {
    const [error, setError] = useState("");

    const { data, isLoading } = useAdminCustomQuery(
        "/blog/articles",
        [""]
    )

    useEffect(() => {
        console.log(data)
        if (data?.error) {
            setError(data.error)
        } else {
            // Initialize articles in case of success
        }
    }, [data])

    return (
        <div className="flex flex-col gap-7 items-center break-words">
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
                isLoading ?
                    (<p className="text-center max-w-sm text-green-500 mt-4 font-medium">Loading...</p>)
                :
                (
                    !error ? 
                    (
                        JSON.stringify(data)
                    // <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                    //     <Container className="p-1.5">
                    //         <ArticleItem />
                    //     </Container>
                    //     <Container className="p-1.5">
                    //         <ArticleItem />
                    //     </Container>
                    // </div>
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
