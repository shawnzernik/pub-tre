import fs from "fs";

class Program {
    private document = "docs/BackendService.md";
    private name = "Prompt";
    private tableName = "prompt";
    private regex = /<!!\sFILE\s([^\s]+\/[^\s]+\.[^\s]+)\s!!\/>/g;

    private values: Dictionary<string> = {
        NAME: "Prompt",
        TABLENAME: "prompt"
    };

    public execute() {
        let markdown = fs.readFileSync(this.document, { encoding: "utf8" });

        markdown = markdown.replace(/\%NAME\%/g, this.name);
        markdown = markdown.replace(/\%TABLENAME\%/g, this.tableName);
        
        const matches = [...markdown.matchAll(this.regex)];

        matches.forEach((match) => {
            const filename = match[1];
            let source = fs.readFileSync(filename, { encoding: "utf8" });
            source = this.replaceAll(source, "`", "\\`");

            markdown = this.replaceAll(markdown, match[0], source);
        });

        fs.writeFileSync("output.md", markdown, { encoding: "utf8"});
    }

    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    private replaceAll(original: string, find: string | RegExp, replace: string): string {
        if(typeof(find) === "string")
            find = new RegExp(this.escapeRegex(find));
        if(!(find instanceof RegExp))
            throw new Error("Find is not a RegExp or string!");

        const ret = original.replace(find, replace);
        return ret;
    }
}

const program = new Program();
program.execute();