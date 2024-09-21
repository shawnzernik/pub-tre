import * as React from "react";
import { InputTheme } from "./Input.Theme";
import { Theme } from "./Theme";

interface Props {
    model: any;
    property: string;
    password?: boolean;
}
interface State {
    value: string;
}

export class Input extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.model[this.props.property]
        };
    }
    public render(): React.ReactNode {
        return <input
            type={this.props.password ? "password" : "text"}
            style={InputTheme}
            value={this.state.value}
            onChange={(e) => {
                const newValue = e.target.value;
                this.props.model[this.props.property] = newValue;
                this.setState({ value: newValue });
            }}
        />;
    }
}