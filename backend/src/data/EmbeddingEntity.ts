import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { EmbeddingDto } from "common/src/models/EmbeddingDto";

@Entity('embeddings')
export class EmbeddingEntity implements EmbeddingDto, CopyInterface<EmbeddingDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: 'title', length: 1024 })
    public title: string = "";

    @Column({ name: 'input', type: 'text' })
    public input: string = "";

    @Column({ name: 'embedding_json', type: 'text' })
    public embeddingJson: string = "";

    @Column({ name: 'prompt_tokens', type: 'int' })
    public promptTokens: number = 0;

    @Column({ name: 'total_tokens', type: 'int' })
    public totalTokens: number = 0;

    public copyFrom(source: EmbeddingDto): void {
        this.guid = source.guid;
        this.title = source.title;
        this.input = source.input;
        this.embeddingJson = source.embeddingJson;
        this.promptTokens = source.promptTokens;
        this.totalTokens = source.totalTokens;
    }

    public copyTo(dest: EmbeddingDto): void {
        dest.guid = this.guid;
        dest.title = this.title;
        dest.input = this.input;
        dest.embeddingJson = this.embeddingJson;
        dest.promptTokens = this.promptTokens;
        dest.totalTokens = this.totalTokens;
    }
}