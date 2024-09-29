import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Markdown } from "../components/Markdown";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { FlexRow } from "../components/FlexRow";

interface Props { }
interface State extends BasePageState { }

class Page extends BasePage<Props, State> {
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3"
                leftMenuGuid="c30341f3-f40e-4f94-96e5-1e63f9ac899e"
            >
                <Heading level={1}>My Account</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input /></Field>
                    <Field label="Name" size={2}><Input /></Field>
                    <Field label="Email" size={2}><Input /></Field>
                    <Field label="Phone" size={2}><Input /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Save" />
                </FlexRow>

                <Heading level={2}>Change Password</Heading>
                <Form>
                    <Field label="Current" size={2}><Input password={true}/></Field>
                    <Field label="New" size={2}><Input password={true}/></Field>
                    <Field label="Confirm" size={2}><Input password={true}/></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Change" />
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
