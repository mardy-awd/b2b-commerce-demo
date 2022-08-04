import * as React from "react";

// this came from https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
// it could probably be improved, or we could make it a HOC
// or we could use https://github.com/Pomax/react-onclickoutside
export default abstract class ClickOutside<T1, T2> extends React.Component<T1, T2> {
    wrapperRef?: Element | null;

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef = (node: Element | null) => {
        this.wrapperRef = node;
    };

    private handleClickOutside = (event: MouseEvent) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target as Node)) {
            this.onClickOutside(event.target as Node);
        }
    };

    abstract onClickOutside(target: Node): void;
}

export class ClickOutsideWrapper extends React.Component<{ handleClick: () => void }> {
    wrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside(event: any) {
        if (!this.wrapperRef?.current?.contains(event.target)) {
            this.props.handleClick();
        }
    }

    render() {
        return <div ref={this.wrapperRef}>{this.props.children}</div>;
    }
}
