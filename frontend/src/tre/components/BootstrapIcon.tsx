import * as React from "react";
import { BootstrapIconTheme } from "./BootstrapIconTheme";

interface Props {
    name: string;
    size: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: any;
}

interface State { }

export class BootstrapIcon extends React.Component<Props, State> {
    public render(): React.ReactNode {
        let css: React.CSSProperties = { ...BootstrapIconTheme(this.props.size) };
        css = { ...css, ...this.props.style };
        if (this.props.color)
            css = { ...css, color: this.props.color };

        return <i
            onClick={this.props.onClick}
            style={css}
            className={("bi-" + this.props.name + " " + this.props.className).trim()}
        ></i>;
    }
}
