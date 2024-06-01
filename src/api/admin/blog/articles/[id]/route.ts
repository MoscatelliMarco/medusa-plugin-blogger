import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa"
import { BlogArticle } from "../../../../../models/blog_article"
import { EntityManager } from "typeorm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let anyreq = req as any; // Needed to not receive type errors
    const blog_article_id = anyreq.params.id;

    return res.json({
        success: true
    })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);

        let anyreq = req as any; // Needed to not receive type errors
        const id = anyreq.params.id;
        let article = await articleRepo.findOneBy({
            id: "blog_article_" + id
        });
        article = {...article, ...anyreq.body};

        // Delete key if it is not mandatory and it does not exists
        // This code is necessary because the article is overwritten only in the key that are not blank as they need to be removed too
        for (let key of Object.keys(article)) {
            if (!["title", "body", "draft"].includes(key)) {
                if (!article[key] || (Array.isArray(article[key]) && article[key].length)) {
                    delete article[key]
                }
            }
        }

        await articleRepo.save(article);

        return res.json({
            success: true,
            article: article
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    let anyreq = req as any; // Needed to not receive type errors
    const blog_article_id = anyreq.params.id;
    
    return res.json({
        success: true
    })
}