import process from "process"

export class Config {
	public static javascriptDirectory = process.env.JAVASCRIPT_DIR || "../frontend/dist";
	public static staticDirectory = process.env.STATIC_DIR || "../frontend/static";
	
	public static httpsPort = Number.parseInt(process.env.HTTPS_PORT || "4433");
	public static httpsCertPath = process.env.HTTPS_CERT_PATH || "./server.cert"
	public static httpsKeyPath = process.env.HTTPS_CERT_KEY || "./server.key"
	
	public static dbHost = process.env.DB_HOST || "localhost";
	public static dbPort = Number.parseInt(process.env.DB_PORT || "5432");
	public static dbName = process.env.DB_NAME || "ts-react-express";
	public static dbUsername = process.env.DB_USERNAME || "postgres";
	public static dbPassword = process.env.DB_PASSWORD || "postgres";
	
	public static jwtPublicKeyFile = process.env.JWT_PUBLIC_KEY_FILE || "../frontend/static/public.key"
	public static jwtPrivateKeyFile = process.env.JWT_PUBLIC_KEY_FILE || "./private.key"
}