import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Input } from "../components/Input";
import { ListDto } from "common/src/models/ListDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { ListService } from "../services/ListService";
import { AuthService } from "../services/AuthService";
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { MenuService } from "../services/MenuService";
import { MenuDto } from "common/src/models/MenuDto";
import { SelectOption } from "../components/SelectOption";
import { Select } from "../components/Select";
import { Dictionary } from "common/src/Dictionary";
import { TextArea } from "../components/TextArea";
import { FlexRow } from "../components/FlexRow";

interface Props { }
interface State extends BasePageState {
    model: ListDto;

}

class Page extends BasePage<Props, State> {
    private topMenuOptions: React.ReactElement[] = [];
    private leftMenuOptions: React.ReactElement[] = [];

    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                autoload: false,
                guid: UUIDv4.generate(),
                leftMenuGuid: "",
                topMenuGuid: "",
                title: "",
                sql: "",
                urlKey: "",
                editUrl: ""
            }
        };
    }
    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        const menuCompare = (a: MenuDto, b: MenuDto) => {
            if (a.display < b.display)
                return -1;
            if (a.display > b.display)
                return 1;
            return 0;
        };

        // load all menus
        const token = await AuthService.getToken();
        let menus = await MenuService.list(token);

        // create & organize top menu data
        const topMenuDictionary: Dictionary<MenuDto> = {};
        const topMenuList: MenuDto[] = [];
        menus.forEach((menu) => {
            if (menu.parentsGuid)
                return;

            topMenuDictionary[menu.guid] = menu;
            topMenuList.push(menu);
        });
        topMenuList.sort(menuCompare);

        // create & organize left menu data
        const leftMenuList: MenuDto[] = [];
        menus.forEach((menu) => {
            if (!menu.parentsGuid)
                return;

            menu.display = topMenuDictionary[menu.parentsGuid].display + " > " + menu.display;
            leftMenuList.push(menu);
        });
        leftMenuList.sort(menuCompare);

        // load select options
        this.topMenuOptions.push(<SelectOption display="" value="" />);
        topMenuList.forEach((menu) => {
            this.topMenuOptions.push(<SelectOption display={menu.display} value={menu.guid} />);
        });
        this.leftMenuOptions.push(<SelectOption display="" value="" />);
        leftMenuList.forEach((menu) => {
            this.leftMenuOptions.push(<SelectOption display={menu.display} value={menu.guid} />);
        });

        // if no guid provided, skip loading list item
        const guid = this.queryString("guid");
        if (!guid) {
            this.events.setLoading(false);
            return;
        }

        const model = await ListService.get(token, guid);
        await this.updateState({ model: model });
        this.events.setLoading(false);
    }

    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await ListService.save(token, this.state.model);
            window.location.replace("/static/pages/list.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            this.events.setMessage({
                title: "Error",
                content: (err as Error).message,
                buttons: [{
                    label: "OK", onClicked: () => {
                        this.events.setLoading(false);
                    }
                }]
            });
        }
    }
    public async deleteClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await ListService.delete(token, this.state.model.guid);
            window.history.back();
            return;
        }
        catch (err) {
            this.events.setMessage({
                title: "Error",
                content: (err as Error).message,
                buttons: [{
                    label: "OK", onClicked: () => {
                        this.events.setLoading(false);
                    }
                }]
            });
        }
    }

    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                leftMenuGuid="e1b4b1c6-0c4f-4a62-9c8f-8c8f3b9a4d61"
            >
                <Heading level={1}>List Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.guid = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Title"><Input
                        value={this.state.model.title}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.title = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="SQL"><TextArea
                        monospace={true}
                        rows={25}
                        value={this.state.model.sql}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.sql = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="URL Key" size={1}><Input
                        value={this.state.model.urlKey}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.urlKey = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Top Menu" size={1}>
                        <Select
                            value={this.state.model.topMenuGuid}
                            onChange={async (value) => {
                                const newModel = JSON.parse(JSON.stringify(this.state.model));
                                newModel.topMenuGuid = value;
                                await this.updateState({ model: newModel });
                            }}
                        >{this.topMenuOptions}</Select>
                    </Field>
                    <Field label="Left Menu" size={2}>
                        <Select
                            value={this.state.model.leftMenuGuid}
                            onChange={async (value) => {
                                const newModel = JSON.parse(JSON.stringify(this.state.model));
                                newModel.leftMenuGuid = value;
                                await this.updateState({ model: newModel });
                            }}
                        >{this.leftMenuOptions}</Select>
                    </Field>
                    <Field label="Edit URL" size={3}><Input
                        value={this.state.model.editUrl}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.editUrl = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Autoload" size={1}><Checkbox
                        checked={this.state.model.autoload}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.autoload = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Save" onClick={this.saveClicked.bind(this)} />
                    <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                </FlexRow>
            </Navigation >
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
