import * as React from "react";
import styled from "styled-components";
import TypographyStyle from "./TypographyStyle";
import injectCss from "../utilities/injectCss";

export const TypographyEllipsisStyle = styled(TypographyStyle)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${injectCss}
`;

interface TypographyEllipsisProps {
    title?: string;
}

class TypographyEllipsis extends React.Component<TypographyEllipsisProps> {
    element = React.createRef<HTMLSpanElement>();

    componentDidMount() {
        this.setTitleOnEllipsis();
    }

    componentDidUpdate() {
        this.setTitleOnEllipsis();
    }

    setTitleOnEllipsis = () => {
        if (!this.props.title && this.element && this.element.current) {
            const element = this.element.current;
            if (element.offsetWidth < element.scrollWidth) {
                element.setAttribute("title", element.innerText);
            }
        }
    };

    render() {
        return (
            <TypographyEllipsisStyle
                ref={this.element}
                {...this.props}
            />
        );
    }
}

export default TypographyEllipsis;