import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Markdown } from "../components/Markdown";
import { TextArea } from "../components/TextArea";
import { FlexRow } from "../components/FlexRow";
import { Button } from "../components/Button";
import { Message as AiciMessage } from "common/src/models/aici/Message";
import { AiciService } from "../services/AiciService";
import { AuthService } from "../services/AuthService";
import { Theme } from "../components/Theme";
import { DatasetDto } from "common/src/models/DatasetDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { DatasetService } from "../services/DatasetService";

interface Props { }
interface State extends BasePageState {
    messages: AiciMessage[];
    user: string;
    inputTokens: number;
    outputTokens: number;
    seconds: number;
}

class Page extends BasePage<Props, State> {
    private static defaultMessages: AiciMessage[] = [
        // {
        //     "role": "user",
        //     "content": "You are a Lago Vista Technologies programmer.  You provide professional, direct, concise, factual answers."
        // },
        // {
        //     "role": "assistant",
        //     "content": "I am a honest, professional, direct, concise programmer."
        // }
    ];

    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            messages: Page.defaultMessages,
            user: "",
            inputTokens: 0,
            outputTokens: 0,
            seconds: 0
        }
    }

    public async componentDidMount(): Promise<void> {
        const resend = window.localStorage.getItem("Page.resendClicked");
        if(!resend)
            return;

        window.localStorage.removeItem("Page.resendClicked");

        const resendMessages = JSON.parse(resend) as AiciMessage[];
        const newMessages: AiciMessage[] = [];

        for(let cnt = 0; cnt < resendMessages.length - 1; cnt++) {
            newMessages.push(resendMessages[cnt]);
        }

        await this.updateState({
            messages: newMessages,
            user: resendMessages[resendMessages.length - 1].content
        });
    }

    private async resetClicked() {
        await this.updateState({
            messages: Page.defaultMessages,
            user: ""
        })
    }

    private async submitClicked() {
        try {
            await this.events.setLoading(true);

            let newMessages = this.jsonCopy(this.state.messages) as AiciMessage[];
            newMessages.push({
                role: "user",
                content: this.state.user
            });

            await this.updateState({
                messages: newMessages,
                user: ""
            });

            const token = await AuthService.getToken();

            const started = Date.now();
            let response = await AiciService.chat(token, newMessages);
            const ended = Date.now();

            newMessages.push(response.choices[0].message);

            await this.updateState({
                inputTokens: response.usage.prompt_tokens,
                outputTokens: response.usage.total_tokens,
                seconds: (ended - started) / 1000,
                messages: newMessages
            });

            const convo = document.getElementById("convo");
            convo.scrollTop = convo.scrollHeight;

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }
    private async saveClicked() {
        try {
            await this.events.setLoading(true);

            const dto: DatasetDto = {
                guid: UUIDv4.generate(),
                includeInTraining: false,
                title: Date.now().toString(),
                json: JSON.stringify(this.state.messages)
            };

            const token = await AuthService.getToken();
            await DatasetService.save(token, dto);

            await this.events.setLoading(false);
            await Dialogue(this, "Saved", "The conversation has been saved to datasets!");
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public render(): React.ReactNode {
        let markdown = "# Conversation\n\n";
        if (this.state.messages && this.state.messages.length > 0) {
            this.state.messages.forEach((msg) => {
                markdown += `\n`;
                markdown += `## '${msg.role}'\n`;
                markdown += `\n`;
                markdown += `\n`;
                markdown += msg.content + "\n";
            });
        }

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="b3d886a8-dd3d-426a-9ddf-1e18cbb7e224"
            >
                <div id="convo" style={{
                    width: "100%",
                    height: "calc(100vh - 25em)",
                    overflow: "auto"
                }}>
                    <Markdown>{markdown}</Markdown>
                </div>

                <FlexRow gap="1em" style={{
                    borderTop: "1pt solid " + Theme.mediumText,
                    paddingTop: "1em"
                }}>
                    <span>Input: {this.state.inputTokens}</span>
                    <span>New: {this.state.outputTokens - this.state.inputTokens}</span>
                    <span>Output: {this.state.outputTokens}</span>
                    <span>Seconds: {this.state.seconds.toFixed(2)}</span>
                    <span>T/S: {(this.state.outputTokens / this.state.seconds).toFixed(2)}</span>
                </FlexRow>
                <TextArea rows={10}
                    value={this.state.user}
                    onChange={async (value) => {
                        await this.updateState({ user: value });
                    }}
                ></TextArea>
                <FlexRow gap="1em">
                    <Button label="Submit" onClick={this.submitClicked.bind(this)} />
                    <Button label="Reset" onClick={this.resetClicked.bind(this)} />
                    <Button label="Save" onClick={this.saveClicked.bind(this)} />
                </FlexRow>
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
