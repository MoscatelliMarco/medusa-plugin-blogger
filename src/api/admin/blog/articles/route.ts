import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa"
import { BlogArticle } from "../../../../models/blog_article"
import { EntityManager } from "typeorm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {

        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);
        

        return res.json({
            articles: await articleRepo.find()
        })
    } catch (e) {
        return res.json({error: e.toString()})
    }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {

        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);

        const newArticle = articleRepo.create({
            ...req.body
        })

        await articleRepo.save(newArticle);

        return res.json({
            success: true,
            article: {...req.body},
            requestAnswer: newArticle
        })
    } catch (e) {
        return res.json({error: e.toString(), body: {...req.body}})
    }
}