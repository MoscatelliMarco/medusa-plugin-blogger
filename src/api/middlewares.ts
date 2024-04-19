import { MiddlewaresConfig } from "@medusajs/medusa"

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/admin/blog/*",
      bodyParser: { sizeLimit: 64000 }, // in bytes
      // ...
    },
  ],
}