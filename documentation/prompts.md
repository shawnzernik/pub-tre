# Prompts

## Create DTO from Entity

When asked to create a data transfer object interface from a Postgres table, use the following rules:

- The data transfer object should be an exported interface
- For each column on the table, their should be a corresponding property on the interface
- The data type of the property should be TypeORM's default mapping for the data type of the column
- The name of the data transfer object should be the singular version of the tables name with "Dto" appended
- This file should have no imports

Create a data transfer object interface from the following Postgres table:

```
CREATE TABLE "memberships" {
	"guid" UUID PRIMARY KEY,

	"groups_guid" UUID NOT NULL,
	"users_guid" UUID NOT NULL,

	"is_included" BOOLEAN NOT NULL DEFAULT FALSE
}

ALTER TABLE "memberships" ADD CONSTRAINT "uk_memberships_groups_guid_users_guid" UNIQUE ("groups_guid", "users_guid");
```

Do not provide an explanation for the code.

## Create Entity

When creating an entity from a Postgres table using TypeORM follow these rules:

- import typeorm classes
- import CopyInterface from "common/src/logic/CopyInterface"
- import the data transfer object interface from "common/src/models/"
- the class need to implement
  - the data transfer object interface
  - the CopyInterface of the data transfer object interface type
- the copyFrom should do a memberwise copy from source to this
- the copyTo should so a memberwise copy from this to desc
- each property should have the @Column decorators
- the primary key of UUID type should be a string

The following is an example:

```
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { GroupDto } from "common/src/models/GroupDto";

@Entity('groups')
export class GroupEntity implements GroupDto, CopyInterface<GroupDto> {
	@PrimaryColumn({ name: "guid" })
	public guid: string = "";

	@Column({ name: 'display_name' })
	public displayName: string = "";

	@Column({ name: 'is_administrator' })
	public isAdministrator: boolean = false;

	public copyFrom(source: GroupDto): void {
		this.guid = source.guid;
		this.displayName = source.displayName;
		this.isAdministrator = source.isAdministrator
	}
	public copyTo(dest: GroupDto): void {
		dest.guid = this.guid;
		dest.displayName = this.displayName;
		dest.isAdministrator = this.isAdministrator
	}
}
```

The following is "common/src/logic/CopyInterface":

```
export interface CopyInterface<T> {
	copyFrom(source: T): void;
	copyTo(dest: T): void;
}
```

Creating an entity from the following Postgres table using TypeORM:

```
CREATE TABLE "users" {
	"guid" UUID PRIMARY KEY,

	"display_name" VARCHAR(100) NOT NULL,
	"email_address" VARCHAR(250) NOT NULL,
	"sms_phone" VARCHAR(20) NOT NULL
}

ALTER TABLE "users" ADD CONSTRAINT "uk_users_email_address" UNIQUE ("email_address");
```

Do not provide an explanation.

## Create Repository

When creating a repository for an entity use the following rules:

- name the repository such that NameEntity would be NameRepository
- extends the TypeORM Repository class of the entity used with this repository
- import repository from typeorm
- import the entity from "./"

The following is an example of a repository:

```
import { Repository } from 'typeorm';
import { GroupEntity } from './GroupEntity';

export class GroupRepository extends Repository<GroupEntity> { }
```

Please create a repository for the following entity:

```
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { GroupDto } from "common/src/models/GroupDto";

@Entity('groups')
export class GroupEntity implements GroupDto, CopyInterface<GroupDto> {
	@PrimaryColumn({ name: "guid" })
	public guid: string = "";

	@Column({ name: 'display_name' })
	public displayName: string = "";

	@Column({ name: 'is_administrator' })
	public isAdministrator: boolean = false;

	public copyFrom(source: GroupDto): void {
		this.guid = source.guid;
		this.displayName = source.displayName;
		this.isAdministrator = source.isAdministrator;
	}

	public copyTo(dest: GroupDto): void {
		dest.guid = this.guid;
		dest.displayName = this.displayName;
		dest.isAdministrator = this.isAdministrator;
	}
}
```

