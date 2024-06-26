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

    @Column({ nullable: true, unique: true })
    seo_title: string;

    @Column({ nullable: true })
    seo_keywords: string;

    @Column({ nullable: true, unique: true })
    url_slug: string;

    @Column({ nullable: true, unique: true })
    seo_description: string;

    @Column({ nullable: true })
    thumbnail_image: string;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    subtitle: string;

    @Column('json', { nullable: true, array: false })
    body: any; // Assuming body will be a complex JSON structure

    @Column("text", { array: true, nullable: true})
    body_images: string[];

    @Column({ nullable: false })
    draft: boolean;

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "blog_article")
    }
}