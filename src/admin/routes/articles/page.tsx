import { RouteConfig } from "@medusajs/admin"
import { DocumentSeries, ArchiveBox, MagnifyingGlass, Funnel, TrianglesMini } from "@medusajs/icons"
import ArticleItem from "../../../ui-components/article_item";
import { Link } from "react-router-dom";

const ArticlePage = () => {
  return (
    <div className="flex flex-col gap-7">

        <div className="flex justify-between items-center">
            <Link to="/a/article-editor" className="px-4 py-1.5 rounded-md bg-green-400 text-white font-medium flex gap-3 items-center">
                <ArchiveBox/>
                New article
            </Link>
            <div className="flex items-center gap-2">
                <div className="px-4 py-1.5 flex gap-2 items-center text-white bg-blue-400 rounded-md font-medium">
                    <TrianglesMini />
                    Sort by
                </div>
                <div className="px-4 py-1.5 flex gap-2 items-center text-white bg-yellow-400 rounded-md font-medium">
                    <Funnel />
                    Filter
                </div>
                <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" className="focus:outline-none border border-gray-300 rounded-md py-1.5 pr-4 pl-10 placeholder-gray-400" placeholder="Search" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-x-3 gap-y-4">
            <ArticleItem />
            <ArticleItem />
        </div>

    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Articles",
    icon: DocumentSeries
  },
}

export default ArticlePage;