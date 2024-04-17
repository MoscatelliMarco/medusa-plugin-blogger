import { 
    BeforeInsert, 
    Column, 
    Entity,
    PrimaryGeneratedColumn
} from "typeorm"
import { BaseEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
  
@Entity()
export class BlogArticle extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: true })
    author: string;

    @Column('text', { array: true, nullable: true })
    tags: string[];

    @Column({ name: 'seo_title', nullable: true })
    seoTitle: string;

    @Column({ name: 'seo_keywords', nullable: true })
    seoKeywords: string;

    @Column({ name: 'url_slug', nullable: true })
    urlSlug: string;

    @Column({ name: 'seo_description', nullable: true })
    seoDescription: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    subtitle: string;

    @Column('jsonb', { nullable: false })
    body: any; // Assuming body will be a complex JSON structure

    @Column({ nullable: false })
    draft: boolean;

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "blog_article")
    }
}