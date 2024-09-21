# Prompt

The following user data transfer object:

```
export interface UserDto {
    guid: string;
    displayName: string;
    emailAddress: string;
    smsPhone: string;
}
```

The following user entity:

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

The following user repository:

```
import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity';

export class UserRepository extends Repository<UserEntity> {
}
```

The data transfer object, user entity, and user repository created from the following user table sql.  Please not that the SQL table name is plural, but the names in the TypeScript data transfer object, entity, and repository are singular.

```
CREATE TABLE "users" (
	"guid" UUID PRIMARY KEY,

	"display_name" VARCHAR(100) NOT NULL,
	"email_address" VARCHAR(250) NOT NULL,
	"sms_phone" VARCHAR(20) NOT NULL
);

ALTER TABLE "users" ADD CONSTRAINT "uk_users_email_address" UNIQUE ("email_address");
```

Create me a data transfer object, entity, and repository for the following table:

```
CREATE TABLE "list_filters" ( 
    "guid" UUID PRIMARY KEY,
    "lists_guid" UUID NOT NULL,

    "label" VARCHAR(100) NOT NULL,

    "sql_column" VARCHAR(100) NOT NULL,
    "sql_type" VARCHAR(50) NOT NULL,

    "options_sql" TEXT,

    "default_compare" VARCHAR(3), -- e, ne, lt, gt, lte, gte, nn, n, c, dnc
    "default_value" VARCHAR(100)
)
```

Only provide the files and do not provide an explanation.