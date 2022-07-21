import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { AllowedContexts } from "@insite/client-framework/Types/AllowedContexts";
import WidgetGroups, { WidgetGroup, WidgetGroupDisplayNames } from "@insite/client-framework/Types/WidgetGroups";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Tab from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup";
import TextField from "@insite/mobius/TextField";
import AxiomIcon from "@insite/shell/Components/Icons/AxiomIcon";
import AxLinkList from "@insite/shell/Components/Icons/AxiomIcon/AxLinkList";
import { getWidgetDefinition, getWidgetDefinitions } from "@insite/shell/DefinitionLoader";
import { LoadedWidgetDefinition } from "@insite/shell/DefinitionTypes";
import { setupWidgetModel } from "@insite/shell/Services/WidgetCreation";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { addWidget } from "@insite/shell/Store/Data/Pages/PagesActionCreators";
import { isSharedContentOpened } from "@insite/shell/Store/Data/Pages/PagesHelpers";
import {
    doneEditingItem,
    editWidget,
    hideAddWidgetModal,
    savePage,
} from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import ShellState from "@insite/shell/Store/ShellState";
import sortBy from "lodash/sortBy";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ShellState) => {
    const currentPage = getCurrentPage(state);
    const pageType = currentPage.type;
    const groups: WidgetGroup[] = [];
    const widgetsByGroup: Dictionary<LoadedWidgetDefinition[]> = {};

    for (const widgetDefinition of getWidgetDefinitions()) {
        if (widgetDefinition.isDeprecated || widgetDefinition.type === "Basic/PageTypeLink") {
            continue;
        }

        if (
            widgetDefinition.allowedContexts &&
            widgetDefinition.allowedContexts.indexOf(pageType as AllowedContexts) < 0
        ) {
            continue;
        }

        if (widgetDefinition.canAdd && !widgetDefinition.canAdd(state.shellContext)) {
            continue;
        }

        if (state.shellContext.mobileCmsModeActive && widgetDefinition.group !== "Mobile") {
            continue;
        }
        if (!state.shellContext.mobileCmsModeActive && widgetDefinition.group === "Mobile") {
            continue;
        }

        if (!widgetDefinition.group) {
            continue;
        }

        if (!widgetsByGroup[widgetDefinition.group]) {
            groups.push(widgetDefinition.group);
            widgetsByGroup[widgetDefinition.group] = [];
        }

        widgetsByGroup[widgetDefinition.group].push(widgetDefinition);
    }

    for (const groupKey in widgetsByGroup) {
        widgetsByGroup[groupKey].sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));
    }

    return {
        page: currentPage,
        currentLanguage: state.shellContext.languagesById[state.shellContext.currentLanguageId]!,
        defaultLanguageId: state.shellContext.defaultLanguageId,
        currentPersonaId: state.shellContext.currentPersonaId,
        currentDeviceType: state.shellContext.currentDeviceType,
        defaultPersonaId: state.shellContext.defaultPersonaId,
        addWidgetData: state.pageEditor.addWidgetData,
        widgetsByGroup,
        groups: sortBy(groups, [o => WidgetGroups.indexOf(o)]),
        sharedContents: state.pageTree.sharedContentTreeNodesByParentId[emptyGuid] || [],
        mobileCmsModeActive: state.shellContext.mobileCmsModeActive,
    };
};

const mapDispatchToProps = {
    addWidget,
    savePage,
    editWidget,
    hideAddWidgetModal,
    doneEditingItem,
};

interface State {
    widgetSearch: string;
    sharedContentSearch: string;
}

interface AddWidgetModalStyles {
    modal: ModalPresentationProps;
}

const styles: AddWidgetModalStyles = {
    modal: {
        size: 900,
        cssOverrides: {
            modalContent: css`
                overflow-y: hidden;
                padding: 10px 30px;
            `,
        },
    },
};

class AddWidgetModal extends React.Component<Props, State> {
    searchInputWrapper = React.createRef<HTMLInputElement>();
    sharedContentSearchInputWrapper = React.createRef<HTMLInputElement>();
    lastAddWidgetData?: AddWidgetData;

    constructor(props: Props) {
        super(props);

        this.state = {
            widgetSearch: "",
            sharedContentSearch: "",
        };
    }

