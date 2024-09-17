import * as React from "react";
import { createRoot } from "react-dom/client";
import { Heading } from "../components/Heading";
import { Navigation } from "../components/Navigation";
import { Message } from "../components/Message";
import { BasePage, BasePageState } from "../components/BasePage";
import { Form } from "../components/Form";
import { LoginDto } from "common/src/models/LoginDto";
import { Field } from "../components/Field";
import { StringInput } from "../components/StringInput";
import { Button } from "../components/Button";
import { AuthService } from "../services/AuthService";

interface Props { }
interface State extends BasePageState {
    loading: boolean;
    message: Message | null;
}

class Page extends BasePage<Props, State> {
    private model: LoginDto = {
        emailAddress: "",
        password: ""
    }

    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState
        };
    }

    public async login(): Promise<void> {
        await this.events.setLoading(true);

        try {
            const token = await AuthService.login(this.model.emailAddress, this.model.password);
            await this.events.setMessage({
                title: "Logged In",
                content: token,
                buttons: [{ label: "OK", onClicked: () => { } }]
            });
        }
        catch (err) {
            await this.events.setMessage({
                title: "Error",
                content: `${err}`,
                buttons: [{
                    label: "OK", onClicked: () => {
                    }
                }]
            });
        }
        await this.events.setLoading(false);
    }

    public render(): React.ReactNode {
        return (
            <Navigation state={this.state} events={this.events}>
                <Heading level={1}>Login</Heading>
                <Form>
                    <Field size={3} label="Email Address"><StringInput model={this.model} property="emailAddress" /></Field>
                    <Field size={3} label="Password"><StringInput password={true} model={this.model} property="password" /></Field>
                </Form>
                <Form>
                    <Button label="Login" onClick={this.login.bind(this)} />
                </Form>
            </Navigation>
        );
    }
}

window.addEventListener("load", () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
});
