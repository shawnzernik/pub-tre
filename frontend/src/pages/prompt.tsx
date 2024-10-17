import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Message as AiciMessage, MessageRole } from "common/src/models/aici/Message";
import { PromptDto } from "common/src/models/PromptDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { Input } from "../components/Input";
import { TextArea } from "../components/TextArea";
import { PromptService } from "../services/PromptService";
import { AuthService } from "../services/AuthService";
import { Button } from "../components/Button";
import { AiciService } from "../services/AiciService";

interface Props { }
interface State extends BasePageState {
    model: PromptDto;
    messages: AiciMessage[];
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                guid: UUIDv4.generate(),
                title: "",
                json: ""
            },
            messages: []
        }
    }
    public async componentDidMount(): Promise<void> {
        try {
            await this.events.setLoading(true);

            const guid = this.queryString("guid");
            if (!guid)
                throw new Error("You must save a chat history to create a new prompt.");

            const token = await AuthService.getToken();
            const prompt = await PromptService.get(token, guid);
            const messages = JSON.parse(prompt.json) as AiciMessage[];

            await this.updateState({
                messages: messages,
                model: prompt
            });

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
    }
    private async removeClicked(target: number) {
        await this.events.setLoading(true);

        let newMessages: AiciMessage[] = [];

        this.state.messages.forEach((msg, index) => {
            if (target !== index)
                newMessages.push(msg);
        });

        const newPrompt = this.jsonCopy(this.state.model);
        newPrompt.json = JSON.stringify(newMessages);

        await this.updateState({
            model: newPrompt,
            messages: newMessages
        });

        await this.events.setLoading(false);
    }
    private async saveClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            await PromptService.save(token, this.state.model);

            await this.events.setLoading(false);
            await Dialogue(this, "Saved", "Your changes have been saved.");
            window.location.replace("prompt.html?guid=" + this.state.model.guid);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }
    private async deleteClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            await PromptService.delete(token, this.state.model.guid);

            await this.events.setLoading(false);
            window.history.back();
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }
    private async suggestClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            const chatResponse = await AiciService.chat(token, [{
                role: "user",
                content: `Please provide a simple string title for the following JSON OpenAI message history.  Do not use markdown nor emojis.\n\n${JSON.stringify(this.state.messages)}`
            }]);

            const newPrompt = this.jsonCopy(this.state.model);
            newPrompt.title = chatResponse.choices[0].message.content;

            await this.updateState({ model: newPrompt });
            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }
    async appendClicked(role: string, index: number) {
        try {
            await this.events.setLoading(true);
            
            const newMessages: AiciMessage[] = [];
            for(let cnt = 0; cnt < this.state.messages.length; cnt++) {
                newMessages.push(this.state.messages[cnt]);
                if(cnt == index){
                    newMessages.push({
                        role: role == "user"
                            ? "user"
                            : "assistant",
                        content: ""
                    });
                    newMessages.push({
                        role: role == "user"
                            ? "assistant"
                            : "user",
                        content: ""
                    });        
                }
            }

            const newPrompt = this.jsonCopy(this.state.model);
            newPrompt.json = JSON.stringify(newMessages);

            await this.updateState({
                messages: newMessages,
                model: newPrompt
            });

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private countLines(text: string) {
        return text.split("\n").length;
    }
    public render(): React.ReactNode {
        const messages: React.ReactElement[] = [];

        this.state.messages.forEach((msg, index) => {
            messages.push(
                <>
                    <Field label={msg.role} key={index}>
                        <TextArea
                            style={{
                                height: this.countLines(msg.content) * 1.4 + 2 + "em"
                            }}
                            monospace={true}
                            showAll={true}
                            value={msg.content}
                            onChange={async (value) => {
                                const newMessages = this.jsonCopy(this.state.messages);
                                newMessages[index].content = value;

                                const newPrompt = this.jsonCopy(this.state.model);
                                newPrompt.json = JSON.stringify(newMessages);

                                await this.updateState({
                                    model: newPrompt,
                                    messages: newMessages
                                });
                            }}
                        />
                    </Field>
                    <Field>
                        {
                            msg.role == "user"
                                ? <Button label="Add A+U" onClick={() => { this.appendClicked("assistant", index); }} />
                                : <Button label="Add U+A" onClick={() => { this.appendClicked("user", index); }} />
                        }
                        <Button label="Remove" onClick={this.removeClicked.bind(this, index)} />
                    </Field>
                </>
            );
        });

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="2d926f48-3007-4912-b6e7-a55a2af65d62"
            >
                <Heading level={1}>Prompt Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}>
                        <Input
                            value={this.state.model.guid}
                        />
                    </Field>
                    <Field label="Title">
                        <Input
                            value={this.state.model.title}
                            onChange={async (value) => {
                                const newPrompt = this.jsonCopy(this.state.model);
                                newPrompt.title = value;

                                await this.updateState({
                                    model: newPrompt
                                });
                            }}
                        />
                    </Field>
                    <Field>
                        <Button label="Suggest Name" onClick={this.suggestClicked.bind(this)} />
                        <Button label="Save" onClick={this.saveClicked.bind(this)} />
                        <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                    </Field>

                    <Heading level={2}>Conversation</Heading>
                    {messages}
                </Form>
            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
};
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
