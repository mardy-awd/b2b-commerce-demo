/* eslint-disable spire/export-styles */
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";

interface OwnProps {
    title: string;
    locationId: string;
    id: string;
}

type Props = OwnProps;

const VmiBinDetailTypeLink = ({ title, locationId, id }: Props) => {
    return createWidgetElement("Basic/PageTypeLink", {
        fields: {
            pageType: "VmiBinDetailsPage",
            overrideTitle: title,
            queryString: `locationId=${locationId}&id=${id}`,
        },
    });
};

export default VmiBinDetailTypeLink;
