import { RouteConfig } from "@medusajs/admin"
import { DocumentSeries } from "@medusajs/icons"

const ArticlePage = () => {
  return (
    <div>
      This is my custom route
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