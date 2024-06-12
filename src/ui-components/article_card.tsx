import { Container, Button } from "@medusajs/ui";
import { Trash } from "@medusajs/icons";

export const ArticleCard = (props) => {
    return (
        <Container className="container p-2 rounded-md min-h-72 relative">
            <a href={`/a/article-editor?id=${props.article.id.split("blog_article_")[1]}`} className="flex flex-col gap-2 h-full">
                <div className="shrink-0 w-full h-40 overflow-hidden rounded-md shadow-sm border border-dashed border-black/10">
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
                                Missing thumbnail image
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col gap-2 justify-between p-1 h-full">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-medium">{props.article.title?.length > 60 ? 
                        props.article.title.slice(0, 60).trim() + "..." : 
                        (props.article.title || <span className="text-gray-500/90">Missing title</span>)}</h3>
                        <p className="text-gray-600 -mt-0.5">{props.article.subtitle?.length > 100 ? 
                        props.article.subtitle.slice(0, 100).trim() + "..." : 
                        (props.article.subtitle || <span className="text-gray-400">Missing subtitle</span>)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-0.5">
                        <p className="text-gray-500 font-medium text-sm">
                            {props.article.created_at.split("T")[0]}
                        </p>
                        <Button onClick={(event) => {props.deleteHandlerPopup(props.article.id); event.stopPropagation(); event.preventDefault();}} variant="danger" size="small" className="flex items-center text-sm">
                            <Trash />
                            <span>Delete</span>
                        </Button>
                    </div>
                </div>
            </a>
        </Container>
    )
}