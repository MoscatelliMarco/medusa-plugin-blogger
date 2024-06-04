import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa";
import { BlogArticle } from "../../../../models/blog_article";
import { EntityManager } from "typeorm";
import { MySqlSanitizationObj } from "../../../../javascript/mysql_sanitization";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);
        
        const filters = MySqlSanitizationObj(req.body);

        // TODO fix not searching with appropriate filters
        return res.json({
            articles: await articleRepo.find(filters), 
            sanitized_query: filters
        })
    } catch (e) {
        return res.json({error: e.toString(), error_obj: e})
    }
}