CREATE TABLE "embeddings" (
    "guid" UUID NOT NULL PRIMARY KEY,
	"title" VARCHAR(1024) NOT NULL,
    "content" TEXT NOT NULL,
    "vector_json" TEXT NOT NULL
)