import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import Scrim from "@insite/mobius/Overlay/Scrim";
import TextField from "@insite/mobius/TextField";
import { useShellDispatch, useShellSelector } from "@insite/shell/Common/Hooks/reduxHooks";
import TagsField from "@insite/shell/Components/EditorTemplates/TagsField";
import SideBarForm from "@insite/shell/Components/Shell/SideBarForm";
import { SavePageResponseModel } from "@insite/shell/Services/ContentAdminService";
import {
    addContent,
    cancelAddContent,
    cancelCopyContent,
    cancelEditContent,
    saveContent,
} from "@insite/shell/Store/SharedContent/SharedContentActionCreator";
import React, { useEffect, useState } from "react";

const SharedContentEditForm = () => {
    const pages = useShellSelector(state => state.data.pages);
    const sharedContents = useShellSelector(state => state.pageTree.sharedContentTreeNodesByParentId[emptyGuid]);
    const showEditForm = useShellSelector(state => state.sharedContent.showEditForm);
    const copyContentId = useShellSelector(state => state.sharedContent.copyContentId);
    const editContentId = useShellSelector(state => state.sharedContent.editContentId);
    const dispatch = useShellDispatch();

    const [sharedContentName, setSharedContentName] = useState("");
    const [sharedContentNameError, setSharedContentNameError] = useState("");
    const [sharedContentTags, setSharedContentTags] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (copyContentId) {
            setSharedContentName(`${sharedContents.find(o => o.pageId === copyContentId)?.displayName} Copy`);
        }
    }, [copyContentId]);

    useEffect(() => {
        if (editContentId) {
            setSharedContentName(pages.byId[editContentId].name);
            setSharedContentTags(pages.byId[editContentId].generalFields["tags"] || []);
        }
    }, [editContentId]);

    const saveHandler = () => {
        let nameError = "";
        if (!sharedContentName || !sharedContentName.trim()) {
            nameError = "Name is required";
        } else if (sharedContentName.length > 100) {
            nameError = "Name is too long, limit is 100 characters";
        }

        if (nameError) {
            setSharedContentNameError(nameError);
            return;
        }

        setSaving(true);

        const afterSave = ({ duplicatesFound }: SavePageResponseModel) => {
            if (duplicatesFound) {
                setSaving(false);
                setSharedContentNameError("Please use other name");
                return;
            }

            setSaving(false);
            setSharedContentName("");
            setSharedContentNameError("");
            setSharedContentTags([]);
        };

        dispatch(
            editContentId
                ? saveContent({ contentId: editContentId, name: sharedContentName, tags: sharedContentTags, afterSave })
                : addContent({ copyContentId, name: sharedContentName, tags: sharedContentTags, afterSave }),
        );
    };

    const cancelHandler = () => {
        dispatch(copyContentId ? cancelCopyContent() : editContentId ? cancelEditContent() : cancelAddContent());
        setSaving(false);
        setSharedContentName("");
        setSharedContentNameError("");
        setSharedContentTags([]);
    };

    const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setSharedContentName(event.currentTarget.value);
        setSharedContentNameError("");
    };

    const updateTagsHandler = (_: string, value: string[]) => {
        setSharedContentTags(value);
    };

    if (!showEditForm) {
        return null;
    }

    return (
        <>
            <Scrim zIndexLevel="modal" />
            <SideBarForm
                title={`${copyContentId ? "Copy" : editContentId ? "Edit" : "Add"} Shared Content`}
                name="addSharedContent"
                cancel={cancelHandler}
                save={saveHandler}
                disableSave={saving}
            >
                <TextField
                    label="Name"
                    name="name"
                    value={sharedContentName}
                    onChange={nameChangeHandler}
                    error={sharedContentNameError}
                />
                {!copyContentId && (
                    <TagsField
                        fieldDefinition={{
                            name: "tags",
                            displayName: "Tags",
                            defaultValue: "",
                            fieldType: "General",
                            editorTemplate: "TextField",
                        }}
                        fieldValue={sharedContentTags}
                        item={{} as any}
                        updateField={updateTagsHandler}
                    />
                )}
            </SideBarForm>
        </>
    );
};

export default SharedContentEditForm;
