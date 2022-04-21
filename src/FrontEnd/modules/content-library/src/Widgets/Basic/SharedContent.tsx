/* eslint-disable spire/export-styles */
import { HasShellContext, ShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { loadSharedContent } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const enum fields {
    pageId = "pageId",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.pageId]: string;
    };
}

const mapStateToProps = (state: ApplicationState, { fields: { pageId } }: OwnProps) => ({
    sharedContentState: getById(state.data.pages, pageId),
    isLoading: state.data.pages.isLoading[pageId],
    isDeleted: state.data.pages.deletedSharedContents.indexOf(pageId) > -1,
});

const mapDispatchToProps = {
    loadSharedContent,
};

type Props = OwnProps & HasShellContext & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class SharedContent extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const {
            fields: { pageId },
            sharedContentState,
            isLoading,
            isDeleted,
            loadSharedContent,
        } = this.props;
        if (!sharedContentState.value && !isLoading && !isDeleted) {
            loadSharedContent(pageId);
        }
    }

    render() {
        const {
            fields: { pageId },
            shellContext,
        } = this.props;

        return (
            <ShellContext.Provider value={{ ...shellContext, pageId, isReadOnly: true }}>
                <Zone contentId={pageId} zoneName="Content" pageId={pageId} />
            </ShellContext.Provider>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withIsInShell(SharedContent)),
    definition: {
        group: "Basic",
        fieldDefinitions: [
            {
                name: fields.pageId,
                displayName: "Page Id",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "General",
                isVisible: () => false,
            },
        ],
        canAdd: () => false,
    },
};

export default widgetModule;
