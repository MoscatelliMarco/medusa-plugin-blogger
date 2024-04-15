import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBlogPostTable1713183081316 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "article",
            columns: [
                { name: "author", type: "varchar", isNullable: true },
                { name: "tags", type: "text[]", isNullable: true },
                { name: "seo_title", type: "varchar", isNullable: true },
                { name: "seo_keywords", type: "varchar", isNullable: true },
                { name: "url_slug", type: "varchar", isNullable: true },
                { name: "seo_description", type: "varchar", isNullable: true },
                { name: "title", type: "varchar" },
                { name: "subtitle", type: "varchar" },
                { name: "body", type: "jsonb" }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("article");
    }

}