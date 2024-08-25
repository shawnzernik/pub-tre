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