<div align="center">
  <p align="center">
    <img alt="Medusa" src="https://i.imgur.com/1JHWUTL.png" width="200" />
  </p>
<h1>Medusa Plugin Blogger</h1>
<p>A blog integration for medusa</p>
</div>

# Content
1. [Introduction](#introduction)
2. [Getting started](#getting-started)
3. [API endpoints](#api-endpoints)
4. [Storefront integration](#storefront-integration)
5. [Architecture overview](#architecture-overview)

---

# Introduction

A blog integration for your MedusaJS admin page, enabling you to create and manage blog articles directly from the admin interface. This plugin extends the capabilities of MedusaJS, a powerful headless commerce platform, by adding a dedicated blogging feature. With this integration, store administrators can effortlessly create, edit, and publish blog posts to enhance their content marketing strategy, engage customers, and improve SEO.

The Medusa-Plugin-Blogger is designed to provide a seamless user experience, utilizing modern tools and libraries for rich text editing and tag management. By incorporating this plugin into your MedusaJS setup, you can maintain a cohesive content and commerce environment, streamlining your workflow and ensuring consistency across your brand's digital presence.

<div align="center">
  <img src="https://imgur.com/JAfYqeL.png" alt="medusa-plugin-blogger rapresentation" />
</div>

# Getting started  

### Installation

Run the following command in the directory of the Medusa backend:

```bash
yarn add medusa-plugin-blogger
```

### Add to medusa-config.js

In `medusa-config.js` add the following to the `plugins` array:
  
```js
const  plugins = {
  	///...other plugins
  	{
		resolve: 'medusa-plugin-blogger',
		options: {
			enableUI: true,
		},
	}
}
```

### Update database schema

Run the following command from the root of the project to update database with a new table required for storing product variant

```bash
npx medusa migrations run
```

### Required dependencies

A file service is required for this plugin to work.
  
# API endpoints

The max size of the body that an endpoint can receive is `10000000B` which is the equivalent to `10MB`, enough to store tens of academic papers inside an article object. This is enough to store approximately **1.600.000 words** In case you go over this threshold with your article, you will not be able to save it.

## Store endpoints

```GET /store/blog/articles```

Returns a json object of all the articles respecting the conditions passed as query parameters, this endpoint accepts query parameters to do a conditional search using TypeORM find parameter, `blog_articles` can be search using any filter found in the PostgreSQL documentation, because only query parameters are accepted, a function to convert objects to query parameters is provided down here:

```typescript
export const objectToQueryString = (obj) => {
    return Object.keys(obj)
        .map(key => {
            if (Array.isArray(obj[key]) || typeof obj[key] == "object") {
                return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(obj[key]))
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
            }
        }).join('&');
}
```

Here is an example with a commonly found object:

```typescript
const example_object = {
	"where": {
		"id": "01HZHPGPY4MTR97EVX6FDDEXZE"
	},
	"take": 7,
	"skip": 2,
	"select": ["title", "subtitle", "body"],
	"order": {
		"created_at": "ASC"
	}
}
console.log(objectToQueryString(example_object))
```

Output: `where=%7B%22id%22%3A%2201HZHPGPY4MTR97EVX6FDDEXZE%22%7D&take=7&skip=2&select=%5B%22title%22%2C%22subtitle%22%2C%22body%22%5D&order=%7B%22created_at%22%3A%22ASC%22%7D`
This output may look strange at first, almost impossible to understand, but the api routes already parse this url properly into the object that will be passed to search the database.

**Find operators**: if you want to use a specific find operator like `Like` or `ILike` you can send an object like this:
```json
{
  "where": {
    "title": {
      "find_operator": "Like",
      "value": "%Hello World%"
    }
  }
}
```
The supported find operators are: `ILike, Like, Raw, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual`, you can find the meaning of these operators in the [official TypeORM documentation](https://orkhan.gitbook.io/typeorm/docs/find-options). If no supported find operator is found in the object the value will be searched as it is without throwing any error.

In the `where` field if you search for `created_at` and `updated_at` key values, the plugin will automatically try to convert the string values into dates using `new Date(string_value)`, if no date is created than the value searched will be a string, even if it will not give any results because the type of `created_at` and `updated_at` is DATE, be mindful when using these two fields as you'll need to provide a correct date to receive an appropriate result.

See the [Typeorm documentation](https://orkhan.gitbook.io/typeorm/docs/find-options) to understand better what every of these parameters does, keep in mind that the behavior of where is a little bit different from the one in the documentation, there are some things to take into consideration:
- The search works using an equal condition, for keys where the value is not `id` or `tags`, for example if you want to search for an element that has the title "I like pizza", the query parameters that you'll need to send in the request is `{ where { title: "I like pizza" } }`
- IDs can be fetched with these two formats `blog_article_01HZHPGPY4MTR97EVX6FDDEXZE` and `01HZHPGPY4MTR97EVX6FDDEXZE`, both versions are valid
- When adding a `tags` key to the body, they must be an array and the database will be searched for an element that has at least all the tags inside the `tags` value in the query parameters
- We do not yet support searches over the body of the article
- If you want an OR condition in your `where` value you need a list where you need to put all the separate conditions like this `[ {"title" : "Hello World!", "subtitle": "Awesome article"}, {"title" : "Example", "subtitle": "Awesome example"} ]`
- If you want an AND condition in your `where` value for a specific field, you need to list all the conditions for that key, let's say you want a date range you can do it like this `{ "created_at": [{"find_operator": "LessThan","value": "2024-06-14"},{"find_operator": "MoreThanOrEqual","value": "2024-06-12"}]}`
- The body is sanitized automatically from SQL injections

## Admin endpoints

#### ```GET /admin/blog/articles```

Returns a json object of all the articles respecting the conditions passed as query parameters, it works that same way as the homonymous store API routes.

#### ```POST /admin/blog/articles```

Create a new blog article.

**NOTE**: No server validation is done to check if the `url-slug` value is a valid url as this is already done in the frontend and it is assumed that the admin would not do anything to harm its store.

#### ```GET /admin/blog/articles/:id```

Return a json object of the article having the id in the url.

#### ```POST /admin/blog/articles/:id```

Modify an already existing blog article, this route requires the new `BlogArticle` object as well as the id in the url because the old object if completely overwritten with the new one passed over the body.

#### ```DELETE /admin/blog/articles/:id```

Delete an article having the id in the url.

# Storefront integration
The way Medusa Plugin Blogger is developed makes it easy to integrate the plugin with the functionality of MedusaJS and your storefront, there are only two simple steps that you need to follow:
1. Fetch `GET /store/blog/articles` with the conditions that you like (like shown above)
2. You don't need to process further any part of the article because they are already in a form that can be displayed in HTML (for example `title` is already a string that can be displayed, `tags` is already an array that can be displayed) except for the body which you'll need to process into HTML, the editor used for the body is EditorJS which provides a clear JSON object for the body https://editorjs.io/saving-data/

EditorJS divides the body into blocks, which you can easily iterate through and add your logic for every type of block that you use. Depending on what features of the editor you are going to use you can implement text highlighting, code blocks, images, headings, and much more... Everything is left up to your implementation!

To make this more clear here is an example a body with the result after:
```json
{
  "time": 1718394016975,
  "blocks": [
    {
      "id": "bmQCD-2wEi",
      "data": {
        "text": "Databases play a crucial role\n in the development process, but how exactly do they work? In this \narticle, we’ll dive into the internal architecture of MongoDB, a popular\n no-SQL database, to provide a comprehensive explanation."
      },
      "type": "paragraph"
    },
    {
      "id": "pbwAdmpETJ",
      "data": {
        "text": "Understanding how MongoDB works behind the scenes can be incredibly useful for developers looking to leverage its unique features and capabilities. So let’s dive in!"
      },
      "type": "paragraph"
    },
    {
      "id": "-B3th1nCj5",
      "data": {
        "text": "Index",
        "level": 1
      },
      "type": "header"
    },
    {
      "id": "VkmuZ6qh-h",
      "data": {
        "items": [
          {
            "items": [],
            "content": "What is a database?"
          },
          {
            "items": [],
            "content": "What is MongoDB?"
          },
          {
            "items": [],
            "content": "SQL vs no-SQL databases"
          },
          {
            "items": [],
            "content": "What is JSON?"
          },
          {
            "items": [],
            "content": "What the hell is BSON?"
          },
          {
            "items": [],
            "content": "What is Mongoose?"
          }
        ],
        "style": "ordered"
      },
      "type": "list"
    }
  ],
  "version": "2.29.1"
}
```

This is the body of the article below:
<div align="center">
  <img src="https://imgur.com/tUku0si.png" alt="medusa-plugin-blogger rapresentation" />
</div>

# Architecture overview

## Dependencies

Medusa-Plugin-Blogger relies on several key dependencies to provide a rich user experience and robust functionality:

-   **Editor.js**: A block-styled editor that allows for rich text content creation. Editor.js is highly modular and extensible, and the plugin leverages several Editor.js tools including:
-   **React Dropzone**: A simple React component for creating file upload zones. This is used in the blog plugin to facilitate image and file uploads directly within the admin interface.
    
-   **Tagify**: A powerful tagging library that provides an easy-to-use interface for adding and managing tags. Tagify ensures that blog articles can be tagged efficiently, enhancing content categorization and searchability.

## Blog article entity

The BlogArticle entity requires only draft as a mandatory column, this is already handled by the store frontend but there might be need for a custom implementation if working with API routes directly. The choice of not making more columns mandatory was made because the implementation and use the plugin depends strictly on your storefront.

```typescript
@Entity()
export class BlogArticle extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: true })
    author: string;

    @Column('text', { array: true, nullable: true })
    tags: string[];

    @Column({ nullable: true, unique: true })
    seo_title: string;

    @Column({ nullable: true })
    seo_keywords: string;

    @Column({ nullable: true, unique: true })
    url_slug: string;

    @Column({ nullable: true, unique: true })
    seo_description: string;

    @Column({ nullable: true })
    thumbnail_image: string;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    subtitle: string;

    @Column('json', { nullable: true, array: false })
    body: any; // Assuming body will be a complex JSON structure

    @Column("text", { array: true, nullable: true})
    body_images: string[];

    @Column({ nullable: false })
    draft: boolean;

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "blog_article")
    }
}
```

# License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## A special thank to

### Stargazers
[![Stargazers repo roster for @MoscatelliMarco/medusa-plugin-blogger](https://reporoster.com/stars/MoscatelliMarco/medusa-plugin-blogger)](https://github.com/MoscatelliMarco/medusa-plugin-blogger/stargazers)

### Forkers
[![Forkers repo roster for @MoscatelliMarco/medusa-plugin-blogger](https://reporoster.com/forks/MoscatelliMarco/medusa-plugin-blogger)](https://github.com/MoscatelliMarco/medusa-plugin-blogger/network/members)