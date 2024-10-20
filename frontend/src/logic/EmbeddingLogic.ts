import { Message as AiciMessage } from "common/src/models/aici/Message";
import { AiciService } from "../services/AiciService";
import { Dictionary } from "common/src/Dictionary";
import { AuthService } from "../services/AuthService";

export class EmbeddingLogic {
    private static fileRegexp = /<!!\s*FILE\s*([~\w-/\.]*)\s*([~\w-/\.]*)\s*(?:NOFILENAME)?\s*!!\/>/g;
    private static mdFileNameRegExp = /File(?:\s*name)\s*[\`\']([\S]*)[\`\']:/g
    private static mdFileContentRegExp = /\`\`\`(?:\S*)\n([\s\S]*)\n\`\`\`/g;
    private static equalsRegExp = /[Ee]quals:\s*(.*)/g;
    private static saveRegExp = /[Ss]ave:\s*([^\s%]*)/g;
    private static setRegExp = /[Ss]et:\s*([^\s%]*)/g;

    public originals: AiciMessage[];
    public completed: AiciMessage[] = [];
    public values: Dictionary<string> = {};
    fileNameToContents: Dictionary<string> = {}
    public tokens: number = 0;
    public milliseconds: number = 0;

    public constructor(originals: AiciMessage[], input?: string) {
        this.originals = originals;
        this.values["INPUT"] = input;

        let savePrompt = "";
        savePrompt += "\n";
        savePrompt += "Do not provide an explanation.\n";
        savePrompt += "Provide the output in the following format:\n";
        savePrompt += "\n";
        savePrompt += "File name `~/folder/file.ext`:\n";
        savePrompt += "\n";
        savePrompt += "```\n";
        savePrompt += "// code goes here\n";
        savePrompt += "```\n";
        savePrompt += "\n";

        this.values["SAVE_PROMPT"] = savePrompt;
    }

    public async process(): Promise<void> {
        if (this.completed.length + 1 >= this.originals.length)
            throw new Error("Process called after all messages are completed!");
        if (this.originals[this.completed.length].role != "user")
            throw new Error(`Message at index ${this.completed.length} is not a 'user' role! Messages must be in user-assistant pairs.`);
        if (this.originals[this.completed.length + 1].role != "assistant")
            throw new Error(`Message at index ${this.completed.length + 1} is not a 'assistant' role! Messages must be in user-assistant pairs.`);

        const originalUser = this.originals[this.completed.length];
        const originalAssistant = this.originals[this.completed.length + 1];

        const started = Date.now();

        let message = this.processValues(originalUser.content);
        message = await this.processFiles(message);

        this.completed.push({
            role: "user",
            content: message
        });

        const token = await AuthService.getToken();
        const response = await AiciService.chat(token, this.completed);

        const ended = Date.now();
        this.milliseconds += ended - started;

        if (response.choices.length <= 0)
            throw new Error("Chat returned no choices!");

        const responseMessage = response.choices[0].message;
        this.completed.push(response.choices[0].message);
        this.tokens += response.usage.total_tokens;

        await this.processResponse(originalAssistant, responseMessage);
    }

    private async processResponse(original: AiciMessage, response: AiciMessage): Promise<void> {
        let matches;

        matches = Array.from(original.content.matchAll(EmbeddingLogic.equalsRegExp))
        if (matches.length > 0)
            return await this.processEqualsResponse(original, response);

        matches = Array.from(original.content.matchAll(EmbeddingLogic.setRegExp))
        if (matches.length > 0)
            return await this.processSetResponse(original, response);

        matches = Array.from(original.content.matchAll(EmbeddingLogic.saveRegExp))
        if (matches.length > 0)
            return await this.processSaveResponse(original, response);
    }
    private async processEqualsResponse(original: AiciMessage, response: AiciMessage): Promise<void> {
        const matches = Array.from(original.content.matchAll(EmbeddingLogic.equalsRegExp));
        if (matches.length != 1)
            throw new Error("Multiple equal matches found!");

        const value = matches[0][1];

        if (value.trim() !== response.content.trim())
            throw new Error(`The expected value '${value.trim()}' does not match '${response.content.trim()}'!`);
    }
    private async processSaveResponse(original: AiciMessage, response: AiciMessage): Promise<void> {
        const fileNameMatches = Array.from(response.content.matchAll(EmbeddingLogic.mdFileNameRegExp));
        if (fileNameMatches.length != 1)
            throw new Error(`File name /${EmbeddingLogic.mdFileNameRegExp.source}/g not found ${fileNameMatches.length} times in response!\n\n${response.content}`);
        const fileContentMatches = Array.from(response.content.matchAll(EmbeddingLogic.mdFileContentRegExp));
        if (fileContentMatches.length != 1)
            throw new Error(`File name /${EmbeddingLogic.mdFileContentRegExp.source}/g found ${fileContentMatches.length} times in response!\n\n${response.content}`);

        const saveMatches = Array.from(original.content.matchAll(EmbeddingLogic.saveRegExp));
        if (saveMatches.length != 1)
            throw new Error("Multiple save matches found!");
        const valuesKey = saveMatches[0][1];

        const fileName = fileNameMatches[0][1];
        const fileContents = fileContentMatches[0][1];

        this.values[valuesKey] = fileName;
        this.fileNameToContents[fileName] = fileContents;
    }
    private async processSetResponse(original: AiciMessage, response: AiciMessage): Promise<void> {
        const matches = Array.from(original.content.matchAll(EmbeddingLogic.setRegExp));
        if (matches.length != 1)
            throw new Error("Multiple set matches found!");

        const key = matches[0][1];

        this.values[key] = response.content.trim();
    }

