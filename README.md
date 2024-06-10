<div align="center">
  <p align="center">
    <img alt="Medusa" src="https://i.imgur.com/1JHWUTL.png" width="200" />
  </p>
<h1>Awesome MedusaJS</h1>
<p>A blog integration for medusa</p>
</div>

# Content
1. [Introduction](#introduction)
2. [Getting started](#getting-started)
3. [API endpoints](#api-endpoints)
4. [UI guide](#ui-guide)
5. [Architecture overview](architecture-overview)

---

# Introduction

A blog integration for your MedusaJS admin page, enabling you to create and manage blog articles directly from the admin interface. This plugin extends the capabilities of MedusaJS, a powerful headless commerce platform, by adding a dedicated blogging feature. With this integration, store administrators can effortlessly create, edit, and publish blog posts to enhance their content marketing strategy, engage customers, and improve SEO.

The Medusa-Plugin-Blog is designed to provide a seamless user experience, utilizing modern tools and libraries for rich text editing and tag management. By incorporating this plugin into your MedusaJS setup, you can maintain a cohesive content and commerce environment, streamlining your workflow and ensuring consistency across your brand's digital presence.

TODO add image of blog articles page and post article page


# Getting started  

### Installation

Run the following command in the directory of the Medusa backend:

```bash
yarn  add  medusa-plugin-blog
```

### Add to medusa-config.js

In `medusa-config.js` add the following to the `plugins` array:
  
```js
const  plugins = {
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
npx  medusa  migrations  run
```
  
# API endpoints

``GET /store/blog/articles``

This endpoint accepts bodies to do a conditional search using TypeORM where parameter, blog_articles can be search by any filter, here are some thing to take into consideration:

- The search works using an equal condition, for keys where the value is not `id` or `tags`, for example if you want to search for an element that has the title "I like pizza", the json body that you'll need to send in the request is `{ title: "I like pizza" }`
- IDs can be fetched with these two formats `blog_article_01HZHPGPY4MTR97EVX6FDDEXZE` and `01HZHPGPY4MTR97EVX6FDDEXZE`, both versions are valid
- When adding a `tags` key to the body, they must be an array and the database will be searched for an element that has at least all the tags inside the `tags` value in the body
- We do not yet allow searches over the body

TODO add javascript code example for requests
 
# UI Guide

TODO add images of all pages and explaining what they do

**NOTE**: There are no mandatory fields, as your use of the fields depends on your frontend implementation

# Architecture overview


## Dependencies

Medusa-Plugin-Blog relies on several key dependencies to provide a rich user experience and robust functionality:

-   **Editor.js**: A block-styled editor that allows for rich text content creation. Editor.js is highly modular and extensible, and the plugin leverages several Editor.js tools including:
-   **React Dropzone**: A simple React component for creating file upload zones. This is used in the blog plugin to facilitate image and file uploads directly within the admin interface.
    
-   **Tagify**: A powerful tagging library that provides an easy-to-use interface for adding and managing tags. Tagify ensures that blog articles can be tagged efficiently, enhancing content categorization and searchability.

# License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Stargazers
[![Stargazers repo roster for @MoscatelliMarco/medusa-plugin-blog](https://reporoster.com/stars/MoscatelliMarco/medusa-plugin-blog)](https://github.com/MoscatelliMarco/medusa-plugin-blog/stargazers)

### Forkers
[![Forkers repo roster for @MoscatelliMarco/medusa-plugin-blog](https://reporoster.com/forks/MoscatelliMarco/medusa-plugin-blog)](https://github.com/MoscatelliMarco/medusa-plugin-blog/network/members)