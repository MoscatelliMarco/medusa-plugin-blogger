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

        let anyreq = req as any; // Needed to not receive type errors
        let article = {...anyreq.body};

        // Delete key if it is not mandatory and it does not exists 
        for (let key of Object.keys(article)) {
            if (!["title", "body", "draft"].includes(key)) {
                if (!article[key] || (Array.isArray(article[key]) && article[key].length)) {
                    delete article[key]
                }
            }
        }

        const newArticle = articleRepo.create(article)

        await articleRepo.save(newArticle);

        return res.json({
            success: true,
            article: {...newArticle},
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}