export class PromptAugmenter {
    private values: Dictionary<string> = {};
    public templates: Dictionary<string> = {};

    public constructor(values: Dictionary<string>, templates: Dictionary<string>) {
        this.values = values;
        this.templates = templates;
    }

    public doFileReplacement() {}
}