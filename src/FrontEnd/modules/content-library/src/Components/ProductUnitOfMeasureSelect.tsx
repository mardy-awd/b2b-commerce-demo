import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { UnitOfMeasureModel } from "@insite/client-framework/Types/ApiModels";
import Select, { SelectPresentationProps, SelectProps } from "@insite/mobius/Select";
import * as React from "react";
import { connect } from "react-redux";

interface OwnProps extends SelectProps {
    productUnitOfMeasures: UnitOfMeasureModel[];
    selectedUnitOfMeasure: string;
    onChangeHandler?: (value: string) => void;
    labelOverride?: React.ReactNode;
    disabled?: boolean;
    extendedStyles?: SelectPresentationProps;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

export const productUnitOfMeasureSelectStyles: SelectPresentationProps = {};

const ProductUnitOfMeasureSelect: React.FC<Props> = ({
     productUnitOfMeasures,
     selectedUnitOfMeasure,
     productSettings,
     onChangeHandler,
     labelOverride,
     disabled,
     extendedStyles,
     ...otherProps
}) => {
    const [styles] = React.useState(() => mergeToNew(productUnitOfMeasureSelectStyles, extendedStyles));

    if (!productSettings?.alternateUnitsOfMeasure || productUnitOfMeasures.filter(uom => uom.unitOfMeasure).length <= 1) {
        return null;
    }

    const uomChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChangeHandler) {
            onChangeHandler(event.target.value);
        }
    };

    return <Select
        label={labelOverride ?? translate("U/M")}
        value={selectedUnitOfMeasure}
        onChange={uomChangeHandler}
        disabled={disabled}
        data-test-selector="product_unitOfMeasureSelect"
        {...styles}
        {...otherProps}
    >
        {productUnitOfMeasures.map(uom =>
            <option key={uom.id.toString()} value={uom.unitOfMeasure}>
                {uom.description ? uom.description : uom.unitOfMeasureDisplay} {uom.qtyPerBaseUnitOfMeasure !== 1 ? `/${uom.qtyPerBaseUnitOfMeasure}` : ""}
            </option>)
        }
    </Select>;
};

export default connect(mapStateToProps)(ProductUnitOfMeasureSelect);
