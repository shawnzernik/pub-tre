import * as React from "react";
import { ButtonTheme } from "./Button.Theme";
import { FormTheme } from "./Form.Theme";

interface Props { 
    children?: React.ReactNode;
}
interface State { }

export class Form extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return <div style={FormTheme}>{this.props.children}</div>;
    }
}