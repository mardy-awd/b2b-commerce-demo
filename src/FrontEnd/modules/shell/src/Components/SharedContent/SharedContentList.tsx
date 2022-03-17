import usePrevious from "@insite/client-framework/Common/Hooks/usePrevious";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { useShellDispatch, useShellSelector } from "@insite/shell/Common/Hooks/reduxHooks";
import useClickOutside from "@insite/shell/Common/Hooks/useClickOutside";
import AxiomIcon from "@insite/shell/Components/Icons/AxiomIcon";
import SharedContentMenu, { sharedContentMenuHasItems } from "@insite/shell/Components/SharedContent/SharedContentMenu";
import shellTheme from "@insite/shell/ShellTheme";
import { loadTreeNodes } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { clearFromPageId } from "@insite/shell/Store/SharedContent/SharedContentActionCreator";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled, { css } from "styled-components";

type Props = RouteComponentProps;

const SharedContentList = ({ history }: Props) => {
    const currentPage = useShellSelector(state => getCurrentPage(state));
    const prevPage = usePrevious(currentPage);
    const isEditMode = useShellSelector(state => state.shellContext.contentMode === "Editing");
    const sharedContents = useShellSelector(state => state.pageTree.sharedContentTreeNodesByParentId[emptyGuid]);
    const currentContentId = useShellSelector(state => getCurrentPage(state).id);
    const searchQuery = useShellSelector(state => state.sharedContent.searchQuery);
    const neverPublishedNodeIds = useShellSelector(state => state.pageTree.neverPublishedNodeIds);
    const futurePublishNodeIds = useShellSelector(state => state.pageTree.futurePublishNodeIds);
    const draftNodeIds = useShellSelector(state => state.pageTree.draftNodeIds);
    const permissions = useShellSelector(state => state.shellContext.permissions);
    const dispatch = useShellDispatch();

    const [currentItemKey, setCurrentItemKey] = useState<string | undefined>(undefined);
    const [menuNode, setMenuNode] = useState<TreeNodeModel | undefined>(undefined);
    const [menuElement, setMenuElement] = useState<HTMLElement | undefined>(undefined);
    const [firstRender, setFirstRender] = useState(true);
    const wrapperRef = useRef(null);

    useEffect(() => {
        dispatch(loadTreeNodes());
        setFirstRender(false);

        return () => {
            dispatch(clearFromPageId());
        };
    }, []);

    useEffect(() => {
        if (!firstRender && (currentPage.type !== "SharedContent" || prevPage?.type === "SharedContent")) {
            dispatch(clearFromPageId());
        }
    }, [currentPage]);

    const itemMouseEnterHandler = (key: string) => {
        setCurrentItemKey(key);
    };

    const itemMouseLeaveHandler = () => {
        setCurrentItemKey(undefined);
    };

    const nameClickHandler = (pageId: string) => {
        history.push(`/ContentAdmin/SharedContent/${pageId}`);
    };

    const menuIconClickHandler = (event: React.MouseEvent<HTMLElement>, node: TreeNodeModel) => {
        setMenuNode(node);
        setMenuElement(event.currentTarget.parentElement as HTMLElement);
    };

    const closeMenu = () => {
        if (menuNode || menuElement) {
            setMenuNode(undefined);
            setMenuElement(undefined);
        }
    };

    useClickOutside(wrapperRef.current, () => {
        closeMenu();
    });

    const filteredContents = sharedContents?.filter(
        o =>
            o.displayName.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
            o.tags.some(p => p.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1),
    );

    return (
        <ListWrapper ref={wrapperRef}>
            {filteredContents?.map(sc => (
                <ItemWrapper
                    key={sc.key}
                    isCurrent={sc.key === currentContentId}
                    onMouseEnter={() => itemMouseEnterHandler(sc.key)}
                    onMouseLeave={() => itemMouseLeaveHandler()}
                >
                    <AxiomIcon src="pen-ruler" color={shellTheme.colors.text.main} size={14} css={penIcon} />
                    <ItemTitle
                        isCurrent={sc.key === currentContentId}
                        isFuturePublish={futurePublishNodeIds[sc.nodeId] > new Date()}
                        isWaitingForApproval={sc.isWaitingForApproval}
                        isDraft={draftNodeIds[sc.nodeId]}
                        neverPublished={neverPublishedNodeIds[sc.nodeId]}
                        onClick={() => nameClickHandler(sc.pageId)}
                    >
                        {sc.displayName}
                    </ItemTitle>
                    {sharedContentMenuHasItems(sc, futurePublishNodeIds, permissions) && (
                        <AxiomIcon
                            src="ellipsis"
                            color={shellTheme.colors.text.main}
                            size={24}
                            css={
                                isEditMode && (currentItemKey === sc.key || currentContentId === sc.key)
                                    ? menuIcon
                                    : hiddenMenuIcon
                            }
                            onClick={event => menuIconClickHandler(event, sc)}
                        />
                    )}
                </ItemWrapper>
            ))}
            {menuNode && menuElement && (
                <SharedContentMenu menuNode={menuNode} menuElement={menuElement} closeMenu={closeMenu} />
            )}
        </ListWrapper>
    );
};

export default withRouter(SharedContentList);

const ListWrapper = styled.div`
    position: relative;
    margin-top: 10px;
`;

const ItemWrapper = styled.div<{ isCurrent: boolean }>`
    align-items: center;
    padding: 5px 35px;
    position: relative;
    ${props => (props.isCurrent ? `background-color: ${props.theme.colors.custom.activeBackground};` : "")}
    &:hover {
        background-color: ${props => props.theme.colors.custom.activeBackground};
    }
`;

const penIcon = css`
    margin: 0 10px 0 0;
`;

const ItemTitle = styled.span<{
    isCurrent: boolean;
    isFuturePublish: boolean;
    isWaitingForApproval: boolean;
    isDraft: boolean;
    neverPublished: boolean;
}>`
    font-size: 15px;
    cursor: pointer;
    ${props =>
        props.isFuturePublish || props.isDraft
            ? css`
                  color: ${props.isFuturePublish
                      ? props.theme.colors.custom.futurePublish
                      : props.neverPublished
                      ? props.theme.colors.custom.neverPublished
                      : props.theme.colors.custom.draftPage};
              `
            : ""}
    ${props =>
        props.isWaitingForApproval
            ? css`
                  color: ${props.isCurrent
                      ? props.theme.colors.custom.isWaitingForApprovalActive
                      : props.theme.colors.custom.isWaitingForApproval};
              `
            : ""}
`;

const hiddenMenuIcon = css`
    display: none;
`;

const menuIcon = css`
    position: absolute;
    right: 35px;
    top: 7px;
    cursor: pointer;
`;
