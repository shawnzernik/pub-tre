# Prompt

The following is the user entity:

```
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { UserDto } from "common/src/models/UserDto";

@Entity('users')
export class UserEntity implements UserDto, CopyInterface<UserDto> {
	@PrimaryColumn({ name: "guid" })
	public guid: string = "";

	@Column({ name: 'display_name' })
	public displayName: string = "";

	@Column({ name: 'email_address' })
	public emailAddress: string = "";

	@Column({ name: 'sms_phone' })
	public smsPhone: string = "";

	public copyFrom(source: UserDto): void {
		this.guid = source.guid;
		this.displayName = source.displayName;
		this.emailAddress = source.emailAddress;
		this.smsPhone = source.smsPhone;
	}
	public copyTo(dest: UserDto): void {
		dest.guid = this.guid;
		dest.displayName = this.displayName;
		dest.emailAddress = this.emailAddress;
		dest.smsPhone = this.smsPhone;
	}
}
```

The following is the user service that was created for the user entity.  It only provides get GUID, grt list, post save, and delete GUID endpoints.

```
import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { UserDto } from "common/src/models/UserDto";
import { UserEntity } from "../data/UserEntity";
import { CheckSecurity } from "./CheckSecurity";

export class UserService extends BaseService {
	public constructor(app: express.Express) {
		super();

        console.log("UserService.constructor()");

		app.get("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/users", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.post("/api/v0/user", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
		app.delete("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

    @CheckSecurity("User:Read")
	public async getGuid(req: express.Request, ds: EntitiesDataSource): Promise<UserEntity | null> {
        console.log("UserService.getGuid()");
		const guid = req.params["guid"];
		const ret = await ds.userRepository().findOneBy({ guid: guid });
        return ret;
	}

	@CheckSecurity("User:List")
	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<UserDto[]> {
        console.log("UserService.getList()");
		const ret = await ds.userRepository().find();
        return ret;
	}

	@CheckSecurity("User:Save")
	public async postSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.postSave()");
		const entity = new UserEntity();
		entity.copyFrom(req.body as UserDto);
		await ds.userRepository().save([entity]);
	}

	@CheckSecurity("User:Delete")
	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
        console.log("UserService.deleteGuid()");
		const guid = req.params["guid"];
		await ds.userRepository().delete({ guid: guid });
	}
}
```

Using the following entity:

```
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { ListFilterDto } from "common/src/models/ListFilterDto";

@Entity('list_filters')
export class ListFilterEntity implements ListFilterDto, CopyInterface<ListFilterDto> {
	@PrimaryColumn({ name: "guid" })
	public guid: string = "";

	@Column({ name: 'lists_guid' })
	public listsGuid: string = "";

	@Column({ name: 'label' })
	public label: string = "";

	@Column({ name: 'sql_column' })
	public sqlColumn: string = "";

	@Column({ name: 'sql_type' })
	public sqlType: string = "";

	@Column({ name: 'options_sql', type: 'text', nullable: true })
	public optionsSql?: string = "";

	@Column({ name: 'default_compare', nullable: true })
	public defaultCompare?: string = "";

	@Column({ name: 'default_value', nullable: true })
	public defaultValue?: string = "";

	public copyFrom(source: ListFilterDto): void {
		this.guid = source.guid;
		this.listsGuid = source.listsGuid;
		this.label = source.label;
		this.sqlColumn = source.sqlColumn;
		this.sqlType = source.sqlType;
		this.optionsSql = source.optionsSql;
		this.defaultCompare = source.defaultCompare;
		this.defaultValue = source.defaultValue;
	}

	public copyTo(dest: ListFilterDto): void {
		dest.guid = this.guid;
		dest.listsGuid = this.listsGuid;
		dest.label = this.label;
		dest.sqlColumn = this.sqlColumn;
		dest.sqlType = this.sqlType;
		dest.optionsSql = this.optionsSql;
		dest.defaultCompare = this.defaultCompare;
		dest.defaultValue = this.defaultValue;
	}
}
```

Create a service that was created for the entity.  It should only provide get GUID, grt list, post save, and delete GUID endpoints.