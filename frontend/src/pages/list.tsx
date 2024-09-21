import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Markdown } from "../components/Markdown";

interface Props { }
interface State extends BasePageState { }

class Page extends BasePage<Props, State> {
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                activeTopMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                activeLeftMenuGuid="35697b22-5894-44e7-b574-d0cf7f63af80"
            >
<Markdown>{`
# List Edit

This page has not been implemented.

`}
</Markdown>
            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
}
