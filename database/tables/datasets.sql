CREATE TABLE "datasets" ( 
    "guid" UUID PRIMARY KEY,
    "include_in_training" BOOLEAN DEFAULT FALSE,
	"title" VARCHAR(100) NOT NULL,
    "json" TEXT NOT NULL
)