import { SideBarStyle } from "@insite/shell/Components/Layout";
import SharedContentAddButton from "@insite/shell/Components/SharedContent/SharedContentAddButton";
import SharedContentEditForm from "@insite/shell/Components/SharedContent/SharedContentEditForm";
import SharedContentList from "@insite/shell/Components/SharedContent/SharedContentList";
import SharedContentSearch from "@insite/shell/Components/SharedContent/SharedContentSearch";
import React from "react";

const SharedContentSideBar = () => (
    <SideBarStyle>
        <SharedContentSearch />
        <SharedContentAddButton />
        <SharedContentList />
        <SharedContentEditForm />
    </SideBarStyle>
);

export default SharedContentSideBar;
