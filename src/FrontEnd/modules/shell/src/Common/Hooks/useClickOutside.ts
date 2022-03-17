import { useEffect } from "react";

const useClickOutside = (wrapperRef: Element | null, onClickOutside: (target: Node) => void) => {
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef && !wrapperRef.contains(event.target as Node)) {
            onClickOutside(event.target as Node);
        }
    };
};

export default useClickOutside;