    private processValues(original: string): string {
        let ret = original;

        Object.keys(this.values).forEach((key) => {
            const target = "%" + key + "%";
            const regex = this.createRegExpForLiteral(target);
            ret = ret.replace(regex, this.values[key]);
        });

        return ret;
    }
    private async processFiles(original: string): Promise<string> {
        let ret = original;

        const matches = Array.from(ret.matchAll(EmbeddingLogic.fileRegexp));
        for (let match of matches) {
            const matchedText = match[0]; // matched text

            if (!match[1] || !match[2])
                throw new Error(`Invalid file format!  Expected '<!! FILE VALUE_KEY_NAME path/to/file.ext !!/> or '<!! FILE VALUE_KEY_NAME path/to/file.ext NOFILENAME !!/>'.  Recieved '${match[0]}'.`);

            const keyName = match[1]; // group 1: value's key
            const fileName = match[2]; // group 2: file name

            const token = await AuthService.getToken();
            const aiciFile = await AiciService.download(token, fileName);

            this.values[keyName] = aiciFile.file;

            let markdown = "\n";

            if (!matchedText.includes("NOFILENAME")) {
                markdown += "File name `" + aiciFile.file + "`:\n";
                markdown += "\n";
            }

            markdown += "```\n";
            markdown += aiciFile.contents.replace(/`/g, "\`");
            markdown += "\n```\n";
            markdown += "\n";

            ret = ret.replace(this.createRegExpForLiteral(matchedText), markdown);
        };

        return ret;
    }
    private createRegExpForLiteral(literal: string): RegExp {
        const target = literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(target, "g");
    }

    public markdownCompletions(): string {
        let ret = "";

        if (this.completed.length > 0)
            ret += "## Completed\n";

        for (let cnt = 0; cnt < this.completed.length; cnt++) {
            let orig = this.originals[cnt];
            let msg = this.completed[cnt];

            ret += "\n";

            if (msg.role == "assistant") {
                ret += "### Aici\n";
                ret += "\n";
                if (orig.content.includes("Save:"))
                    ret += "<span style='color: red'>" + orig.content + "</span>\n";
                if (orig.content.includes("Set:"))
                    ret += "<span style='color: black'>" + orig.content + "</span>\n";
                if (orig.content.includes("Equals:"))
                    ret += "<span style='color: green'>" + orig.content + "</span>\n";
                ret += "\n";

                ret += "### Assistant\n";
                ret += "\n";
                ret += msg.content + "\n";
                ret += "\n";
            } else {
                ret += "### User\n";
                ret += "\n";
                ret += msg.content + "\n";
                ret += "\n";
            }
        }

        return ret;
    }
    public markdownSaves(): string {
        let ret = "";

        const fileNames = Object.keys(this.fileNameToContents);

        if (fileNames.length > 0)
            ret += "## Files\n"

        for (let fileName of fileNames) {
            ret += "\n";
            ret += "**File name `" + fileName + "`**:\n"
            ret += "\n";
            ret += "```\n";
            ret += this.fileNameToContents[fileName];
            ret += "\n```\n";
            ret += "\n";
        }

        return ret;
    }
    public markdownValues(): string {
        let ret = "";

        const keys = Object.keys(this.values);

        if (keys.length > 0) {
            ret += "## Values\n"
            ret += "\n";
        }
        for (let key of keys) {
            ret += "\n";
            ret += "**" + key + "**:\n"
            ret += "\n";
            ret += "```\n";
            ret += this.values[key].replace(/`/g, "\\`");
            ret += "\n```\n";
            ret += "\n";
        }
        if (keys.length > 0) {
            ret += "\n";
        }

        return ret;
    }
}