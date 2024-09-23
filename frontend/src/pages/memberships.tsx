import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Markdown } from "../components/Markdown";

interface Props { }
interface State extends BasePageState { }

class Page extends BasePage<Props, State> {
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                leftMenuGuid="ad90d1f8-fdd4-45e4-93b2-731f64a82c50"
            >
<Markdown>{`
# Memberships

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
