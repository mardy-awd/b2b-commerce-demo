import { useEffect, useState } from "react";

const enterKey = 13;

const useAccessibleSubmit = (value: string, onSubmit: (value: string) => void, cartLoadedTime?: number) => {
    const [stateValue, setValue] = useState(value);
    const changeHandler = (event: any) => {
        setValue(event.currentTarget.value);
    };

    const [isOnSubmitCalled, setIsOnSubmitCalled] = useState(false);
    const callOnSubmitSafety = (value: string) => {
        if (!isOnSubmitCalled) {
            setIsOnSubmitCalled(true);
            onSubmit(value);
        }
    };

    const keyDownHandler = (event: any) => {
        if (event.keyCode === enterKey) {
            event.stopPropagation();
            callOnSubmitSafety(stateValue);
        }
    };

    const blurHandler = () => {
        if (value !== String(stateValue)) {
            callOnSubmitSafety(stateValue);
        }
    };

    useEffect(() => {
        setValue(value);
        setIsOnSubmitCalled(false);
    }, [value, cartLoadedTime]);

    return {
        value: stateValue,
        changeHandler,
        keyDownHandler,
        blurHandler,
    };
};

export default useAccessibleSubmit;
