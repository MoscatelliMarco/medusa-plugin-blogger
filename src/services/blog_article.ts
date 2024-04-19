import { BlogArticle } from "../models/blog_article";
import { TransactionBaseService } from "@medusajs/medusa";

class BlogArticleRepository extends TransactionBaseService {
    protected articleRepo: any;

    constructor(container) {
        super(container);
        this.articleRepo = this.activeManager_.getRepository(BlogArticle);
    }

    async find(): Promise<BlogArticle[]> {
        return await this.articleRepo.find();
    }

    async findOne(searchParams?: any): Promise<BlogArticle | undefined> {
        let query = {};
        if (searchParams) {
            query = {
                where: searchParams.where || {},
                order: searchParams.order || {}
            };
        }
        return await this.articleRepo.findOne(query);
    }

    async edit(searchParams: any, updateData: Partial<BlogArticle>): Promise<BlogArticle[]> {
        const articlesToUpdate = await this.articleRepo.find({
            where: searchParams.where || {}
        });

        const updatedArticles = [];
        for (const article of articlesToUpdate) {
            Object.assign(article, updateData);
            const updatedArticle = await this.articleRepo.save(article);
            updatedArticles.push(updatedArticle);
        }

        return updatedArticles;
    }

    async remove(searchParams: any): Promise<BlogArticle[]> {
        const articlesToRemove = await this.articleRepo.find({
            where: searchParams.where || {}
        });

        const removedArticles = [];
        for (const article of articlesToRemove) {
            const removedArticle = await this.articleRepo.remove(article);
            removedArticles.push(removedArticle);
        }

        return removedArticles;
    }
}

export default BlogArticleRepository;