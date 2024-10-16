The following user data transfer object:

```typescript
<!! FILE ~/common/src/models/UserDto.ts !!/>
```

The following user entity:

```typescript
<!! FILE ~/backend/src/data/UserEntity.ts !!/>
```

The following user repository:

```typescript
<!! FILE ~/backend/src/data/UserRepository.ts !!/>
```

The data transfer object, user entity, and user repository created from the following user table sql.  Please not that the SQL table name is plural, but the names in the TypeScript data transfer object, entity, and repository are singular.

```sql
<!! FILE ~/database/tables/users.sql !!/>
```

Create me a data transfer object, entity, and repository for the following table:

```sql
<!! FILE ~/database/tables/%TABLENAME%.sql !!/>
```

Only provide the files and do not provide an explanation.
