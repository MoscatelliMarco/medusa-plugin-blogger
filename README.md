# Medusa-Plugin-Blog

A blog integration in your medusajs admin page.

TODO add image of blog articles page and post article page

# Getting started

Installation

```bash
yarn add medusa-plugin-blog
```

# Usage

## Configuration

### Add to medusa-config.js

add to your plugins list

```json
///...other plugins
  {
    resolve: 'medusa-plugin-blog',
    options: {
      enableUI: true,
    },
  },

```

### Update database schema

Run the following command from the root of the project to udpate database with a new table required for storing product variant

```bash
npx medusa migrations run
```

## API endpoints

TODO add API endpoints to access in the frontend

TODO add javascript code to send and understand requests to endpoints