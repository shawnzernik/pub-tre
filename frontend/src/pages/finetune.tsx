import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Input } from "../components/Input";
import { FinetuneDto } from "common/src/models/FinetuneDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { FinetuneService } from "../services/FinetuneService";
import { AuthService } from "../services/AuthService";
import { Button } from "../components/Button";
import { FlexRow } from "../components/FlexRow";

interface Props { }
interface State extends BasePageState {
    model: FinetuneDto;
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                guid: UUIDv4.generate(),
                displayName: "",
                suffix: "",
                id: "",
                model: "",
                trainingFile: "",
                trainingData: "",
                validationFile: "",
                validationData: ""
            }
        };
    }

    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        const token = await AuthService.getToken();
        const guid = this.queryString("guid");
        if (!guid) {
            this.events.setLoading(false);
            return;
        }

        const model = await FinetuneService.get(token, guid);
        await this.updateState({ model: model });
        this.events.setLoading(false);
    }

    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await FinetuneService.save(token, this.state.model);
            window.location.replace("/static/pages/finetune.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public async deleteClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await FinetuneService.delete(token, this.state.model.guid);
            window.history.back();
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
            >
                <Heading level={1}>Finetune Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                    /></Field>
                    <Field label="Display Name"><Input
                        value={this.state.model.displayName}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, displayName: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Suffix"><Input
                        value={this.state.model.suffix}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, suffix: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="ID"><Input
                        value={this.state.model.id}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, id: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Model"><Input
                        value={this.state.model.model}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, model: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Training File"><Input
                        value={this.state.model.trainingFile}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, trainingFile: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Training Data"><Input
                        value={this.state.model.trainingData}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, trainingData: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Validation File"><Input
                        value={this.state.model.validationFile}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, validationFile: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Validation Data"><Input
                        value={this.state.model.validationData}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, validationData: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Save" onClick={this.saveClicked.bind(this)} />
                    <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                </FlexRow>
            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById("root");
    const root = createRoot(element);
    root.render(<Page />);
};
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};