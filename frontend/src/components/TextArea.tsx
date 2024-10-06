import * as React from "react";
import { TextAreaTheme } from "./TextAreaTheme";
import { CSSProperties } from "react";

interface Props {
    id?: string;
    password?: boolean;
    readonly?: boolean;
    value?: string;
    monospace?: boolean;
    rows?: number;
    onChange?: (value: string) => void;
    style?: CSSProperties;
    showAll?: boolean;
}
interface State { }

export class TextArea extends React.Component<Props, State> {
    private textAreaRef: React.RefObject<HTMLTextAreaElement>;

    public constructor(props: Props) {
        super(props);
        this.textAreaRef = React.createRef();
    }

    public render(): React.ReactNode {
        let style: CSSProperties = {
            ...TextAreaTheme,
            ...this.props.style
        };

        if (this.props.monospace) {
            style = {
                ...style,
                fontFamily: "MonoText"
            };
        }

        // If rows are defined and showAll is not enabled, set height based on rows
        if (this.props.rows && !this.props.showAll) {
            style = {
                ...style,
                height: `${this.props.rows + 1}em`
            };
        }

        const lines = this.props.value.split("\n").length;
        if (this.props.showAll) {
            style = {
                ...style,
                height: `${lines * 1.35 + 10}em`
            };
        }

        return (
            <textarea
                id={this.props.id}
                ref={this.textAreaRef}
                style={style}
                value={this.props.value ? this.props.value : ""}
                readOnly={this.props.readonly}
                onChange={(e) => {
                    if (this.props.onChange) {
                        this.props.onChange(e.target.value);
                    }
                }}
            ></textarea>
        );
    }
}