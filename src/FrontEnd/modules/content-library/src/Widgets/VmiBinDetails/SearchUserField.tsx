import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadVmiCounts from "@insite/client-framework/Store/Data/VmiCounts/Handlers/LoadVmiCounts";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateCountsSearchFields";
import translate from "@insite/client-framework/Translate";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import debounce from "lodash/debounce";
import React, { ChangeEvent } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    getVmiCountsUserParameter: state.pages.vmiBinDetails.getVmiCountsUserParameter,
    getVmiCountsParameter: state.pages.vmiBinDetails.getVmiCountsParameter,
});

const mapDispatchToProps = {
    updateSearchFields,
    loadVmiCounts,
};

export interface SearchUserFieldStyles {
    searchDynamicDropdown?: DynamicDropdownPresentationProps;
    optionWrapper?: InjectableCss;
    infoWrapper?: InjectableCss;
    autocompleteTitleText?: TypographyPresentationProps;
}

export const searchUserFieldStyles: SearchUserFieldStyles = {
    optionWrapper: {
        css: css`
            display: flex;
            cursor: pointer;
        `,
    },
    infoWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
        `,
    },
    autocompleteTitleText: {
        size: 14,
    },
};
const styles = searchUserFieldStyles;

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

interface State {
    options: OptionObject[];
}

class SearchUserField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            options: [],
        };
    }

    onSelectionChangeHandler = (value?: string) => {
        this.props.updateSearchFields({ userName: value });
    };

    debouncedSearchProducts = debounce((query: string) => {
        const parameter = this.props.getVmiCountsUserParameter;
        this.props.loadVmiCounts({
            ...parameter,
            userName: query,
            onComplete: result => {
                if (!result?.apiResult?.binCounts) {
                    return;
                }

                const newOptions = result?.apiResult?.binCounts.map(binCount => ({
                    optionText: binCount.createdBy,
                    optionValue: binCount.createdBy,
                    rowChildren: (
                        <StyledWrapper {...styles.optionWrapper}>
                            <StyledWrapper {...styles.infoWrapper}>
                                <Typography {...styles.autocompleteTitleText}>{binCount.createdBy}</Typography>
                            </StyledWrapper>
                        </StyledWrapper>
                    ),
                }));

                this.setState({
                    options: newOptions,
                });
            },
        });
    }, 300);

    onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value) {
            this.props.updateSearchFields({ userName: "" });
        }
        this.debouncedSearchProducts(event.target.value);
    };

    render() {
        return (
            <DynamicDropdown
                {...styles.searchDynamicDropdown}
                label={translate("User")}
                onSelectionChange={this.onSelectionChangeHandler}
                onInputChange={this.onInputChanged}
                filterOption={() => true}
                selected={this.props.getVmiCountsParameter.userName}
                options={this.state.options}
                placeholder={translate("Search User")}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserField);
