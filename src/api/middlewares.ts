import { MiddlewaresConfig } from "@medusajs/medusa"

export const config: MiddlewaresConfig = {
  routes: [
    {
        matcher: "/blog/articles", // accept larger bodies for articles
        bodyParser: { sizeLimit: 1000000 }, // in bytes
    },
    {
      matcher: "/blog/articles/*", // accept larger bodies for articles
      bodyParser: { sizeLimit: 1000000 }, // in bytes
  },
  ],
}