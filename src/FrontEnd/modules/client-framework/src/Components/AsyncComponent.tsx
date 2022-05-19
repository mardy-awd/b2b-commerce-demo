import {
    FoundModule,
    registerPageModule,
    registerWidgetModule,
} from "@insite/client-framework/Components/ContentItemStore";
import DelayedSpinner from "@insite/client-framework/Components/DelayedSpinner";
import importChunk from "@insite/client-framework/Components/importChunk";
import MissingComponent from "@insite/client-framework/Components/MissingComponent";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import PageModule from "@insite/client-framework/Types/PageModule";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import React from "react";

type Props = { isWidget: boolean; type: string } & Partial<HasFields>;

class AsyncComponent extends React.Component<Props, { ComponentToBe: null | any }> {
    state = {
        ComponentToBe: null,
    };

    componentDidMount() {
        this.handleImport();
    }

    handleImport = async () => {
        const fn = importChunk[this.props.type];

        if (!fn) {
            return this.setState({ ComponentToBe: MissingComponent });
        }

        const module = await fn();

        this.props.isWidget
            ? registerWidgetModule(module as FoundModule<WidgetModule>, this.props.type)
            : registerPageModule(module as FoundModule<PageModule>, this.props.type);

        this.setState({ ComponentToBe: module.default.component || module.default });
    };

    render() {
        const ComponentToBe: any = this.state.ComponentToBe;

        if (!ComponentToBe) {
            return <DelayedSpinner isWidget={this.props.isWidget} />;
        }

        return <ComponentToBe {...this.props} />;
    }
}

export default AsyncComponent;
