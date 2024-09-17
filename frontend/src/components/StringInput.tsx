import * as React from "react";
import { StringInputTheme } from "./StringInput.Theme";
import { Theme } from "./Theme";

interface Props {
    model: any;
    property: string;
    password?: boolean;
}
interface State {
    value: string;
}

export class StringInput extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.model[this.props.property]
        };
    }
    public render(): React.ReactNode {
        return <input
            type={this.props.password ? "password" : "text"}
            style={StringInputTheme}
            value={this.state.value}
            onChange={(e) => {
                const newValue = e.target.value;
                this.props.model[this.props.property] = newValue;
                this.setState({ value: newValue });
            }}
        />;
    }
}