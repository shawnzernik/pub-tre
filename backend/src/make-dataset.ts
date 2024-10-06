import fs from "fs";
import path from "path";
import { Message } from "common/src/models/aici/Message";
import { DatasetDto } from "common/src/models/DatasetDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { EntitiesDataSource } from "./data/EntitiesDataSource";
import { AiciLogic } from "./logic/AiciLogic";

interface Conversation {
    messages: Message[];
}

class Program {
    public async importDatasets() {
        const ds = new EntitiesDataSource();
        console.log("Connecting to database...");
        await ds.initialize();

        let logFile = "file,input,new,total,seconds,t/s\n";

        const files = this.getFiles();
        files.sort();
        for (let cnt = 0; cnt < files.length; cnt++) {
            const n = files[cnt];

            const fullPath = path.join(path.resolve(".."), n);
            console.log(`File ${cnt + 1} of ${files.length}`);
            console.log(fullPath);

            let fileContents = fs.readFileSync(fullPath, { encoding: "utf8" });
            fileContents = fileContents.replace(new RegExp('`'), '\\`');

            let content = "Explain the file '%FILE%':\n\n```\n%CONTENT%\n```";
            content = content.replace("%FILE%", fullPath);
            content = content.replace("%CONTENT%", fileContents);

            const messages: Message[] = [{
                role: "user",
                content: content
            }];

            console.log("Sending to OpenAI...");
            const started = Date.now();
            const response = await AiciLogic.chat(ds, messages);
            const ended = Date.now();

            console.log(`Input: ${response.usage.prompt_tokens}; New: ${response.usage.completion_tokens}; Total: ${response.usage.total_tokens}`);
            console.log(`Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);
            logFile += `${fullPath},${response.usage.prompt_tokens},${response.usage.completion_tokens},${response.usage.total_tokens},${ended - started / 1000},${response.usage.total_tokens / ((ended - started) / 1000)}\n`

            console.log("Adding to dataset...");
            messages.push(response.choices[0].message);

            const dataset: DatasetDto = {
                guid: UUIDv4.generate(),
                title: fullPath,
                includeInTraining: true,
                json: JSON.stringify(messages)
            };

            console.log("Saving...");
            ds.datasetRepository().save(dataset);
        }

        fs.writeFileSync("log.csv", logFile, { encoding: "utf8" });

        console.log("Closing...");
        await ds.destroy();
        console.log("Done!");
    }
    private getFiles(): string[] {
        const ret: string[] = [];

        const files = fs.readdirSync("../", { recursive: true, encoding: "utf8" });
        files.forEach((f: string) => {
            if (
                (
                    f.endsWith(".ts") ||
                    f.endsWith(".tsx") ||
                    f.endsWith(".sql") ||
                    f.endsWith(".json") ||
                    f.endsWith(".sh") ||
                    f.endsWith(".css") ||
                    f.endsWith(".js") ||
                    f.endsWith(".html") ||
                    f.endsWith(".md") ||
                    f.endsWith(".code-workspace")
                ) &&
                !f.includes("frontend/scripts") &&
                !f.includes("node_modules") &&
                !f.includes("bin") &&
                !f.includes("obj") &&
                !f.includes("dist") &&
                !f.includes("coverage") &&
                !f.includes("package-lock") &&
                !f.includes(".ds.json")
            )
                ret.push(f);
        })

        return ret;
    }

    public async writeJsonl() {
        const ds = new EntitiesDataSource();
        console.log("Connecting to database...");
        await ds.initialize();
        const rows = await ds.datasetRepository().find();
        await ds.destroy();

        if(fs.existsSync("dataset.jsonl"))
            fs.rmSync("dataset.jsonl");

        rows.forEach((row) => {
            const convo: Conversation = {
                messages: []
            };

            const messages = JSON.parse(row.json) as Message[];
            messages.forEach((msg: Message) => {
                convo.messages.push({
                    role: msg.role,
                    content: msg.content
                });
            });

            fs.appendFileSync("dataset.jsonl", JSON.stringify(convo) + "\n", { encoding: "utf8" });
        });
    }
}

const program = new Program();
// program.importDatasets().then(() => {
//     process.exit(0);
// });
program.writeJsonl().then(() => {
    process.exit(0);
});