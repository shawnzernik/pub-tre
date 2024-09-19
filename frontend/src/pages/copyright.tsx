import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";

interface Props { }
interface State extends BasePageState { }

class Page extends BasePage<Props, State> {
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                activeTopMenuGuid="b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3"
                activeLeftMenuGuid="5a8a209b-e6c1-42e4-8bc9-f144feec6d8e"
            >
                <Heading level={1}>TypeScript React Express</Heading>
                <p>Copyright &copy; 2024 Shawn Zernik</p>
                <p>
                    This program is free software: you can redistribute it and/or modify
                    it under the terms of the GNU Affero General Public License as
                    published by the Free Software Foundation, either version 3 of the
                    License, or (at your option) any later version.
                </p>
                <p>
                    This program is distributed in the hope that it will be useful,
                    but WITHOUT ANY WARRANTY; without even the implied warranty of
                    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                    GNU Affero General Public License for more details.
                </p>
                <p>
                    You should have received a copy of the GNU Affero General Public License
                    along with this program.  If not, see &lt;https://www.gnu.org/licenses/&gt;.
                </p>
            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
}
