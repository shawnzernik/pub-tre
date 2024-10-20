import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { ListService } from "../services/ListService";
import { AuthService } from "../services/AuthService";
import { ListDto } from "common/src/models/ListDto";
import { Heading } from "../components/Heading";
import { Table } from "../components/Table";

interface Props { }
interface State extends BasePageState {
    items: any[];
    list?: ListDto;
}

/**
 * Represents the Page component that displays a list of items.
 */
class Page extends BasePage<Props, State> {
    /**
     * Creates an instance of the Page component.
     * @param props - The props for the component.
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            items: []
        };
    }

    /**
     * Lifecycle method that is called after the component is mounted.
     * Fetches the list and its items from the server.
     */
    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        const token = await AuthService.getToken();
        const list = await ListService.getUrlKey(token, this.queryString("url_key"));
        await this.updateState({ list: list });

        const items = await ListService.getItems(token, this.state.list.guid, []);
        await this.updateState({ items: items });

        this.events.setLoading(false);
    }

    /**
     * Renders the component.
     * @returns The rendered component.
     */
    public render(): React.ReactNode {
        if (!this.state.list || !this.state.items)
            return;

        let keys: string[] = [];
        if (this.state.items.length > 0)
            Object.keys(this.state.items[0]).forEach((key) => {
                if (key != "guid")
                    keys.push(key);
            });

        const headers: React.ReactNode[] = [];
        keys.forEach((key) => {
            headers.push(<th>{key}</th>);
        });

        const rows: React.ReactNode[] = [];
        this.state.items.forEach((item, index) => {
            const row: React.ReactNode[] = [];
            keys.forEach((key) => {
                row.push(<td>{item[key]}</td>);
            });
            rows.push(<tr>{row}</tr>);
        });

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid={this.state.list.topMenuGuid}
                leftMenuGuid={this.state.list.leftMenuGuid}
            >
                <Heading level={1}>{this.state.list.title}</Heading>
                <Table
                    items={this.state.items}
                    primaryKey="guid"
                    addUrl={this.state.list.editUrl}
                    editUrl={this.state.list.editUrl}
                />
            </Navigation>
        );
    }
}

/**
 * Initializes the Page component and renders it.
 */
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
