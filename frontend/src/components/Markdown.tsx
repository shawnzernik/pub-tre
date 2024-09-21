import * as React from "react";
import { MarkdownTheme } from "./Markdown.Theme";
import { marked } from "marked";

interface Props {
    children: string;
}
interface State {}

export class Markdown extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return <div className="marked" style={MarkdownTheme} dangerouslySetInnerHTML={{ __html: marked(this.props.children) }} />;
    }
}