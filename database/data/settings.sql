INSERT INTO "settings" ("guid", "key", "value") VALUES
('b7d8c935-7c19-47f9-bc93-9f62b4a9fbc7', 'Password:Iterations', '1000000'),
('cad42e40-53a7-4893-a289-c4dcb19aa022', 'Password:Minimum Length', '8'),
('6c34e0f7-e03c-4aa0-9464-89b516f200ce', 'Password:Require Uppercase', 'y'),
('a8e6763b-f294-4af8-be7d-94aa259302ac', 'Password:Require Lowercase', 'y'),
('10e965e6-208f-4c25-9c1e-0dba7008662d', 'Password:Require Numbers', 'y'),
('1cbb9527-afab-4d0d-a101-7a53d15359bc', 'Password:Require Symbols', 'y'),

('1ad66e51-dcbf-4eea-ba53-f420e8627658', 'Aici:Model', 'gpt-4o-mini'),
('c3e92f5a-63eb-4749-aa6b-e110151477a0', 'Aici:URL', 'https://api.openai.com'),
('4bcb2ae1-7c9d-4e19-a380-0abddcba8c18', 'Aici:API Key', 'YOU OPEN AI KEY HERE'),

('1f563db0-d39e-46b1-9129-6a5ae3bd931f', 'Aici:Fine Tune:GitHub', 'https://github.com/shawnzernik/ts-react-express.git'),
('202d285b-e8d4-4076-aa90-7d588760048c', 'Aici:Fine Tune:Temp Directory', '../temp'),
('f4f96929-7e4f-46af-9977-d0b38f0ed9f3', 'Aici:Fine Tune:Epochs', '6'),
('7748eeee-1caa-4ee8-a2ad-2583552926d7', 'Aici:Fine Tune:Batch Size', '1'),
('a8fdf3fb-8726-437a-a8bd-bebd595d1a87', 'Aici:Fine Tune:LR Multiplier', '1.8'),
('0277c73c-c228-4fce-ae31-4112a60c6946', 'Aici:Fine Tune:Seed', '0'),

('96de4956-9018-47d2-a50d-fe071ac58338', 'Aici:Upload:Exclude', '
\\.ts$
\\.tsx$
\\.sql$
\\.json$
\\.sh$
\\.css$
\\.js$
\\.html$
\\.md$
\\.code-workspace$
'),
('f7abd78d-d495-4bc2-a753-1d780b789098', 'Aici:Upload:Include', '
frontend/scripts
node_modules
bin
obj
dist
coverage
package-lock
\\.ds\\.json$
'),
;