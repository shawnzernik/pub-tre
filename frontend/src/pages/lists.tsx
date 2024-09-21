import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Markdown } from "../components/Markdown";
import { ListService } from "../services/ListService";
import { AuthService } from "../services/AuthService";
import { ListDto } from "common/src/models/ListDto";

interface Props { }
interface State extends BasePageState { 
    items: any[];
}

class Page extends BasePage<Props, State> {
    private list: ListDto;
    
    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        try {
            const token = AuthService.getToken();
            this.list = await ListService.getUrlKey(token, this.queryString("url_key"));
            const items = await ListService.getItems(token, this.list.guid, []);

            this.setState({ items: items });

            this.events.setLoading(false);
        }
        catch (err) {
            this.events.setMessage({
                title: "Error",
                content: (err as Error).message,
                buttons: [{ label: "OK", onClicked: () => { } }]
            })
        }
    }

    public render(): React.ReactNode {
        if(!this.list || !this.state.items)
            return;

        return (
            <Navigation
                state={this.state} events={this.events}
                activeTopMenuGuid={this.list.topMenuGuid}
                activeLeftMenuGuid={this.list.leftMenuGuid}
            >
                <Markdown>{`
# List View

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
