INSERT INTO public.prompts (guid,title,"input","json") VALUES
	 ('fb59e488-e57c-4d37-8092-2a122c700a82','Generate Data to Services','<!! FILE INPUT_FILE sql_table_file !!/>','[{"role":"user","content":"<!! FILE USER_DTO_FILE common/src/models/UserDto.ts !!/>\n\nWhat is the name of the interface.\nProvide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: UserDto","refusal":null},{"role":"user","content":"<!! FILE USER_SQL_FILE database/tables/users.sql !!/>\n\nWhat is the name of the table.\nProvide only the table name and nothing else and plain text.\nReplace underscores with spaces."},{"role":"assistant","content":"Equals: users","refusal":null},{"role":"user","content":"Provide me the pascal case singular for the table name.\nProvide only the name and nothing else and plain text."},{"role":"assistant","content":"Equals: User","refusal":null},{"role":"user","content":"%INPUT%\n\nWhat is the name of the table.\nProvide only the table name and nothing else and plain text.\nReplace underscores with spaces."},{"role":"assistant","content":"Set: TABLE_NAME","refusal":null},{"role":"user","content":"Provide me the pascal case singular for the table name.\nProvide only the name and nothing else and plain text."},{"role":"assistant","content":"Set: PASCAL_NAME","refusal":null},{"role":"user","content":"`%USER_DTO_FILE%` was created from `%USER_SQL_FILE%`.\n\nCreate me a DTO for `%INPUT_FILE%`.\nFor quoted literals in TypeScript, use double quotes (\") and not single quotes ('').\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: DTO_FILE","refusal":null},{"role":"user","content":"<!! FILE USER_ENTITY_FILE backend/src/data/UserEntity.ts !!/>\n\nWhat is the name of the class.\nProvide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: UserEntity","refusal":null},{"role":"user","content":"`%USER_ENTITY_FILE%` was created from `%USER_DTO_FILE%` and `%USER_SQL_FILE%`.\n\nCreate a file just like was done for `%USER_ENTITY_FILE` using `%INPUT_FILE%`.\nFor quoted literals in TypeScript, use double quotes (\") and not single quotes ('').\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: ENTITY_FILE","refusal":null},{"role":"user","content":"<!! FILE USER_REPOSITORY_FILE backend/src/data/UserRepository.ts !!/>\n\nWhat is the name of the class. Provide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: UserRepository","refusal":null},{"role":"user","content":"Repository `%USER_REPOSITORY_FILE%` was created for entity `%USER_ENTITY_FILE%`.\n\nCreate a repository based on `%ENTITY_FILE%`.\nFor quoted literals in TypeScript, use double quotes (\") and not single quotes ('').\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: REPOSITORY_FILE","refusal":null},{"role":"user","content":"<!! FILE USER_BACKEND_FILE backend/src/services/UserService.ts !!/>\n\nWhat is the name of the class. Provide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: UserService","refusal":null},{"role":"user","content":"`%USER_BACKEND_FILE%` was created to provide list, get by GUID, save (upsert), and delete operations for `%USER_ENTITY_FILE%`.\n\nCreate a back end service for entity `%ENTITY_FILE%` using `%USER_BACKEND_FILE%` as an example.\nFor quoted literals in TypeScript, use double quotes (\") and not single quotes ('').\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: BACKEND_FILE","refusal":null},{"role":"user","content":"<!! FILE USER_TESTS_FILE backend/src/tests/services/UserService.test.ts !!/>\n\nWhat is the name of the class being tested. Provide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: UserService","refusal":null},{"role":"user","content":"`%USER_TESTS_FILE%` was created as end to end tests for `%USER_BACKEND_FILE%`.\n\nCreate end to end tests for `%BACKEND_FILE%` using `%USER_TESTS_FILE%` as an example.\nFor quoted literals in TypeScript, use double quotes (\") and not single quotes ('').\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: BACKEND_TESTS_FILE","refusal":null},{"role":"user","content":"<!! FILE USER_FRONTEND_FILE frontend/src/services/UserService.ts !!/>\n\nWhat is the name of the class. Provide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: UserService","refusal":null},{"role":"user","content":"`%USER_FRONTEND_FILE%` is the font end service created to call the back end service `%USER_BACKEND_FILE%`.\n\nCreate a front end service for `%BACKEND_FILE%` using `%USER_FRONTEND_FILE%` as an example."},{"role":"assistant","content":"Save: FRONTEND_FILE","refusal":null},{"role":"user","content":"<!! FILE EDS_FILE backend/src/data/EntitiesDataSource.ts !!/>\n\nWhat is the name of the class in this file? Provide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: EntitiesDataSource"},{"role":"user","content":"`%EDS_FILE%` contains references to both `%USER_ENTITY_FILE%` and `%USER_REPOSITORY_FILE%`.\n\nUpdate `%EDS_FILE%` to include `%ENTITY_FILE%` and `%REPOSITORY_FILE%` like we have for `%USER_ENTITY_FILE%` and `%USER_REPOSITORY_FILE%`.\n\nPlease avoid using placeholder comments like ''// ... existing methods ...'' or ''// ... rest of the existing methods ...'' and include the full implementation of all methods in the class so it can be copied and pasted directly.\n\nFor quoted literals in TypeScript, use double quotes (\") and not single quotes ('').\n\nDo not add additional comments unless the pattern already exists.\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: NEW_EDS_FILE"},{"role":"user","content":"<!! FILE WEBAPP_FILE backend/src/index.ts !!/>\n\nWhat is the name of the class in this file? Provide only the identifier and nothing else and plain text."},{"role":"assistant","content":"Equals: WebApp"},{"role":"user","content":"`%WEBAPP_FILE%` includes the service from `%USER_BACKEND_FILE%`.\n\nUpdate `%WEBAPP_FILE%` to include `%BACKEND_FILE%` like was done for `%USER_BACKEND_FILE%`.\n\nFor quoted literals in TypeScript, use double quotes (\") and not single quotes ('').\n\nDo not add additional comments unless the pattern already exists.\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: NEW_WEBAPP_FILE"},{"role":"user","content":"<!! FILE SECURABLES_SQL_FILE database/data/securables.sql !!/>\n\n`%SECURABLES_SQL_FILE%` has the securables mentioned in `%USER_BACKEND_FILE%''.\n\nUpdate `%SECURABLES_SQL_FILE%` to include the securables required by `%BACKEND_FILE%`.\n\nMake sure that the GUIDs used on rows added to string literals and randomly generated UUIDv4.\n\nDo not add additional comments unless the pattern already exists.\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: NEW_SECURABLES_SQL_FILE"}]'),
	 ('6c4f6377-9051-42fc-ba86-04b79c8fc57e','Generate Edit','<!! FILE SERVICE frontend_service !!/>\n<!! FILE DTO common_dto !!/>','[{"role":"user","content":"<!! FILE LIST_DTO common/src/models/ListDto.ts !!/>\n<!! FILE LIST_SERVICE frontend/src/services/ListService.ts !!/>\n<!! FILE MENU_DTO common/src/models/MenuDto.ts !!/>\n<!! FILE MENU_SERVICE frontend/src/services/MenuService.ts !!/>\n<!! FILE LIST_SCREEN frontend/src/pages/list.tsx !!/>\n\nThe screen`%LIST_SCREEN%` was created to edit `%LIST_DTO%` DTOs and `%LIST_SERVICE%`.\n\n%INPUT%\n\nCreate a screen for `%SERVICE%` and `%DTO%` using `%LIST_SCREEN%` as an example.\n\nWhen quoting string literals in TypeScript, double quotes (\") are preferable to single quote ('').\n\n%SAVE_PROMPT%"},{"role":"assistant","content":"Save: SCREEN","refusal":null}]');
