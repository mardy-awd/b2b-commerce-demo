import updateSearchFields from "@insite/client-framework/Store/Pages/VmiLocations/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { LocationsPageContext } from "@insite/content-library/Pages/VmiLocationsPage";
import Search from "@insite/mobius/Icons/Search";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

export interface AddressBookSearchBoxStyles {
    searchText?: TextFieldProps;
}

export const searchBoxStyles: AddressBookSearchBoxStyles = {
    searchText: { iconProps: { src: Search } },
};

const styles = searchBoxStyles;

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

class VmiLocationsSearchBox extends React.Component<Props> {
    searchTimeoutId: number | undefined;
    readonly searchMinimumCharacterLength = 3;

    searchTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof this.searchTimeoutId === "number") {
            clearTimeout(this.searchTimeoutId);
        }
        const searchText = event.currentTarget.value;
        if (searchText.length > 0 && searchText.length < this.searchMinimumCharacterLength) {
            return;
        }
        this.searchTimeoutId = setTimeout(() => {
            this.props.updateSearchFields({
                filter: searchText,
                page: 1,
            });
        }, 250);
    };

    componentWillUnmount() {
        if (typeof this.searchTimeoutId === "number") {
            clearTimeout(this.searchTimeoutId);
        }
    }

    render() {
        return (
            <TextField
                placeholder={translate("Search Locations")}
                {...styles.searchText}
                onChange={this.searchTextChangeHandler}
            />
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(VmiLocationsSearchBox),
    definition: {
        group: "VMI Locations",
        allowedContexts: [LocationsPageContext],
    },
};

export default widgetModule;
