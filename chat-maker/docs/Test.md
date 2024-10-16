# Prompt Chain

## User

File name `~/common/src/models/UserDto.ts`:

```typescript
export interface UserDto {
    guid: string;
    displayName: string;
    emailAddress: string;
    smsPhone: string;
}
```

What is the name of the table. Provide only the identifier and nothing else and plain text.

## Assistant

UserDto

## User

File name `~/database/tables/users.sql`:

```sql
CREATE TABLE "users" (
	"guid" UUID PRIMARY KEY,

	"display_name" VARCHAR(100) NOT NULL,
	"email_address" VARCHAR(250) NOT NULL,
	"sms_phone" VARCHAR(20) NOT NULL
);

ALTER TABLE "users" ADD CONSTRAINT "uk_users_email_address" UNIQUE ("email_address");
```

What is the name of the table. Provide only the table name and nothing else and plain text.  Replace underscores with spaces.

## Assistant

users

## User

Provide me the pascal case singular for the table name. Provide only the name and nothing else and plain text.

## Assistant

User

## User

File name `~/database/tables/prompts.sql`:

```sql
CREATE TABLE "prompts" ( 
    "guid" UUID PRIMARY KEY,
    "title" VARCHAR(1024) NOT NULL,
    "markdown" TEXT NOT NULL
)
```

What is the name of the table. Provide only the table name and nothing else and plain text.  Replace underscores with spaces.

## Assistant

prompts

## User

Provide me the pascal case singular for the table name. Provide only the nme and nothing else and plain text.

## Assistant

Prompt

## User

`~/common/src/models/UserDto.ts` was created from `~/database/tables/users.sql`.  Create me a DTO for `~/database/tables/prompts.sql`.  Please provide the output in the following format:

File name `~/folder/file.ext`:

```typescript
// code goes here
```

## Assistant


