import * as React from "react";
import { FieldTheme } from "./Field.Theme";
import { Theme } from "./Theme";

interface Props {
    children?: React.ReactNode;
    label: string;
    size?: number;
}
interface State { }

export class Field extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return (
            <div style={{
                ...FieldTheme.field,
                width: this.props.size ? this.props.size * Theme.FormLabelWidthEm + "em" : "100%"
            }}>
                <span style={FieldTheme.fieldLabel}>{this.props.label}:</span>
                {this.props.children}
            </div>
        );
    }
}