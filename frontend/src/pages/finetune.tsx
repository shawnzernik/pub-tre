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
    private executeClicked() { }

    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="1a5073f4-5be7-4b01-af23-11aff07485f3"
            >
                <Heading level={1}>Fine Tune</Heading>
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

