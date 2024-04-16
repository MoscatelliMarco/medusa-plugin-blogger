import { RouteConfig } from "@medusajs/admin"
import { DocumentSeries, ArchiveBox, MagnifyingGlass, Funnel, TrianglesMini } from "@medusajs/icons"
import ArticleItem from "../../../ui-components/article_item";
import { Link } from "react-router-dom";
import { Button, Input, Container } from "@medusajs/ui";

const ArticlePage = () => {
  return (
    <div className="flex flex-col gap-7">

        <div className="flex justify-between items-center">
            <Link to="/a/article-editor">
                <Button variant="primary">
                  <ArchiveBox/>
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
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    {/* <input type="text" className="focus:outline-none border border-gray-300 rounded-md py-1.5 pr-4 pl-10 placeholder-gray-400" placeholder="Search" /> */}
                    <Input className="bg-white" type="search" />
                </div>
            </div>
        </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-4">
              <Container className="p-1.5">
                <ArticleItem/>
              </Container>
              <Container className="p-1.5">
                <ArticleItem/>
              </Container>
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