import { Container, Button } from "@medusajs/ui";
import { Trash } from "@medusajs/icons";
import { useState } from "react";

export const ArticleCard = (props) => {
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    return (
        <Container className="container p-2 rounded-md min-h-72 relative h-full">
            {
                showConfirmationDelete ?
                <div onClick={() => {setShowConfirmationDelete(false);}} className="absolute z-20 top-0 left-0 w-full h-full backdrop-blur-md flex flex-col gap-0.5 items-center text-center justify-center">
                    <p className="font-medium w-60 text-lg">
                        Are you sure you want to delete this article?
                    </p>
                    <p className="text-gray-500 text-sm w-60 font-medium">
                        This action can't be undone
                    </p>
                    <Button variant="danger" className="mt-3 flex items-center text-sm" onClick={() => {props.setArticleIdDelete(props.article.id);}}>
                        <Trash />
                        <span>Delete</span>
                    </Button>
                </div> 
                :
                ""
            }
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
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg leading-tight font-medium">{props.article.title?.length > 60 ? 
                        props.article.title.slice(0, 60).trim() + "..." : 
                        (props.article.title || <span className="text-gray-500/90">Missing title</span>)}</h3>
                        <p className="text-gray-600 leading-tight -mt-0.5">{props.article.subtitle?.length > 100 ? 
                        props.article.subtitle.slice(0, 100).trim() + "..." : 
                        (props.article.subtitle || <span className="text-gray-400">Missing subtitle</span>)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-0.5">
                        <p className="text-gray-500 font-medium text-sm">
                            {props.article.created_at.split("T")[0]}
                        </p>
                        <Button onClick={(event) => {setShowConfirmationDelete(true); event.stopPropagation(); event.preventDefault();}} variant="danger" size="small" className="flex items-center text-sm">
                            <Trash />
                            <span>Delete</span>
                        </Button>
                    </div>
                </div>
            </a>
        </Container>
    )
}