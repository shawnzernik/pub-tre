import process from "process"
import { Logger, LogLevels } from "./Logger";

export class Config {
    public static javascriptDirectory = process.env.JAVASCRIPT_DIR || "../frontend/scripts";
    public static staticDirectory = process.env.STATIC_DIR || "../frontend/static";

    public static httpsPort = Number.parseInt(process.env.HTTPS_PORT || "4433");
    public static httpsCertPath = process.env.HTTPS_CERT_PATH || "./server.cert"
    public static httpsKeyPath = process.env.HTTPS_CERT_KEY || "./server.key"

    public static dbHost = process.env.DB_HOST || "localhost";
    public static dbPort = Number.parseInt(process.env.DB_PORT || "5432");
    public static dbName = process.env.DB_NAME || "ts-react-express";
    public static dbUsername = process.env.DB_USERNAME || "postgres";
    public static dbPassword = process.env.DB_PASSWORD || "postgres";

    public static jwtPublicKeyFile = process.env.JWT_PUBLIC_KEY_FILE || "./public.key"
    public static jwtPrivateKeyFile = process.env.JWT_PUBLIC_KEY_FILE || "./private.key"

    public static jestTimeoutSeconds = Number.parseInt(process.env.JEST_TIMEOUT_SECONDS || "300");
    public static httpsLimit: string = process.env.HTTPS_LIMIT || "1024mb";
    public static tempDirectory: string = process.env.TEMP_DIRECTORY || "../temp";

    public static logLevel: LogLevels = process.env.LOG_LEVEL as LogLevels || "trace";
    public static logIndent: number = Number.parseInt(process.env.DB_PORT || "0");

    public static embeddingModel: string = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
    public static embeddingBytesPerToken: number = Number.parseInt(process.env.EMBEDDING_BYTES_PER_TOKEN || "3");
    public static embeddingMaxTokens: number = Number.parseInt(process.env.EMBEDDING_MAX_TOKENS || "8192");

    public static qdrantUrl: string = process.env.QDRANT_URL || "http://localhost:6333";
    public static qdrantNameCollection: string = process.env.QDRANT_FILE_CONTENT_COLLECTION || "name";
    public static qdrantContentCollection: string = process.env.QDRANT_FILE_CONTENT_COLLECTION || "content";
    public static qdrantExplanationCollection: string = process.env.QDRANT_FILE_EXPLANATION_COLLECTION || "explanation";
    public static qdrantVectorSize: number = Number.parseInt(process.env.QDRANT_VECTOR_SIZE || "1536");
}