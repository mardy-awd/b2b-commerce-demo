import { addTask } from "@insite/client-framework/ServerSideRendering";
import { getPageByUrl } from "@insite/client-framework/Services/ContentService";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import PageProps, { PageModel } from "@insite/client-framework/Types/PageProps";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import {
    addPage,
    deletePage,
    savePage as savePageApi,
    SavePageResponseModel,
} from "@insite/shell/Services/ContentAdminService";
import { setupPageModel } from "@insite/shell/Services/PageCreation";
import { getTemplate } from "@insite/shell/Services/SpireService";
import { loadPageIfNeeded, replaceItem } from "@insite/shell/Store/Data/Pages/PagesActionCreators";
import { savePage } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { loadTreeNodes } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { loadPublishInfo } from "@insite/shell/Store/PublishModal/PublishModalActionCreators";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { History } from "history";

export const updateSearchQuery = (searchQuery: string): AnyShellAction => ({
    type: "SharedContent/UpdateSearchQuery",
    searchQuery,
});

export const openAddContent = (): AnyShellAction => ({
    type: "SharedContent/OpenAddContent",
});

export const cancelAddContent = (): AnyShellAction => ({
    type: "SharedContent/CancelAddContent",
});

export const openCopyContent = (copyContentId: string): AnyShellAction => ({
    type: "SharedContent/OpenCopyContent",
    copyContentId,
});

export const cancelCopyContent = (): AnyShellAction => ({
    type: "SharedContent/CancelCopyContent",
});

export const openEditContent =
    (editContentId: string): ShellThunkAction =>
    dispatch => {
        (() => {
            dispatch(
                loadPageIfNeeded(editContentId, () => {
                    dispatch({
                        type: "SharedContent/OpenEditContent",
                        editContentId,
                    });
                }),
            );
        })();
    };

export const cancelEditContent = (): AnyShellAction => ({
    type: "SharedContent/CancelEditContent",
});

export interface AddContentParameter {
    name: string;
    tags?: string[];
    copyContentId?: string;
    afterSave?: (response: SavePageResponseModel) => void;
}

export const addContent =
    (parameter: AddContentParameter): ShellThunkAction =>
    (dispatch, getState) => {
        (async () => {
            let pageModel: PageModel;

            if (parameter.copyContentId) {
                const url = `/Content/Page/${parameter.copyContentId}`;
                const { page } = await getPageByUrl(url, true);
                if (!page) {
                    throw new Error(`Getting the page by the URL '${url}' unexpectedly did not return a page.`);
                }
                pageModel = page;
            } else {
                pageModel = await getTemplate("SharedContent");
            }

            const { currentLanguageId, currentPersonaId, languagesById, defaultPersonaId } = getState().shellContext;

            setupPageModel(
                pageModel,
                parameter.name,
                `SharedContentUrl-${parameter.name}`,
                "",
                -1,
                languagesById[currentLanguageId]!,
                currentPersonaId,
                defaultPersonaId,
                null,
                false,
                false,
            );

            if (parameter.tags && parameter.tags.length > 0) {
                pageModel.generalFields["tags"] = parameter.tags;
            }

            const savePageResponse = await addPage(pageModel, false);
            if (!savePageResponse.duplicatesFound) {
                dispatch(
                    loadPageIfNeeded(pageModel.id, () => {
                        dispatch(setContentMode("Editing"));
                        dispatch(
                            savePage(false, () => {
                                dispatch(loadTreeNodes());
                                dispatch({
                                    type: parameter.copyContentId
                                        ? "SharedContent/CancelCopyContent"
                                        : "SharedContent/CancelAddContent",
                                });
                            }),
                        );
                    }),
                );
            }

            parameter.afterSave?.(savePageResponse);
        })();
    };

export interface SaveContentParameter {
    contentId: string;
    name: string;
    tags?: string[];
    afterSave?: (response: SavePageResponseModel) => void;
}

export const saveContent =
    (parameter: SaveContentParameter): ShellThunkAction =>
    (dispatch, getState) => {
        (async () => {
            const url = `/Content/Page/${parameter.contentId}`;
            const { page: pageModel } = await getPageByUrl(url, true);
            if (!pageModel) {
                throw new Error(`Getting the page by the URL '${url}' unexpectedly did not return a page.`);
            }

            pageModel.name = parameter.name;
            pageModel.generalFields["tags"] = parameter.tags;

            const savePageResponse = await savePageApi(pageModel, false);
            if (!savePageResponse.duplicatesFound) {
                const updatedPage: PageProps = {
                    ...getState().data.pages.byId[parameter.contentId],
                    name: parameter.name,
                    generalFields: pageModel.generalFields,
                };
                dispatch(replaceItem(updatedPage));
                dispatch(loadPublishInfo(parameter.contentId));
                dispatch(loadTreeNodes());
                dispatch({ type: "SharedContent/CancelEditContent" });
            }

            parameter.afterSave?.(savePageResponse);
        })();
    };

export const deleteContent =
    (nodeId: string, history: History, pageId?: string): ShellThunkAction =>
    (dispatch, getState) => {
        addTask(
            (async function () {
                await deletePage(nodeId);

                dispatch(loadTreeNodes());

                if (nodeId === getCurrentPage(getState()).nodeId) {
                    history.push(`/ContentAdmin/SharedContent`);
                }
            })(),
        );
    };

export const setFromPageId = (fromPageId: string): AnyShellAction => ({
    type: "SharedContent/SetFromPageId",
    fromPageId,
});

export const clearFromPageId = (): AnyShellAction => ({
    type: "SharedContent/SetFromPageId",
    fromPageId: undefined,
});
