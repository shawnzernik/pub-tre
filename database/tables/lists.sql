CREATE TABLE "lists" ( 
    "guid" UUID PRIMARY KEY,

	"title" VARCHAR(100) NOT NULL,
    "url_key" VARCHAR(100) NOT NULL,

    "sql" TEXT NOT NULL,

    "list_url" VARCHAR(255) NOT NULL,
    "edit_url" VARCHAR(255),
    "delete_url" VARCHAR(255),

    "autoload" BOOLEAN NOT NULL DEFAULT FALSE
)