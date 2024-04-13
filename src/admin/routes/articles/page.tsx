import { RouteConfig } from "@medusajs/admin"
import { DocumentSeries, ArchiveBox, MagnifyingGlass, Funnel, TrianglesMini } from "@medusajs/icons"
import ArticleItem from "../../../ui-components/article_item";
import { Link } from "react-router-dom";

const ArticlePage = () => {
  return (
    <div className="flex flex-col gap-7">

        <div className="flex justify-between items-center">
            <Link to="/a/article-editor" className="px-3 py-2 rounded bg-green-500 text-white font-medium flex gap-3 items-center">
                <ArchiveBox/>
                New article
            </Link>
            <div className="flex items-center gap-2">
                <div className="px-3 py-2 flex gap-2 items-center text-white bg-blue-500 rounded font-medium">
                    <TrianglesMini />
                    Sort by
                </div>
                <div className="px-3 py-2 flex gap-2 items-center text-white bg-yellow-500 rounded font-medium">
                    <Funnel />
                    Filter
                </div>
                <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" className="focus:outline-none border border-gray-300 rounded py-2 pr-3 pl-10 placeholder-gray-400" placeholder="Search" />
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