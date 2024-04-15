import { Article } from "../models/article";
import { TransactionBaseService } from "@medusajs/medusa"

class ArticleService extends TransactionBaseService {
    protected articleRepo: any;

    constructor (container) {
        super(container);
        this.articleRepo = this.activeManager_.getRepository(Article);
    }

    async list(): Promise<Article[]> {
        return await this.articleRepo.find()
      }
}

export default ArticleService;