    close = () => {
        this.props.hideAddWidgetModal();
    };

    searchChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            widgetSearch: event.currentTarget.value,
        });
    };

    sharedContentSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            sharedContentSearch: event.currentTarget.value,
        });
    };

    addWidget = (widgetDefinition: LoadedWidgetDefinition) => {
        const {
            addWidgetData,
            addWidget,
            currentLanguage,
            defaultLanguageId,
            currentPersonaId,
            defaultPersonaId,
            currentDeviceType,
            savePage,
            editWidget,
            hideAddWidgetModal,
            page,
        } = this.props;
        if (!addWidgetData) {
            return;
        }

        const newWidget = setupWidgetModel(
            widgetDefinition,
            addWidgetData.parentId,
            addWidgetData.zoneName,
            currentLanguage,
            defaultLanguageId,
            currentDeviceType,
            currentPersonaId,
            defaultPersonaId,
        ) as WidgetProps;

        if (page.type === "Layout") {
            newWidget.isLayout = true;
        }

        addWidget(newWidget, addWidgetData.sortOrder, page.id);
        editWidget(newWidget.id, true);
        hideAddWidgetModal();
        savePage();
    };

    addSharedContent = (sharedContent: TreeNodeModel) => {
        const {
            addWidgetData,
            addWidget,
            currentLanguage,
            defaultLanguageId,
            currentPersonaId,
            defaultPersonaId,
            currentDeviceType,
            doneEditingItem,
            hideAddWidgetModal,
            page,
        } = this.props;
        if (!addWidgetData) {
            return;
        }

        const newWidget = setupWidgetModel(
            getWidgetDefinition("Basic/SharedContent"),
            addWidgetData.parentId,
            addWidgetData.zoneName,
            currentLanguage,
            defaultLanguageId,
            currentDeviceType,
            currentPersonaId,
            defaultPersonaId,
        ) as WidgetProps;

        if (page.type === "Layout") {
            newWidget.isLayout = true;
        }

        newWidget.fields["pageId"] = sharedContent.pageId;
        newWidget.generalFields["pageId"] = sharedContent.pageId;

        addWidget(newWidget, addWidgetData.sortOrder, page.id);
        doneEditingItem();
        hideAddWidgetModal();
    };

    render() {
        const { groups, widgetsByGroup, addWidgetData, sharedContents } = this.props;

        if (addWidgetData?.addRow && !this.lastAddWidgetData?.addRow) {
            this.addWidget(getWidgetDefinition("Basic/Row"));
        }

        setTimeout(() => {
            if (addWidgetData && !this.lastAddWidgetData && this.searchInputWrapper.current) {
                this.searchInputWrapper.current.querySelector("input")!.focus();
            }
            this.lastAddWidgetData = addWidgetData;
        });

        const { widgetSearch, sharedContentSearch } = this.state;
        let displayedWidgetsByGroup: Dictionary<LoadedWidgetDefinition[]> = {};
        if (widgetSearch) {
            Object.keys(widgetsByGroup).forEach(groupName => {
                const possibleWidgets = widgetsByGroup[groupName];
                for (const widget of possibleWidgets) {
                    if (widget.displayName!.toLowerCase().indexOf(widgetSearch.toLowerCase()) >= 0) {
                        if (!displayedWidgetsByGroup[groupName]) {
                            displayedWidgetsByGroup[groupName] = [];
                        }
                        displayedWidgetsByGroup[groupName].push(widget);
                    }
                }
            });
        } else {
            displayedWidgetsByGroup = widgetsByGroup;
        }

        const filteredSharedContents = sharedContents?.filter(
            o =>
                o.displayName.toLowerCase().indexOf(sharedContentSearch.toLowerCase()) > -1 ||
                o.tags.some(p => p.toLowerCase().indexOf(sharedContentSearch.toLowerCase()) > -1),
        );

        const hideSharedContentTab = isSharedContentOpened() || this.props.mobileCmsModeActive;

        return (
            <Modal
                {...styles.modal}
                headline="Add Widget"
                handleClose={this.close}
                isOpen={!!addWidgetData && !addWidgetData.addRow}
            >
                <TabGroup cssOverrides={{ tabContent: tabContentCss }}>
                    <Tab key="Standard" tabKey="Standard" headline="Standard Widgets">
                        <ListWrapper ref={this.searchInputWrapper} data-test-selector="addWidgetModal">
                            <TextField
                                value={this.state.widgetSearch}
                                placeholder="Search Widgets"
                                onChange={this.searchChange}
                                cssOverrides={{ formInputWrapper: formInputWrapperCss, formField: formFieldCss }}
                                iconProps={{ src: "Search" }}
                            />
                            <ListScroller>
                                {groups.map(
                                    groupName =>
                                        displayedWidgetsByGroup[groupName] && (
                                            <ListGroup key={groupName}>
                                                <ListHeader>
                                                    {WidgetGroupDisplayNames[groupName] ?? groupName} elements
                                                </ListHeader>
                                                <ListItems>
                                                    {displayedWidgetsByGroup[groupName].map(widgetDefinition => (
                                                        <ListItemStyle
                                                            key={widgetDefinition.type}
                                                            onClick={() => this.addWidget(widgetDefinition)}
                                                            data-test-selector={`addWidgetModal_${widgetDefinition.displayName}`}
                                                        >
                                                            {widgetDefinition.icon === "ax-link-list" ? (
                                                                <AxLinkList />
                                                            ) : (
                                                                <AxiomIcon
                                                                    src={provideFallback(widgetDefinition.icon)}
                                                                    size={20}
                                                                />
                                                            )}
                                                            {widgetDefinition.displayName}
                                                        </ListItemStyle>
                                                    ))}
                                                </ListItems>
                                            </ListGroup>
                                        ),
                                )}
                            </ListScroller>
                        </ListWrapper>
                    </Tab>
                    <Tab
                        key="Shared"
                        tabKey="Shared"
                        headline="Shared Content"
                        css={hideSharedContentTab ? hideTabCss : undefined}
                    >
                        <ListWrapper ref={this.sharedContentSearchInputWrapper}>
                            <TextField
                                value={this.state.sharedContentSearch}
                                placeholder="Search by Name or Tags"
                                onChange={this.sharedContentSearchChange}
                                cssOverrides={{ formInputWrapper: formInputWrapperCss, formField: formFieldCss }}
                                iconProps={{ src: "Search" }}
                            />
                            <ListScroller>
                                {filteredSharedContents && filteredSharedContents.length > 0 && (
                                    <ListGroup>
                                        <ListItems>
                                            {filteredSharedContents.map(sc => (
                                                <ListItemStyle key={sc.key} onClick={() => this.addSharedContent(sc)}>
                                                    <AxiomIcon src="pen-ruler" size={14} />
                                                    {sc.displayName}
                                                </ListItemStyle>
                                            ))}
                                        </ListItems>
                                    </ListGroup>
                                )}
                            </ListScroller>
                        </ListWrapper>
                    </Tab>
                </TabGroup>
            </Modal>
        );
    }
}

