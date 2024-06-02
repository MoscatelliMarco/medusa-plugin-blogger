export const  listenChangesSave = (debounceAutoSave) => {
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

