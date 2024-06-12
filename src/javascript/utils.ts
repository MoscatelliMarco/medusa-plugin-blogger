import Tagify from '@yaireo/tagify';

/*
This import seems to cause:
Module not found: Error: Can't resolve 'react-native-sqlite-storage'

Which at the time I am writing this comment is not causing any visible problem
*/
import { ILike, Like, Raw } from "typeorm"

export const listenChangesSave = (debounceAutoSave) => {
    const title = document.getElementById("title");
    title.addEventListener("keyup", () => debounceAutoSave());
    const subtitle = document.getElementById("subtitle");
    subtitle.addEventListener("keyup", () => debounceAutoSave());

    const author = document.getElementById("author");
    author.addEventListener("keyup", () => debounceAutoSave())
    const tags = document.getElementById("tags");
    tags.addEventListener("change", () => debounceAutoSave())
    const seo_title = document.getElementById("seo-title");
    seo_title.addEventListener("keyup", () => debounceAutoSave())
    const seo_keywords = document.getElementById("seo-keywords");
    seo_keywords.addEventListener("keyup", () => debounceAutoSave())
    const url_slug = document.getElementById("url-slug");
    url_slug.addEventListener("keyup", () => debounceAutoSave())
    const seo_description = document.getElementById("seo-description");
    seo_description.addEventListener("keyup", () => debounceAutoSave())
}

export const loadArticle = (article) => {
    const title = document.getElementById("title") as any;
    title.value = article.title ? article.title : "";

    const subtitle = document.getElementById("subtitle") as any;
    subtitle.value = article.subtitle ? article.subtitle : "";

    const author = document.getElementById("author") as any;
    author.value = article.author ? article.author : "";
    const seo_title = document.getElementById("seo-title") as any;
    seo_title.value = article.seo_title ? article.seo_title : "";
    const seo_keywords = document.getElementById("seo-keywords") as any;
    seo_keywords.value = article.seo_keywords ? article.seo_keywords : "";
    const url_slug = document.getElementById("url-slug") as any;
    url_slug.value = article.url_slug ? article.url_slug : "";
    const seo_description = document.getElementById("seo-description") as any;
    seo_description.value = article.seo_description ? article.seo_description : "";

    // Tagify requires a different procedure to load tags
    const tags = document.getElementById("tags");
    const tagify = new Tagify(tags);
    tagify.addTags(article.tags);
}

export const formatDateManually = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}  ${hours}:${minutes}:${seconds}`;
}

export const getIdFromCurrentUrl = () => {
    const urlObj = new URL(window.location.href);
    return urlObj.searchParams.get('id');
}

export const addIdFromCurrentUrl = (id) => {
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.set('id', id);
    return urlObj.toString();
}

export const removeIdFromCurrentUrl = () => {
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.delete('id');
    return urlObj.toString();
}

export const createPathRequest = (articleId, base_path = "/blog/articles") => articleId ? base_path + "/" + articleId : base_path

export const convertObjToSearchQuery = (obj, use_ilike=false) => {
    const result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key]) {
                if (typeof obj[key] == "string") {
                    if (key == "id") {
                        result[key] = Like("%" + obj[key].replace(/[%_]/g, '\\$&'));
                    } else {
                        if (use_ilike) {
                            result[key] = ILike(obj[key]);
                        } else {
                            result[key] = Like(obj[key]);
                        }
                    }
                } else if (Array.isArray(obj[key]) && key == "tags") { // Only works with the column tags
                    const tagsString = `{${obj[key].join(',')}}`;
                    result[key] = Raw(alias => `${alias} @> :tags`, { tags: tagsString });
                } else {
                    result[key] = obj[key];
                }
            }
        }
    }
    return result;
}

export const mergeUniqueArrays = <T>(array1: T[], array2: T[]): T[] => {
    const combinedArray = [...array1, ...array2];
    const uniqueArray = Array.from(new Set(combinedArray));
    return uniqueArray;
  };