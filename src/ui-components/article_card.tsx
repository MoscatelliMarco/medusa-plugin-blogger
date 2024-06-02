import { Container } from "@medusajs/ui";

export const ArticleCard = (props) => {
    return (
        <Container className="container p-2 rounded-md flex flex-col h-72">
            <a href={`/a/articles/edit/${props.article.id}`}>
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
            <h3 className="text-lg font-medium">{props.article.title || ""}</h3>
            <p>{props.article.seo_description?.length > 150 ? 
            props.article.seo_description.slice(0, 150).trim() + "..." : 
            (props.article.seo_description || "")}</p>
            </a>
        </Container>
    )
}