import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { ListDto } from "common/src/models/ListDto";

@Entity('lists')
export class ListEntity implements ListDto, CopyInterface<ListDto> {
	@PrimaryColumn({ name: "guid" })
	public guid: string = "";

	@Column({ name: 'title' })
	public title: string = "";

	@Column({ name: 'url_key' })
	public urlKey: string = "";

	@Column({ name: 'sql', type: 'text' })
	public sql: string = "";

	@Column({ name: 'list_url' })
	public listUrl: string = "";

	@Column({ name: 'edit_url', nullable: true })
	public editUrl?: string = "";

	@Column({ name: 'delete_url', nullable: true })
	public deleteUrl?: string = "";

	@Column({ name: 'autoload', default: false })
	public autoload: boolean = false;

	public copyFrom(source: ListDto): void {
		this.guid = source.guid;
		this.title = source.title;
        this.urlKey = source.urlKey;
		this.sql = source.sql;
		this.listUrl = source.listUrl;
		this.editUrl = source.editUrl;
		this.deleteUrl = source.deleteUrl;
		this.autoload = source.autoload;
	}

	public copyTo(dest: ListDto): void {
		dest.guid = this.guid;
		dest.title = this.title;
        dest.urlKey = this.urlKey;
		dest.sql = this.sql;
		dest.listUrl = this.listUrl;
		dest.editUrl = this.editUrl;
		dest.deleteUrl = this.deleteUrl;
		dest.autoload = this.autoload;
	}
}