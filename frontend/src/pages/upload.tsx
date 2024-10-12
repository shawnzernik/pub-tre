import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Markdown } from "../components/Markdown";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { FlexRow } from "../components/FlexRow";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { AuthService } from "../services/AuthService";
import { AiciService } from "../services/AiciService";
import { LoginDto } from "common/src/models/LoginDto";

interface Props { }
interface State extends BasePageState {
    file: File | null;
    corelation: string | null;
    logs: string | null;
    interval: NodeJS.Timeout | null;
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            file: null,
            corelation: null,
            logs: null,
            interval: null
        };
    }
    private async uploadLogInterval() {
        const token = await AuthService.getToken();
        const logs = await AiciService.uploadLogs(token, this.state.corelation!);

        let logContent = "| Level | Time | Message |\n";
        logContent += "|---|---|---|\n"
        logs.forEach((log) => {
            if (log.message)
                logContent += `|${log.level}|${log.epoch.replace(/"/g, "")}|${log.message}|\n`;
        });

        if (logContent.includes("ALL DONE!"))
            clearInterval(this.state.interval);

        this.updateState({ logs: logContent })
    }
    private async uploadClicked() {
        try {
            await this.events.setLoading(true);

            if (!this.state.file)
                throw new Error("No file selected!");

            const token = await AuthService.getToken();
            const corelation = await AiciService.upload(token, this.state.file);
            await this.updateState({ corelation: corelation });

            setInterval(this.uploadLogInterval.bind(this), 5 * 1000);

            await this.events.setLoading(false);
        }
        catch (err) {
            ErrorMessage(this, err);
        }
    }

    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="720fa4c9-20d0-407d-aff6-3dad45d155cc"
            >
                <Heading level={1}>Upload ZIP File</Heading>
                <Form>
                    <Field label="Upload File"><input
                        type="file"
                        onChange={(e) => {
                            this.setState({
                                file: e.target.files?.item(0) || null
                            });
                        }}
                    /></Field>
                    <FlexRow gap="1em">
                        <Button label="Upload" onClick={this.uploadClicked.bind(this)} />
                    </FlexRow>
                </Form>

                {
                    this.state.logs
                        ? <>
                            <Heading level={2}>Logs</Heading>
                            <Markdown>{this.state.logs}</Markdown>
                        </>
                        : <></>
                }
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

