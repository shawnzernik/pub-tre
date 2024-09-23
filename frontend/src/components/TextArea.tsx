import * as React from "react";
import { TextAreaTheme } from "./TextAreaTheme";
import { Theme } from "./Theme";
import { CSSProperties } from "react";

interface Props {
    password?: boolean;
    readonly?: boolean;
    value?: string;
    monospace?: boolean;
    rows?: number;
    onChange?: (value: string) => void;
}
interface State { }

export class TextArea extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        let style: CSSProperties = {
            ...TextAreaTheme
        };
        if (this.props.monospace)
            style = {
                ...style,
                fontFamily: "MonoText"
            };
        if (this.props.rows)
            style = {
                ...style,
                height: this.props.rows + 1 + "em" 
            };

        return <textarea
            style={style}
            value={this.props.value ? this.props.value : ""}
            readOnly={this.props.readonly}
            onChange={(e) => {
                if (this.props.onChange)
                    this.props.onChange(e.target.value);
            }}
        ></textarea>;
    }
}