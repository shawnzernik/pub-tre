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
    static logLevel: LogLevels = process.env.LOG_LEVEL as LogLevels || "trace";
    static logIndent: number = Number.parseInt(process.env.DB_PORT || "0");
}