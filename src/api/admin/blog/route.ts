import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa"
import BlogArticleRepository from "../../../services/blog_article"
import { EntityManager } from "typeorm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {

}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    // const blogArticleRepository: typeof BlogArticleRepository = req.scope.resolve("blogArticleRepository");
    // const manager: EntityManager = req.scope.resolve("manager");
    // const blogArticleRepo = manager.withRepository(blogArticleRepository);

    // return res.json({
    //     posts: await blogArticleRepo.find(),
    // })
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    
}