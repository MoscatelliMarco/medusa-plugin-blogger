import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa";
import { getArticlesRoute } from "../../../../javascript/get_articles_route";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    return getArticlesRoute(req, res);
}