import * as React from "react";
import { createRoot } from "react-dom/client";
import { BootstrapIcon } from "../components/BoostrapIcon";
import { Heading } from "../components/Heading";

interface Props { }
interface State { }

class Page extends React.Component<Props, State> {
	public render(): React.ReactNode {
		return <Heading level={1}><BootstrapIcon size={1} name="alarm" /> Login</Heading>;
	}
}

window.onload = () => {
	const element = document.getElementById('root');
	const root = createRoot(element);
	root.render(<Page />)
}
