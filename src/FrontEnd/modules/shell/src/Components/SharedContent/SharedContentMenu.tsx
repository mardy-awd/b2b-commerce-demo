import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import Link from "@insite/mobius/Link";
import Typography from "@insite/mobius/Typography";
import { useShellDispatch, useShellSelector } from "@insite/shell/Common/Hooks/reduxHooks";
import { HasConfirmationContext, withConfirmation } from "@insite/shell/Components/Modals/ConfirmationContext";
import { getSharedContentWebsites } from "@insite/shell/Services/ContentAdminService";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import {
    deleteContent,
    openCopyContent,
    openEditContent,
} from "@insite/shell/Store/SharedContent/SharedContentActionCreator";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";

interface OwnProps {
    menuNode: TreeNodeModel;
    menuElement: HTMLElement;
    closeMenu: () => void;
}

type Props = OwnProps & RouteComponentProps & HasConfirmationContext;

const SharedContentMenu = ({ menuNode, menuElement, closeMenu, history, confirmation }: Props) => {
    const permissions = useShellSelector(state => state.shellContext.permissions);
    const futurePublishNodeIds = useShellSelector(state => state.pageTree.futurePublishNodeIds);
    const dispatch = useShellDispatch();

    const handleDelete = async () => {
        closeMenu();

        const name = menuNode.displayName;
        const websites = await getSharedContentWebsites(menuNode.pageId);
        const message = (
            <>
                <Typography>{`${name} will be deleted from the following websites:`}</Typography>
                {websites.map(o => (
                    <div key={o.name}>
                        <Link href={`${window.location.protocol}//${o.domainName}`} target="_blank">
                            {o.name}
                        </Link>
                    </div>
                ))}
            </>
        );
        confirmation.display({
            message,
            title: `Delete ${name}`,
            onConfirm: () => {
                dispatch(deleteContent(menuNode.nodeId, history));
            },
        });
    };

    const handleCopy = () => {
        closeMenu();
        dispatch(openCopyContent(menuNode.pageId));
    };

    const handleEdit = () => {
        closeMenu();
        dispatch(openEditContent(menuNode.pageId));
    };

    const getMenuStyle = () => {
        const { right: left, top } = menuElement.getBoundingClientRect();

        return top + 200 > window.innerHeight ? { left, bottom: window.innerHeight - top - 40 } : { left, top };
    };

    const menuItem = (onClick: () => void, title: string) => (
        <MenuItem onClick={onClick} data-test-selector={`sharedContentMenuItem_${title}`}>
            {title}
        </MenuItem>
    );

    if (!permissions) {
        return null;
    }

    const notFuturePublish = (futurePublishNodeIds[menuNode.nodeId] || null) <= new Date();
    const canEdit = permissions.canEditWidget && notFuturePublish;
    const canCopy = permissions.canCopyPage;
    const canDelete = permissions.canDeletePage && notFuturePublish;
    return (
        <Menu style={getMenuStyle()}>
            {canEdit && menuItem(handleEdit, "Edit")}
            {canCopy && menuItem(handleCopy, "Copy")}
            {canDelete && menuItem(handleDelete, "Delete")}
        </Menu>
    );
};

export const sharedContentMenuHasItems = (
    menuNode: TreeNodeModel,
    futurePublishNodeIds: Dictionary<Date>,
    permissions?: PermissionsModel,
) => {
    if (!permissions) {
        return false;
    }

    const notFuturePublish = (futurePublishNodeIds[menuNode.nodeId] || null) <= new Date();
    if (permissions.canEditWidget && notFuturePublish) {
        return true;
    }

    if (permissions.canCopyPage) {
        return true;
    }

    if (permissions.canDeletePage && notFuturePublish) {
        return true;
    }

    return false;
};

export default withRouter(withConfirmation(SharedContentMenu));

const Menu = styled.div`
    border-radius: 8px;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.accent};
    box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.2);
    position: fixed;
    display: block;
    z-index: 1000;
`;

const MenuItem = styled.div`
    font-family: ${(props: ShellThemeProps) => props.theme.typography.body.fontFamily};
    color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
    cursor: pointer;
    width: 100px;
    padding: 3px 0 3px 10px;
    font-weight: 300;
    display: flex;
    align-content: center;
    position: relative;
    align-items: center;

    &:hover {
        background-color: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
        color: ${(props: ShellThemeProps) => props.theme.colors.common.background};
    }

    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;
