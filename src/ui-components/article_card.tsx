import { Container } from "@medusajs/ui";

export const ArticleCard = (props) => {
    return (
        <Container className="container p-2 rounded-md h-72">
            <a href={`/a/article-editor?id=${props.article.id.split("blog_article_")[1]}`} className="flex flex-col gap-1">
                <div className="w-full h-40 overflow-hidden rounded-md shadow-sm border border-dashed border-black/10">
                    {
                        props.article.thumbnail_image ?
                        (
                            <img 
                            src={`${props.article.thumbnail_image}`} 
                            alt="" 
                            className="object-cover"/>
                        ) :
                        (
                            <div className="grid place-items-center h-full text-black/20 font-light text-sm">
                                No thumbnail image
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col gap-2 p-1">
                    <h3 className="text-lg font-medium">{props.article.title || ""}</h3>
                    <p>{props.article.seo_description?.length > 150 ? 
                    props.article.seo_description.slice(0, 150).trim() + "..." : 
                    (props.article.seo_description || "")}</p>
                </div>
            </a>
        </Container>
    )
}