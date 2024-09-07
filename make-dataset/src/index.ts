import fs from "fs";
import { Dictionary } from "./Dictionary";
import path from "path";
import { Dataset } from "./Dataset";
import { UUIDv4 } from "./UUIDv4";
import { Lesson } from "./Lesson";

class Program {
    private static projectName = "ts-react-express";
    private datasets: Dictionary<Dictionary<string>> = {};

    public execute() {
        const files = this.getFiles();

        files.forEach((f) => {
            const dir = path.dirname(f);
            const file = path.basename(f);

            if (!this.datasets[dir])
                this.datasets[dir] = {};

            console.log("Reading - Dir: " + dir + "; File: " + file);

            const contents = fs.readFileSync("../" + f, { encoding: "utf8" });
            this.datasets[dir][file] = contents;
        });
        // files.forEach((f) => {
        //     console.log("Reading - File: " + f);

        //     const contents = fs.readFileSync("../" + f, { encoding: "utf8" });
        //     const bracket = Math.floor((contents.length / 4) / 100);

        //     if(!this.datasets[bracket])
        //         this.datasets[bracket] = {};

        //     this.datasets[bracket][f] = contents;
        // });


        Object.keys(this.datasets).forEach((dir) => {
            const ds: Dataset = {
                guid: UUIDv4.generate(),
                title: Program.projectName + "/" + dir,
                lessons: []
            };
            Object.keys(this.datasets[dir]).forEach((file) => {
                const lesson: Lesson = {
                    guid: UUIDv4.generate(),
                    title: file,
                    messages: [
                        {
                            "role": "user",
                            "content": "You are a Lago Vista Technologies programmer.  You provide professional, direct, concise, factual answers."
                        },
                        {
                            "role": "assistant",
                            "content": "I am a honest, professional, direct, concise programmer."
                        }
                    ]
                };

                lesson.messages.push({
                    "role": "user",
                    "content": `Please provide me the following file:\n\n- Project: ${Program.projectName}\n- File name: ${dir + "/" + file}`
                });
                lesson.messages.push({
                    "role": "assistant",
                    "content": "```\n" + this.datasets[dir][file] + "\n```"
                });

                ds.lessons.push(lesson);
            });

            if (!fs.existsSync("datasets"))
                fs.mkdirSync("datasets");

            const name = this.sanitizeString(Program.projectName + " " + dir);
            fs.writeFileSync("datasets/" + name + ".ds.json", JSON.stringify(ds, null, 4));
        });
    }
    private sanitizeString(input: string): string {
        let sanitized = input.replace(/[^a-zA-Z0-9]/g, '-');
        sanitized = sanitized.replace(/-+/g, '-');
        sanitized = sanitized.replace(/^-+|-+$/g, '');

        return sanitized.toLowerCase().trim();
    }
    private getFiles(): string[] {
        const ret: string[] = [];

        const files = fs.readdirSync("../", { recursive: true, encoding: "utf8" });
        files.forEach((f: string) => {
            if (
                (
                    f.endsWith(".ts") ||
                    f.endsWith(".sql") ||
                    f.endsWith(".json") ||
                    f.endsWith(".sh") ||
                    f.endsWith(".js") ||
                    f.endsWith(".html") ||
                    f.endsWith(".md")
                ) &&
                !f.includes("node_modules") && !f.includes("bin") &&
                !f.includes("obj") && !f.includes("dist") && !f.includes("coverage") && 
                !f.includes("package-lock") && !f.includes(".ds.json")
            )
                ret.push(f);
        })

        return ret;
    }
}

const program = new Program();
program.execute();