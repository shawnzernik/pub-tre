CREATE TABLE "embeddings" (
    "guid" UUID NOT NULL PRIMARY KEY,
	"title" VARCHAR(1024) NOT NULL,
    "input" TEXT NOT NULL,
    "embedding_json" TEXT NOT NULL,
    "prompt_tokens" INT NOT NULL,
    "total_tokens" INT NOT NULL
)