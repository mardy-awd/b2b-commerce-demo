import React from "react";
import { Props } from "@insite/shell/Components/Icons/AxiomIcon";

interface State {
    AxiomIcon: React.ReactElement<any> | null;
}

let isLinkTagInHead = false;

export default class AsyncAxiomIcon extends React.Component<Props, State> {
    state = {
        AxiomIcon: null,
    };

    async componentDidMount() {
        if (!isLinkTagInHead) {
            this.addCssLinkToHead();
            isLinkTagInHead = true;
        }

        const module: any = await import(
            /* webpackChunkName: "axiomIcon" */ "@insite/shell/Components/Icons/AxiomIcon"
        );

        this.setState({
            AxiomIcon: module.default,
        });
    }

    addCssLinkToHead = () => {
        const link = document.createElement("link");
        link.href = "/SystemResources/Styles/Admin/icons.css";
        link.rel = "stylesheet";
        link.type = "text/css";

        document.head.append(link);
    };

    render() {
        const AxiomIcon: any = this.state.AxiomIcon;

        if (!AxiomIcon) {
            return null;
        }

        return <AxiomIcon {...this.props} />;
    }
}
