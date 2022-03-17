import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import AxiomIcon from "@insite/shell/Components/Icons/AxiomIcon";
import { pageTreeFlyOutMenuHasItems } from "@insite/shell/Components/PageTree/PageTreeFlyOut";
import PageTreePages from "@insite/shell/Components/PageTree/PageTreePages";
import { loadPageOnSite } from "@insite/shell/Store/Data/Pages/PagesHelpers";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import * as React from "react";
import styled, { css } from "styled-components";

interface Props {
    isEditMode: boolean;
    node: TreeNodeModel;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
    expandedNodes: Dictionary<boolean>;
    onFlyOutNode: (pageElement: HTMLElement, page: TreeNodeModel) => void;
    onExpandNode: (node: TreeNodeModel) => void;
    flyOutNode?: TreeNodeModel;
    selectedPageId: string;
    permissions?: PermissionsModel;
    neverPublishedNodeIds: Dictionary<boolean>;
    futurePublishNodeIds: Dictionary<Date>;
    draftNodeIds: Dictionary<boolean>;
}

class PageTreeItem extends React.Component<Props> {
    handleFlyOutClick = (event: React.MouseEvent<HTMLElement>) => {
        this.props.onFlyOutNode(event.currentTarget.parentElement as HTMLElement, this.props.node);
    };

    handleExpandClick = (event: React.MouseEvent<HTMLElement>) => {
        this.props.onExpandNode(this.props.node);
    };

    navigateToPage = (pageId: string) => {
        loadPageOnSite(pageId);
    };

    render() {
        const {
            expandedNodes,
            onExpandNode,
            onFlyOutNode,
            node,
            nodesByParentId,
            flyOutNode,
            isEditMode,
            selectedPageId,
            permissions,
            neverPublishedNodeIds,
            futurePublishNodeIds,
            draftNodeIds,
        } = this.props;

        const isExpanded = expandedNodes[node.key] && !node.isVariant;
        const expandIcon = isExpanded ? "none" : "right";

        let flyOutMenu: null | JSX.Element = null;
        if (node === flyOutNode) {
            flyOutMenu = (
                <PageTreeFlyOutActive isActivePage={selectedPageId === node.pageId} onClick={this.handleFlyOutClick}>
                    <AxiomIcon src="ellipsis" size={24} color="#00000087" />
                </PageTreeFlyOutActive>
            );
        } else if (isEditMode) {
            flyOutMenu = (
                <PageTreeFlyout
                    isActivePage={selectedPageId === node.pageId}
                    onClick={this.handleFlyOutClick}
                    title="More Options"
                    data-test-selector={`pageTreeFlyOut_${node.displayName}`}
                >
                    <AxiomIcon src="ellipsis" size={24} color="#00000087" />
                </PageTreeFlyout>
            );
        }

        const children = nodesByParentId[node.nodeId];
        return (
            <PageTreePage data-haschildren={!!children && !node.isVariant}>
                <PageTreeTitle
                    {...node}
                    isActivePage={selectedPageId === node.pageId}
                    isFuturePublish={
                        futurePublishNodeIds[node.isVariant ? `${node.nodeId}_${node.pageId}` : node.nodeId] >
                        new Date()
                    }
                    isWaitingForApproval={node.isWaitingForApproval}
                    isDraftPage={draftNodeIds[node.isVariant ? `${node.nodeId}_${node.pageId}` : node.nodeId]}
                    neverPublished={
                        neverPublishedNodeIds[node.isVariant ? `${node.nodeId}_${node.pageId}` : node.nodeId]
                    }
                    data-test-selector={`pageTreeTitle_${node.displayName}`}
                >
                    <DisplayTopHoverDiv className="hover-div" />
                    {children && !node.isVariant && (
                        <AxiomIcon
                            size={16}
                            src="chevron-down"
                            rotation={expandIcon}
                            onClick={this.handleExpandClick}
                            data-test-selector={`pageTreeExpand_${node.displayName}`}
                            css={css`
                                top: 1px;
                                left: -18px;
                                position: absolute;
                                cursor: pointer;
                                &:hover {
                                    i {
                                        color: #777;
                                    }
                                }
                            `}
                        />
                    )}
                    <NodeIcon>
                        <AxiomIcon
                            src="file"
                            size={16}
                            color={node.isVariant ? (node.isDefaultVariant ? "#4A90E2" : "#FFA500") : "#000"}
                        />
                    </NodeIcon>
                    <a
                        onClick={() => this.navigateToPage(node.pageId)}
                        data-test-selector={`pageTreeLink_${node.displayName}`}
                    >
                        {node.displayName} {node.isVariant && node.variantName ? ` - ${node.variantName}` : ""}
                    </a>
                    {pageTreeFlyOutMenuHasItems(futurePublishNodeIds, node, permissions) && flyOutMenu}
                    <DisplayBottomHoverDiv className="hover-div" />
                </PageTreeTitle>
                {isExpanded && (
                    <PageTreePages
                        isEditMode={isEditMode}
                        selectedPageId={selectedPageId}
                        parentId={node.nodeId}
                        nodesByParentId={nodesByParentId}
                        expandedNodes={expandedNodes}
                        onExpandNode={onExpandNode}
                        onFlyOutNode={onFlyOutNode}
                        flyOutNode={flyOutNode}
                        permissions={permissions}
                        neverPublishedNodeIds={neverPublishedNodeIds}
                        futurePublishNodeIds={futurePublishNodeIds}
                        draftNodeIds={draftNodeIds}
                    />
                )}
            </PageTreePage>
        );
    }
}

