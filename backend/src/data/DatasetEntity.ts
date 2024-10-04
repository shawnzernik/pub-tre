import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { DatasetDto } from "common/src/models/DatasetDto";

@Entity('datasets')
export class DatasetEntity implements DatasetDto, CopyInterface<DatasetDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: 'include_in_training', default: false })
    public includeInTraining: boolean = false;

    @Column({ name: 'title' })
    public title: string = "";

    @Column({ name: 'json' })
    public json: string = "";

    public copyFrom(source: DatasetDto): void {
        this.guid = source.guid;
        this.includeInTraining = source.includeInTraining;
        this.title = source.title;
        this.json = source.json;
    }
    public copyTo(dest: DatasetDto): void {
        dest.guid = this.guid;
        dest.includeInTraining = this.includeInTraining;
        dest.title = this.title;
        dest.json = this.json;
    }
}