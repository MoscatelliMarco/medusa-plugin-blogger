import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa";
import { BlogArticle } from "../../../../models/blog_article";
import { EntityManager } from "typeorm";
import { MySqlSanitizationObj } from "../../../../javascript/mysql_sanitization";
import { convertObjToSearchQuery } from "../../../../javascript/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);
        
        let filters = MySqlSanitizationObj(req.body);
        filters = convertObjToSearchQuery(filters);

        return res.json({
            articles: await articleRepo.find({ where: filters }), 
            sanitized_query: filters
        })
    } catch (e) {
        return res.json({error: e.toString(), error_obj: e})
    }
}