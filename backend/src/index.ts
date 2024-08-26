import express from "express";
import { Config } from "./Config"
import fs from "fs";
import https from "https";
import { ResponseDto } from "common/src/models/ResponseDto"

class WebApp {
	private app: express.Express = express();
	public execute() {
		this.app.use(express.json());
		this.app.use("/static", express.static(Config.staticDirectory));
		this.app.use("/scripts", express.static(Config.javascriptDirectory));

		this.app.get("/api/v0/health", this.getHealth.bind(this));
		this.app.get("/api/v0/liveness", this.getLiveliness.bind(this));

		const options = {
			key: fs.readFileSync(Config.httpsCertPath),
			cert: fs.readFileSync(Config.httpsKeyPath),
		};
		const server = https.createServer(options, this.app);
		server.listen(Config.httpsPort, () => {
			console.log(`Server listening on port ${Config.httpsPort}`);
		});
	}

	public getHealth(req: express.Request, res: express.Response) {
		res.status(200).send({ data: "OK" } as ResponseDto<string>)
	}

	public getLiveliness(req: express.Request, res: express.Response) {
		res.status(200).send({ data: "OK" } as ResponseDto<string>)
	}
}

const app = new WebApp();
app.execute();