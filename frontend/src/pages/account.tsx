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
                activeTopMenuGuid="b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3"
                activeLeftMenuGuid="c30341f3-f40e-4f94-96e5-1e63f9ac899e"
            >
<Markdown>{`
# My Account

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
