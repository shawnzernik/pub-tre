import * as React from "react";
import { createRoot } from "react-dom/client";

interface Props { }
interface State { }

class Page extends React.Component<Props, State> {
	public render(): React.ReactNode {
		return <h1>Group</h1>;
	}
}

window.onload = () => {
	const element = document.getElementById('root');
	const root = createRoot(element);
	root.render(<Page />)
}