Do not explain your code.

## Service

The following EntityDataSource file is: "../data/EntitiesDataSource"

```
import { DataSource } from "typeorm";
import { GroupEntity } from "./GroupEntity";
import { MembershipEntity } from "./MembershipEntity";
import { PasswordEntity } from "./PasswordEntity";
import { PermissionEntity } from "./PermissionEntity";
import { SecurableEntity } from "./SecurableEntity";
import { UserEntity } from "./UserEntity";
import { Config } from "../Config";
import { UserRepository } from "./UserRepository";
import { GroupRepository } from "./GroupRepository";
import { MembershipRepository } from "./MembershipsRepository";
import { PasswordRepository } from "./PasswordRepository";
import { PermissionRepository } from "./PermissionsRepository";
import { SecurableRepository } from "./SecurableRepository";

export class EntitiesDataSource extends DataSource {
	public constructor() {
		super({
			type: "postgres",
			host: Config.dbHost,
			port: Config.dbPort,
			database: Config.dbName,
			username: Config.dbUsername,
			password: Config.dbPassword,
			entities: [
				GroupEntity,
				MembershipEntity,
				PasswordEntity,
				PermissionEntity,
				SecurableEntity,
				UserEntity
			],
		});
	}

	private _groupRepository: GroupRepository | undefined;
	public groupRepository() {
		if (!this._groupRepository)
			this._groupRepository = new GroupRepository(GroupEntity, this.createEntityManager(), this.createQueryRunner());
		return this._groupRepository;
	}

	private _membershipRepository: MembershipRepository | undefined;
	public membershipRepository() {
		if (!this._membershipRepository)
			this._membershipRepository = new MembershipRepository(MembershipEntity, this.createEntityManager(), this.createQueryRunner());
		return this._membershipRepository;
	}

	private _passwordRepository: PasswordRepository | undefined;
	public passwordRepository() {
		if (!this._passwordRepository)
			this._passwordRepository = new PasswordRepository(PasswordEntity, this.createEntityManager(), this.createQueryRunner());
		return this._passwordRepository;
	}

	private _permissionRepository: PermissionRepository | undefined;
	public permissionRepository() {
		if (!this._permissionRepository)
			this._permissionRepository = new PermissionRepository(PermissionEntity, this.createEntityManager(), this.createQueryRunner());
		return this._permissionRepository;
	}

	private _securableRepository: SecurableRepository | undefined;
	public securableRepository() {
		if (!this._securableRepository)
			this._securableRepository = new SecurableRepository(SecurableEntity, this.createEntityManager(), this.createQueryRunner());
		return this._securableRepository;
	}

	private _userRepository: UserRepository | undefined;
	public userRepository() {
		if (!this._userRepository)
			this._userRepository = new UserRepository(UserEntity, this.createEntityManager(), this.createQueryRunner());
		return this._userRepository;
	}
}
```

Assume that if we have an entity its setup in the EntitiesDataSource like the ones included.

The following ResponseDto file is: "common/src/models/ResponseDto"

```
export interface ResponseDto<T> {
	data?: T;
	error?: string;
}
```

The following BaseService file is: "./BaseService"

```
import express from "express";
import { HttpStatus } from "common/dist/models/HttpStatus";
import { ResponseDto } from "common/src/models/ResponseDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

export type Method<T> = (req: express.Request, ds: EntitiesDataSource) => Promise<T>;

export class BaseService {
	public async methodWrapper<T>(req: express.Request, resp: express.Response, method: Method<T>): Promise<void> {
		const ds = new EntitiesDataSource();

		try {
			await ds.initialize();
			const ret = await method(req, ds);
			resp.status(HttpStatus.OK).send({ data: ret } as ResponseDto<any>);
		} catch (err) {
			resp.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ err: JSON.stringify(err) } as ResponseDto<any>);
		} finally {
			await ds.destroy();
		}
	}
}
```

