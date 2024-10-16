# Prompt

The following is the user entity:

```
<!! FILE ~/backend/src/data/UserEntity.ts !!/>
```

The following is the user service that was created for the user entity.  It only provides get GUID, grt list, post save, and delete GUID endpoints.

```
<!! FILE ~/backend/src/services/UserService.ts !!/>
```

Using the following entity:

```
<!! FILE ~/backend/src/data/%NAME%Entity.ts !!/>
```

Create a service that was created for the entity.  It should only provide get GUID, grt list, post save, and delete GUID endpoints.