function provideFallback(src?: string): any {
    if (!src || src.match(/[A-Z]/)) {
        return "puzzle-piece";
    }
    return src;
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWidgetModal);

const formInputWrapperCss = css`
    width: 300px;
`;

const formFieldCss = css`
    margin-top: 0;
`;

const ListWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    height: 70vh;
`;

const ListScroller = styled.div`
    height: calc(70vh - 85px);
    overflow-y: auto;
    padding-right: 5px;
    margin-bottom: 0;
    width: 100%;
`;

const ListGroup = styled.div`
    border-radius: 4px;
    border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.text.main};
    margin-bottom: 20px;
    background-color: white;
`;

const ListHeader = styled.h3`
    && {
        background-color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
        width: 100%;
        font-size: 14px;
        color: white;
        text-transform: uppercase;
        padding: 4px 8px;
    }
`;

const ListItems = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 4px;
`;

const ListItemStyle = styled.div`
    flex-basis: 8.75%;
    border-radius: 4px;
    font-size: 13px;
    margin: 5px;
    display: flex;
    text-align: center;
    padding: 2px 5px;
    cursor: pointer;
    overflow: visible;
    min-height: 36px;
    flex-direction: column;
`;

const tabContentCss = css`
    padding: 20px 0 0 0;
    border: none;
`;

const hideTabCss = css`
    display: none;
`;
