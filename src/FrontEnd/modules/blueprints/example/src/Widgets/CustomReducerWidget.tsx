/*
 * This illustrates how to create a widget that makes use of a custom reducer
 * See ../Store/Reducers.ts for how to create the custom reducer.
 */

import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Button from "@insite/mobius/Button";
import { CustomActions, CustomState } from "blueprints/example/src/Store/Reducers";
import React from "react";
import { connect, DispatchProp } from "react-redux";

const mapStateToProps = (state: CustomState) => ({
    immerCount: state.customReducerUsingImmer.total,
    traditionalCount: state.customReducerTraditional.total,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & DispatchProp<CustomActions>;

const CustomReducerWidget: React.FC<Props> = ({ dispatch, immerCount, traditionalCount }) => (<>
    <Button onClick={() => dispatch({ type: "Custom/Immer/Add", amount: 1 })}>
        {`Immer ${immerCount}`}
    </Button>
    <Button onClick={() => dispatch({ type: "Custom/Traditional/Add", amount: 1 })}>
        {`Traditional ${traditionalCount}`}
    </Button>
</>);

export const definition: WidgetDefinition = {
    group: "Testing Extensions" as any, // Extend the standard groups with `as any`.
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CustomReducerWidget),
    definition,
};

export default widgetModule;
