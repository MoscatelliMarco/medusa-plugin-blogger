import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa"
import { BlogArticle } from "../../../../../models/blog_article"
import { EntityManager } from "typeorm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const blog_article_id = req.params.id;

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
        
        article = {...anyreq.body};
        await articleRepo.save(article);

        return res.json({
            success: true,
            article: {...anyreq.body},
        })
    } catch (e) {
        return res.json({error: e.toString(), error_obj: e})
    }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const blog_article_id = req.params.id;
    
    return res.json({
        success: true
    })
}