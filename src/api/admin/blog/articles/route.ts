import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa"
import { EntityManager } from "typeorm";
import { BlogArticle } from "../../../../models/blog_article";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const manager: EntityManager = req.scope.resolve("manager");
    const blogArticleRepo = manager.getRepository(BlogArticle);

    const article = await blogArticleRepo.find();
    console.log('__________________________________')
    console.log(article)
    console.log('__________________________________')

    return res.json(article)
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    return res.json({
        success: true
    })
}