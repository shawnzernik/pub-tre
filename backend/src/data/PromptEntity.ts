import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { PromptDto } from "common/src/models/PromptDto";

@Entity('prompts')
export class PromptEntity implements PromptDto, CopyInterface<PromptDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: 'title' })
    public title: string = "";

    @Column({ name: 'json' })
    public json: string = "";

    public copyFrom(source: PromptDto): void {
        this.guid = source.guid;
        this.title = source.title;
        this.json = source.json;
    }
    public copyTo(dest: PromptDto): void {
        dest.guid = this.guid;
        dest.title = this.title;
        dest.json = this.json;
    }
}