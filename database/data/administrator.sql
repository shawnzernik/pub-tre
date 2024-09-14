CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "users" ("guid", "display_name", "email_address", "sms_phone")
VALUES ('ea042f97-c8f4-447d-a71b-f4c4e0c77cc7', 'System Administrator', 'administrator@localhost', '555-555-5555');

INSERT INTO "passwords" ("guid", "users_guid", "created", "salt", "iterations", "hash")
VALUES (
    'ecb3185f-74eb-43b4-9b75-97975e312075',
    'ea042f97-c8f4-447d-a71b-f4c4e0c77cc7',
    now(),
    '0f9155be2ef2b3ee3507b285e71b4dbcc3ce0168ed4a4eb704bceea67e5b13b5',
    100000,
    'aa80b43dbc5e6ad477bdb0ca3fa8df9786a5974e179b3bf81840983fc9357d6a28fc8e6dafd8cf8d39c8aadebe278b3d3aa6f0f3085db20fd13eeea14875b0bc'
);

INSERT INTO "groups" ("guid", "display_name", "is_administrator")
VALUES ('046499bd-1f75-4024-b7a9-307e6a99e1ec', 'Administrators', TRUE);

INSERT INTO "memberships" ("guid", "users_guid", "groups_guid", "is_included")
VALUES ('cf6868c0-d8d3-42c7-976e-5a03e4dd1fbc', 'ea042f97-c8f4-447d-a71b-f4c4e0c77cc7', '046499bd-1f75-4024-b7a9-307e6a99e1ec', TRUE);

INSERT INTO "permissions" ("guid", "groups_guid", "securables_guid", "is_allowed")
SELECT 
    uuid_generate_v4(),
    '046499bd-1f75-4024-b7a9-307e6a99e1ec',
    s.guid,
    TRUE
FROM "securables" s;