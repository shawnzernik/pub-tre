import * as React from "react";
import { createRoot } from "react-dom/client";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { FlexRow } from "../components/FlexRow";
import { Button } from "../components/Button";
import { TextArea } from "../components/TextArea";
import { ErrorMessage, Navigation } from "../components/Navigation";
import { AiciService } from "../services/AiciService";
import { AuthService } from "../services/AuthService";
import { Markdown } from "../components/Markdown";
import { Input } from "../components/Input";

interface Props { }
interface State extends BasePageState {
    similarTo: string;
    limit: string;
    results: any;
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            similarTo: "",
            limit: "10",
            results: null
        };
    }
    private async searchClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            const ret = await AiciService.search(token, this.state.similarTo, Number.parseInt(this.state.limit));
            await this.updateState({ results: ret });

            await this.events.setLoading(false);
        }
        catch (err) {
            await this.events.setLoading(false);
            await ErrorMessage(this, err);
        }
    }
    public render(): React.ReactNode {
        let md = "";
        if (this.state.results) {
            md += "## Results\n";
            md += "\n";
            md += "| Score | Title | Tokens |\n";
            md += "|---|---|---|\n";

            this.state.results.forEach((result: any) => {
                md += `| ${result.score} | ${result.payload.title} | ${result.payload.totalTokens} |\n`
            });
        }

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="f8d6fabe-c73a-4dac-bb4b-c85c776c45c1"
            >
                <Heading level={1}>Search</Heading>
                <Form>
                <Field label="Similar To"><TextArea
                        value={this.state.similarTo}
                        onChange={(value) => {
                            this.setState({
                                similarTo: value
                            });
                        }}
                    /></Field>
                    <Field label="Limit" size={1}><Input
                        value={this.state.limit}
                        onChange={(value) => {
                            this.setState({
                                limit: value
                            });
                        }}
                    /></Field>
                    <FlexRow gap="1em">
                        <Button label="Search" onClick={this.searchClicked.bind(this)} />
                    </FlexRow>
                </Form>

                <Markdown>{md}</Markdown>
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

