import fs from "fs";

class Program {
    private document = "docs/DataAccess.md";
    private regex = /<!!\s([^\s]+\/[^\s]+\.[^\s]+)\s!!\/>/g;

    public execute() {
        let markdown = fs.readFileSync(this.document, { encoding: "utf8" });
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