When creating a service use the following rules:

- the service should be bound to a specific entity
- the service class should inherit from the BaseService
  - the BaseService provides exception handling with a finally to close the data source
  - the base service defined a method that it will inject with a express.Request and EntityDataSource
  - call the Method and returns the status and response dto
- provides methods for
  - getList that returns all the records
  - putSave that will create an entity and copyFrom the JSON.parse(body) data transfer object
  - deleteGuid that will delete the entity by the guid provided.

The following is an example of a service bound to the UserEntity:

```
import express from "express";
import { UserDto } from "common/src/models/UserDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { UserEntity } from "../data/UserEntity";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.get("/api/v0/users", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/user", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<UserDto[]> {
		return await ds.userRepository().find();
	}

	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const entity = new UserEntity();
		entity.copyFrom(req.body as UserDto);

		await ds.userRepository().save([entity]);
	}

	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const guid = req.params["guid"];

		await ds.userRepository().delete({ guid: guid });
	}
}
```

Create a service for the following entity:

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

## Add CheckSecurity to Service

The following is "./BaseService":

```
import express from "express";
import { HttpStatus } from "common/src/models/HttpStatus"
import { ResponseDto } from "common/src/models/ResponseDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

export type Method<T> = (req: express.Request, ds: EntitiesDataSource) => Promise<T>;

export class BaseService {
	public async methodWrapper<T>(req: express.Request, resp: express.Response, method: Method<T>): Promise<void> {
		const ds = new EntitiesDataSource();

		try {
			await ds.initialize();
			const ret = await method(req, ds);
			resp.status(HttpStatus.OK).send({ data: ret } as ResponseDto<any>);
		} catch (err) {
			resp.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ err: JSON.stringify(err) } as ResponseDto<any>);
		} finally {
			await ds.destroy();
		}
	}
}
```

The following is "./CheckSecurity":

```
import { ResponseDto } from "common/src/models/ResponseDto";
import express from "express";

export function CheckSecurity(securableName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: express.Request, resp: express.Response, ...args: any[]) {
            const authHeader = req.headers["authorization"];
            const authToken = authHeader && authHeader.split(" ")[1];

            if (!authToken)
                return resp.status(401).json({ error: "Unauthorized: Missing token" } as ResponseDto<any>);

            const isAuthenticated = await checkAuthentication(authToken);
            if (!isAuthenticated)
                return resp.status(401).json({ error: "Unauthorized: Invalid token" } as ResponseDto<any>);

            const hasPermission = await checkAuthorization(authToken, securableName);
            if (!hasPermission)
                return resp.status(403).json({ message: "Forbidden: Insufficient permissions" });

            return originalMethod.apply(this, [req, resp, ...args]);
        };

        return descriptor;
    };
}

async function checkAuthentication(token: string): Promise<boolean> {
    return true;
}

async function checkAuthorization(token: string, securableName: string): Promise<boolean> {
    return true;
}
```

Add check security to each of the methods in:

```
import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { GroupDto } from "common/src/models/GroupDto";
import { GroupEntity } from "../data/GroupEntity";

export class GroupService extends BaseService {
	public constructor(app: express.Express) {
		super();

		app.get("/api/v0/groups", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
		app.put("/api/v0/group", (req, resp) => { this.methodWrapper(req, resp, this.putSave) });
		app.delete("/api/v0/group/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
	}

	public async getList(req: express.Request, ds: EntitiesDataSource): Promise<GroupDto[]> {
		return await ds.groupRepository().find();
	}

	public async putSave(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const entity = new GroupEntity();
		entity.copyFrom(req.body as GroupDto);

		await ds.groupRepository().save([entity]);
	}

	public async deleteGuid(req: express.Request, ds: EntitiesDataSource): Promise<void> {
		const guid = req.params["guid"];

		await ds.groupRepository().delete({ guid: guid });
	}
}
```