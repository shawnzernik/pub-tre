import * as React from "react";
import { NavigationTheme } from "./Navigation.Theme";
import { BootstrapIcon } from "./BootstrapIcon";
import { Button } from "./Button";
import { Message } from "./Message";
import { Theme } from "./Theme";

export interface NavigationMessageEvents {
    setLoading: (value: boolean) => Promise<void>;
    setMessage: (value: Message) => Promise<void>;

}
export interface NavigationMessageState {
    loading: boolean;
    message?: Message;
}

interface Props {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    state: NavigationMessageState;
    events: NavigationMessageEvents;
}
interface State {
    showMenu: boolean;
}

export class Navigation extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            showMenu: true,
        };
    }

    public render(): React.ReactNode {
        let menu = undefined;
        if (this.state.showMenu)
            menu = <>
                <div style={NavigationTheme.stageMiddleMenu}>
                    <div style={NavigationTheme.stageMiddleMenuItem}><BootstrapIcon color={Theme.darkText} name="window" size={2} />&nbsp; Item 1</div>
                    <div style={NavigationTheme.stageMiddleMenuItem}><BootstrapIcon color={Theme.darkText} name="window" size={2} />&nbsp; Item 2</div>
                    <div style={NavigationTheme.stageMiddleMenuItem}><BootstrapIcon color={Theme.darkText} name="window" size={2} />&nbsp; Item 3</div>
                    <div style={NavigationTheme.stageMiddleMenuItem}><BootstrapIcon color={Theme.darkText} name="window" size={2} />&nbsp; Item 4</div>
                    <div style={NavigationTheme.stageMiddleMenuItem}><BootstrapIcon color={Theme.darkText} name="window" size={2} />&nbsp; Item 5</div>
                    <div style={NavigationTheme.stageMiddleMenuItem}><BootstrapIcon color={Theme.darkText} name="window" size={2} />&nbsp; Item 6</div>
                    <div style={NavigationTheme.stageMiddleMenuItem}><BootstrapIcon color={Theme.darkText} name="window" size={2} />&nbsp; Item 7</div>
                </div>
            </>;

        let loading = undefined;
        if (this.props.state.loading) {
            loading = (
                <div style={NavigationTheme.fade}>
                    <div style={NavigationTheme.fadeMessage}>
                        <div style={NavigationTheme.fadeMessageTitle}>Loading</div>
                    </div>
                </div>
            );
        }

        let message: React.ReactElement | undefined = undefined;
        if (this.props.state.message) {
            let buttons: React.ReactElement[] = []
            this.props.state.message.buttons.forEach((btn) => {
                buttons.push(
                    <Button
                        label={btn.label}
                        onClick={() => {
                            btn.onClicked();
                            this.props.events.setMessage(null);
                        }}
                    />
                );
            });

            message = (
                <div style={NavigationTheme.fade}>
                    <div style={NavigationTheme.fadeMessage}>
                        <div style={NavigationTheme.fadeMessageTitle}>{this.props.state.message.title}</div>
                        <div style={NavigationTheme.fadeMessageContent}>{this.props.state.message.content}</div>
                        <div style={NavigationTheme.fadeMessageButtons}>{buttons}</div>
                    </div>
                </div>
            );
        }

        return <>
            <div style={NavigationTheme.stage}>
                <div style={NavigationTheme.stageTop}>
                    <div
                        style={{ ...NavigationTheme.stageTopMenu, cursor: "pointer" }}
                        onClick={() => {
                            this.setState((prev) => {
                                return {
                                    showMenu: !prev.showMenu
                                }
                            });
                        }}
                    >
                        <BootstrapIcon style={NavigationTheme.stageTopMenuIcon} name="lightbulb-fill" size={2} />
                        &nbsp; TypeScript React Express
                    </div>
                    <div style={NavigationTheme.stageTopMenu}>
                        <BootstrapIcon name="person-fill" size={2} color={Theme.lightText} />
                        &nbsp; Session
                    </div>
                    <div style={NavigationTheme.stageTopMenu}>
                        <BootstrapIcon name="house" size={2} color={Theme.lightText} />
                        &nbsp; Application
                    </div>
                    <div style={NavigationTheme.stageTopMenu}>
                        <BootstrapIcon name="toggles" size={2} color={Theme.lightText} />
                        &nbsp; System
                    </div>
                </div>
                <div style={NavigationTheme.stageMiddle}>
                    {menu}
                    <div style={NavigationTheme.stageMiddleContent}>{this.props.children}</div>
                </div>
                <div style={NavigationTheme.stageBottom}>
                    <div style={NavigationTheme.stageBottomItem}>&copy; Copyright 2024, Shawn Zernik</div>
                    <div style={NavigationTheme.stageBottomItem}>v0.0.0</div>
                    <div style={NavigationTheme.stageBottomItem}>administrator@localhost</div>
                </div>
            </div>
            {message ? message : loading ? loading : null}
        </>;
    }
}