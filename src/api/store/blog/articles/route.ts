import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa";
import { BlogArticle } from "../../../../models/blog_article";
import { EntityManager } from "typeorm";
import { MySqlSanitizationObj } from "../../../../javascript/mysql_sanitization";
import { convertObjToSearchQuery } from "../../../../javascript/utils";
import { parseQueryString } from "../../../../javascript/parse_query_params";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let search_params: any;
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);
        
        search_params = {};
        
        const search_query_obj = parseQueryString(req.query) as any;

        let filters = MySqlSanitizationObj(search_query_obj.where);
        filters = convertObjToSearchQuery(filters, search_query_obj.use_ilike);
        search_params["where"] = filters;

        const { select, order, skip, take } = search_query_obj;
        if (select) search_params["select"] = select;
        if (order) search_params["order"] = order;
        if (typeof skip !== 'undefined') search_params.skip = skip;
        if (typeof take !== 'undefined') search_params.take = take;

        return res.json({
            articles: await articleRepo.find(search_params), 
            sanitized_query: search_params
        })
    } catch (e) {
        return res.json({error: e.toString(), error_obj: e, search_params: search_params})
    }
}