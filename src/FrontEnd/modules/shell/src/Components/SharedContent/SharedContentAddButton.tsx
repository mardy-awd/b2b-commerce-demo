import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import Button from "@insite/mobius/Button";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem from "@insite/mobius/GridItem";
import Typography from "@insite/mobius/Typography";
import { useShellDispatch, useShellSelector } from "@insite/shell/Common/Hooks/reduxHooks";
import { openAddContent } from "@insite/shell/Store/SharedContent/SharedContentActionCreator";
import React from "react";
import styled, { css } from "styled-components";

const SharedContentAddButton = () => {
    const showHint = useShellSelector(
        state =>
            !state.pageTree.sharedContentTreeNodesByParentId[emptyGuid] ||
            state.pageTree.sharedContentTreeNodesByParentId[emptyGuid].length === 0,
    );
    const dispatch = useShellDispatch();

    const addContentClickHandler = () => {
        dispatch(openAddContent());
    };

    return (
        <AddButtonWrapper>
            <GridContainer gap={0}>
                <GridItem width={6} align="middle">
                    <Typography weight={500}>Shared Content</Typography>
                </GridItem>
                <GridItem width={6} css={addButtonGridItem}>
                    <Button variant="primary" onClick={addContentClickHandler}>
                        <Typography size={13}>Add Content</Typography>
                    </Button>
                </GridItem>
                {showHint && (
                    <>
                        <GridItem width={12}>
                            <Typography size={14} css={hint}>
                                Shared content can be used across multiple websites.
                            </Typography>
                        </GridItem>
                        <GridItem width={12}>
                            <Typography size={14} css={hint}>
                                Click 'Add Content' to create a new shared content widget.
                            </Typography>
                        </GridItem>
                    </>
                )}
            </GridContainer>
        </AddButtonWrapper>
    );
};

export default SharedContentAddButton;

const AddButtonWrapper = styled.div`
    position: relative;
    padding: 0 35px;
`;

const addButtonGridItem = css`
    justify-content: flex-end;
`;

const hint = css`
    margin-top: 10px;
`;
