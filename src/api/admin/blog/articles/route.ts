import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa"
import { EntityManager } from "typeorm";
import { BlogArticle } from "../../../../models/blog_article";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const blogArticleRepo = manager.getRepository(BlogArticle);

        const article = await blogArticleRepo.find();

        return res.json(article)
    } catch (e) {
        return res.json({error: e})
    }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    return res.json({
        success: true
    })
}