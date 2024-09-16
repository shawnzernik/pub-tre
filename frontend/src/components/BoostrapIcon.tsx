import * as React from "react";

interface Props {
    name: string;
    className?: string;
    size: number;
}
interface State { }

export class BootstrapIcon extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return <i
            style={{ fontSize: this.props.size + "em" }}
            className={("bi-" + this.props.name + " " + this.props.className).trim()}
        ></i>;
    }
}