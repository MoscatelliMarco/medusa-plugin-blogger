# Medusa-Plugin-Blog

A blog integration in your medusajs admin page.

TODO add image of blog articles page and post article page

# Getting started

### Installation

Run the following command in the directory of the Medusa backend:
```bash
yarn add medusa-plugin-blog
```

### Add to medusa-config.js

In `medusa-config.js` add the following to the `plugins` array:
```js
const plugins = {
  ///...other plugins
  {
    resolve: 'medusa-plugin-blog',
    options: {
      enableUI: true,
    },
  }
}
```

### Update database schema

Run the following command from the root of the project to udpate database with a new table required for storing product variant

```bash
npx medusa migrations run
```

## API endpoints

```GET /store/blog/articles```

This endpoint accepts bodies to do a conditional search using TypeORM where parameter, blog_articles can be search by any filter, here are some thing to take into consideration:
- IDs can be fetched with these two formats `blog_article_01HZHPGPY4MTR97EVX6FDDEXZE` and `01HZHPGPY4MTR97EVX6FDDEXZE`, both versions are valid
- When adding a `tags` key to the body, they must be an array and the database will be searched for an element that has at least all the tags inside the `tags` value in the body
- We do not yet allow searches over the body

TODO add javascript code to send and understand requests to endpoints