import { FoundModule, registerWidgetModule } from "@insite/client-framework/Components/ContentItemStore";
import DelayedSpinner from "@insite/client-framework/Components/DelayedSpinner";
import importWidgetChunk from "@insite/client-framework/Components/importWidgetChunk";
import MissingComponent from "@insite/client-framework/Components/MissingComponent";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import React from "react";

class AsyncComponent extends React.Component<
    { isWidget: boolean; type: string } & HasFields,
    { ComponentToBe: null | any }
> {
    state = {
        ComponentToBe: null,
    };

    componentDidMount() {
        importWidgetChunk(this.props.type, this.importCallback);
    }

    importCallback = (type: string, module?: FoundModule<WidgetModule>) => {
        if (!module?.default) {
            this.setState({ ComponentToBe: MissingComponent });
            return;
        }

        registerWidgetModule(module, type);
        this.setState({ ComponentToBe: module.default.component });
    };

    render() {
        const ComponentToBe: any = this.state.ComponentToBe;

        if (!ComponentToBe) {
            return <DelayedSpinner />;
        }

        return <ComponentToBe {...this.props} />;
    }
}

export default AsyncComponent;
