import * as React from "react";
import { createRoot } from "react-dom/client";

interface Props { }
interface State { }

class Root extends React.Component<Props, State> {
    componentDidMount(): void {
        document.title = "Login";
    }
	public render(): React.ReactNode {
		return <h1>Hello World!</h1>;
	}
}

window.onload = () => {
	const element = document.getElementById('root');
	const root = createRoot(element);
	root.render(<Root />)
}
