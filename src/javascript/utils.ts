import Tagify from '@yaireo/tagify';

/*
This import seems to cause:
Module not found: Error: Can't resolve 'react-native-sqlite-storage'

Which at the time I am writing this comment is not causing any visible problem
*/
import { ILike, Like, Raw, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, And } from "typeorm";

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

export const convertObjToSearchQuery = (obj) => {
    let result;

    if (Array.isArray(obj)) {
        result = [];
        for (const element of obj) {
            const [key, value] = Object.entries(element)[0] as any;
            if (typeof value == "string") {
                if (key == "id") {
                    result.push({
                        [key]: Like("%" + value.replace(/[%_]/g, '\\$&'))
                    })
                } else if (key == "created_at" || key == "updated_at") {
                    const date = new Date(value) as any;

                    // If date is NaN return the object as it is
                    if (isNaN(date)) {
                        result.push({
                            [key]: value
                        })
                    } else {
                        result.push({
                            [key]: date
                        })
                    }
                }  else {
                    result.push({
                        [key]: value
                    })
                }
            } else if (Array.isArray(value) && key == "tags") { // Only works with the column tags
                const tagsString = `{${value.join(',')}}`;
                result[key] = Raw(alias => `${alias} @> :tags`, { tags: tagsString });
            } else if (typeof value == "object") {
                let value_to_convert = value?.value;
                if (key == "created_at" || key == "updated_at") {
                    const date = new Date(value_to_convert) as any;

                    // If date is NaN return the object as it is
                    if (!isNaN(date)) {
                        value_to_convert = date;
                    }
                }

                if (value.find_operator == "ILike") {
                    result.push({
                        [key]: ILike(value_to_convert)
                    })
                } else if (value.find_operator == "Like") {
                    result.push({
                        [key]: Like(value_to_convert)
                    })
                } else if (value.find_operator == "LessThan") {
                    result.push({
                            [key]: LessThan(value_to_convert)
                        })
                } else if (value.find_operator == "LessThanOrEqual") {
                    result.push({
                            [key]: LessThanOrEqual(value_to_convert)
                        })
                } else if (value.find_operator == "MoreThan") {
                    result.push({
                            [key]: MoreThan(value_to_convert)
                        })
                } else if (value.find_operator == "MoreThanOrEqual") {
                    result.push({
                            [key]: MoreThanOrEqual(value_to_convert)
                        })
                } else {
                    result.push({
                        [key]: value_to_convert
                    })
                }
            } else {
                result.push({
                    [key]: value
                })
            }
        }
    } else {
        result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key]) {
                    let object_value_to_analyse = obj[key];
                    if (!Array.isArray(object_value_to_analyse)) {
                        object_value_to_analyse = [object_value_to_analyse];
                    }

                    const current_result_key_values = [];
                    for (let value of object_value_to_analyse) {
                        if (typeof value == "string") {
                            if (key == "id") {
                                current_result_key_values.push(Like("%" + value.replace(/[%_]/g, '\\$&')));
                            } else if (key == "created_at" || key == "updated_at") {
                                const date = new Date(value) as any;
        
                                // If date is NaN return the object as it is
                                if (isNaN(date)) {
                                    current_result_key_values.push(value);
                                } else {
                                    current_result_key_values.push(date);
                                }
                            } else {
                                current_result_key_values.push(value);
                            }
                        } else if (Array.isArray(value) && key == "tags") { // Only works with the column tags
                            const tagsString = `{${value.join(',')}}`;
                            current_result_key_values.push(Raw(alias => `${alias} @> :tags`, { tags: tagsString }));
                        } else if (typeof value == "object") {
                            let final_value = value?.value;
                            if (key == "created_at" || key == "updated_at") {
                                const date = new Date(final_value) as any;
        
                                // If date is NaN return the object as it is
                                if (!isNaN(date)) {
                                    final_value = date;
                                }
                            }
        
                            if (value?.find_operator == "ILike") {
                                final_value = ILike(final_value);
                            } else if (value?.find_operator == "Like") {
                                final_value = Like(final_value);
                            } else if (value?.find_operator == "LessThan") {
                                final_value = LessThan(final_value);
                            } else if (value?.find_operator == "LessThanOrEqual") {
                                final_value = LessThanOrEqual(final_value);
                            } else if (value?.find_operator == "MoreThan") {
                                final_value = MoreThan(final_value);
                            } else if (value?.find_operator == "MoreThanOrEqual") {
                                final_value = MoreThanOrEqual(final_value);
                            }
                                
                            current_result_key_values.push(final_value);
                        } else {
                            current_result_key_values.push(value);
                        }
                    }
                    
                    if (current_result_key_values.length > 1) {
                        result[key] = And(...current_result_key_values)
                    } else {
                        result[key] = current_result_key_values[0];
                    }
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