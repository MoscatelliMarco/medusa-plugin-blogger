import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBlogPostTable1713183081316 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "blog_article",
            columns: [
                { name: "id", type: "varchar", isPrimary: true},
                { name: "author", type: "varchar", isNullable: true },
                { name: "tags", type: "text[]", isNullable: true },
                { name: "seo_title", type: "varchar", isNullable: true },
                { name: "seo_keywords", type: "varchar", isNullable: true },
                { name: "url_slug", type: "varchar", isNullable: true },
                { name: "seo_description", type: "varchar", isNullable: true },
                { name: "title", type: "varchar" },
                { name: "subtitle", type: "varchar" },
                { name: "body", type: "jsonb" },
                { name: "draft", type: "boolean" },
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'}
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("blog_article");
    }
}