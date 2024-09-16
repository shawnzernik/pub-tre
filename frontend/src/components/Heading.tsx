import * as React from "react";

interface Props {
    children: React.ReactNode;
    level: 1 | 2 | 3 | 4 | 5 | 6;
}
interface State { }

export class Heading extends React.Component<Props, State> {
	public render(): React.ReactNode {
		return <span
            style={{ fontSize: 7 - this.props.level + "em" }}
        >{this.props.children}</span>
	}
}