export default PageTreeItem;

const NodeIcon = styled.span`
    top: 0;
    left: 3px;
    position: absolute;
    width: 12px;
    text-align: center;
`;

const DisplayTopHoverDiv = styled.div`
    position: absolute;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100%;
    background: transparent;
`;
const DisplayBottomHoverDiv = styled.div`
    position: absolute;
    top: 0;
    right: -200px;
    width: 200px;
    height: 100%;
    background: transparent;
`;

const PageTreeFlyout = styled.button<{ isActivePage: boolean }>`
    ${props => (!props.isActivePage ? "display: none;" : "")}
    cursor: pointer;
    position: absolute;
    width: 30px;
    text-align: center;
    right: 0;
    top: 9px;
    background-color: transparent;
    border: none;
    padding: 0;
`;

const PageTreeFlyOutActive = styled(PageTreeFlyout)`
    display: block;
`;

const PageTreeTitle = styled.h3<{
    isMatchingPage: boolean;
    isActivePage: boolean;
    isFuturePublish: boolean;
    isWaitingForApproval: boolean;
    isDraftPage: boolean;
    neverPublished: boolean;
}>`
    ${props => (!props.isMatchingPage ? `color: ${props.theme.colors.custom.nonmatchingTreeLinks};` : "")}
    ${props =>
        props.isActivePage
            ? `
                  background-color: ${props.theme.colors.custom.activeBackground};
                  color: ${props.theme.colors.primary.main};
                  &::before {
                      content: "";
                      background-color: ${props.theme.colors.custom.activeBackground};
                      position: absolute;
                      height: 100%;
                      width: 22px;
                      left: -22px;
                  }

                .hover-div {
                    background-color: ${props.theme.colors.custom.activeBackground};
                }
                ${AxiomIcon} {
                      svg {
                        color: ${props.theme.colors.primary.main};
                      }
                  }
              `
            : ""}
    ${props =>
        props.isFuturePublish || props.isDraftPage
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
                  color: ${props.isActivePage
                      ? props.theme.colors.custom.isWaitingForApprovalActive
                      : props.theme.colors.custom.isWaitingForApproval};
              `
            : ""}
    padding-left: 25px;
    position: relative;
    margin: 0;
    &:hover ${PageTreeFlyout} {
        display: block;
        background: ${props => props.theme.colors.custom.activeBackground};
    }
    && {
        font-size: 0.9rem;
        font-weight: normal;
    }
    &:hover {
        background-color: ${props => props.theme.colors.custom.activeBackground};

        .hover-div {
            background-color: ${props => props.theme.colors.custom.activeBackground};
        }
    }
`;

const PageTreePage = styled.li`
    ul {
        padding-left: 2px;
        h3,
        ul {
            margin-left: 15px;
        }
        li {
            position: relative;
        }
        li::before {
            content: "";
            width: 2px;
            height: 100%;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 0;
            left: -16px;
            z-index: 100;
        }
        li:last-child::before {
            height: 20px;
        }
        li::after {
            content: "";
            width: 26px;
            height: 2px;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 20px;
            left: -16px;
        }
    }

    &[data-haschildren="true"]::after {
        width: 12px;
    }
`;
