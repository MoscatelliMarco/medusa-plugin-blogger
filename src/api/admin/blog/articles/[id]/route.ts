import type { 
    MedusaRequest, 
    MedusaResponse
} from "@medusajs/medusa"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const blog_article_id = req.params.id;

    return res.json({
        success: true
    })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const blog_article_id = req.params.id;

    return res.json({
        success: true
    })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const blog_article_id = req.params.id;
    
    return res.json({
        success: true
    })
}