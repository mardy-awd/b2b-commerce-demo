import { useShellDispatch, useShellSelector } from "@insite/shell/Common/Hooks/reduxHooks";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { updateSearchQuery } from "@insite/shell/Store/SharedContent/SharedContentActionCreator";
import React from "react";
import styled from "styled-components";

const SharedContentSearch = () => {
    const searchQuery = useShellSelector(state => state.sharedContent.searchQuery);
    const dispatch = useShellDispatch();

    const searchQueryChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!searchQuery && !event.target.value.trim()) {
            return;
        }

        dispatch(updateSearchQuery(event.target.value));
    };

    return (
        <SearchInputWrapper>
            <SearchInput
                value={searchQuery}
                onChange={searchQueryChangeHandler}
                placeholder="Search by Name or Tags"
                data-test-selector="sharedContent_search"
            />
        </SearchInputWrapper>
    );
};

export default SharedContentSearch;

const SearchInputWrapper = styled.div`
    position: relative;
    margin: 20px 0;
    padding: 0 35px;
`;

const SearchInput = styled.input`
    font-size: 14px;
    padding: 4px 16px;
    height: 30px;
    border-radius: 4px;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.background};
    border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.common.border};
    width: 100%;
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: #9b9b9b;
    }
`;
