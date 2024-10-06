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

interface Props { }
interface State extends BasePageState {
    file: File | null;
}

class Page extends BasePage<Props, State> {
    private async uploadClicked() {
        try {
            await this.events.setLoading(true);

            if (!this.state.file)
                throw new Error("No file selected!");

            const token = await AuthService.getToken();
            await AiciService.upload(token, this.state.file);

            await this.events.setLoading(false);
        }
        catch (err) {
            ErrorMessage(this, err);
        }
    }
    private cloneClicked() {}
    private executeClicked() {}

    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="1a5073f4-5be7-4b01-af23-11aff07485f3"
            >
                <Markdown>{`
# Fine Tune

The follow allows the management if datasets and fine tuning.  You can:

1. Upload a ZIP file containing an applications code
2. Process the code from a public GIT repo
3. Start fine tuning based on the datasets in the system

To adjust the fine tune settings, please go to the application settings list and change the "Aici:Fine Tune" settings.
                `}</Markdown>

                <Heading level={2}>Upload ZIP File</Heading>
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

                <Heading level={2}>Clone GIT Repo</Heading>
                <Form>
                    <Field label="GIT URL"><Input /></Field>
                    <FlexRow gap="1em">
                        <Button label="Clone" onClick={this.cloneClicked.bind(this)} />
                    </FlexRow>
                </Form>

                <Heading level={2}>Fine Tune</Heading>
                <Form>
                    <Field label="Name"><Input /></Field>
                    <FlexRow gap="1em">
                        <Button label="Execute" onClick={this.executeClicked.bind(this)} />
                    </FlexRow>
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

