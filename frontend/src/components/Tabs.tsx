import * as React from "react";
import { InputTheme } from "./InputTheme";
import { Dictionary } from "common/src/Dictionary";

interface Props {
    components: Dictionary<React.ReactElement>;
}
interface State {
    activeLabel: string;
}

export class Tabs extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        const labels = Object.keys(this.props.components);

        if (labels.length < 1)
            throw new Error("You must provide at least one tab component!");

        this.state = { activeLabel: labels[0] };
    }

    public render(): React.ReactNode {
        const labelDivs: React.ReactElement[] = [];
        const labels = Object.keys(this.props.components);
        for (let label of labels) {
            if (this.state.activeLabel == label)
                labelDivs.push(<>
                    <span
                        onClick={() => {
                            this.setState({ activeLabel: label });
                        }}
                        style={{
                            flexGrow: "0",
                            flexShrink: "0",
                            padding: "0.5em",
                            color: "#08f",
                            border: "1pt solid black",
                            borderBottom: "none",
                            borderTopLeftRadius: "0.25em",
                            borderTopRightRadius: "0.25em",
                            cursor: "pointer"
                        }}
                    >
                        {label}
                    </span>
                    <span
                        style={{
                            borderBottom: "1pt solid black",
                            flexGrow: "0",
                            flexShrink: "0",
                            padding: "0.5em",
                        }}
                    >&nbsp;</span>
                </>);
            else
                labelDivs.push(<>
                    <span
                        onClick={() => {
                            this.setState({ activeLabel: label });
                        }}
                        style={{
                            borderBottom: "1pt solid black",
                            flexGrow: "0",
                            flexShrink: "0",
                            padding: "0.5em",
                            cursor: "pointer",
                        }}
                    >
                        {label}
                    </span>
                    <span
                        style={{
                            borderBottom: "1pt solid black",
                            flexGrow: "0",
                            flexShrink: "0",
                            padding: "0.5em"
                        }}
                    >&nbsp;</span>
                </>);
        }

        const visibleComponent = this.props.components[this.state.activeLabel]

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row"
                    }}
                >
                    <span
                        style={{
                            borderBottom: "1pt solid black",
                            flexGrow: "0",
                            flexShrink: "0",
                            padding: "0.5em"
                        }}
                    >&nbsp;</span>
                    {labelDivs}
                    <span
                        style={{
                            flexGrow: "1",
                            flexShrink: "1",
                            borderBottom: "1pt solid black",
                            padding: "0.5em"
                        }}
                    >&nbsp;</span>
                </div>
                <div>
                    {visibleComponent}
                </div>
            </div>
        );
    }
}