import FormField, {
    FormFieldComponentProps,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
} from "@insite/mobius/FormField";
import { sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import { chevronLeftString } from "@insite/mobius/Icons/ChevronLeft";
import { chevronRightString } from "@insite/mobius/Icons/ChevronRight";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import getProp from "@insite/mobius/utilities/getProp";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import safeColor from "@insite/mobius/utilities/safeColor";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import DateTimePicker, { DateTimePickerProps } from "react-datetime-picker/dist/entry.nostyle";
import styled, { css, ThemeProps, withTheme } from "styled-components";

export interface DatePickerPresentationProps
    extends FormFieldPresentationProps<DatePickerComponentProps>,
        Partial<Pick<DateTimePickerProps, "format">> {
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable
     */
    cssOverrides?: {
        datePicker?: StyledProp<DatePickerComponentProps>;
        descriptionWrapper?: StyledProp<DatePickerComponentProps>;
        formField?: StyledProp<DatePickerComponentProps>;
        formInputWrapper?: StyledProp<DatePickerComponentProps>;
        inputSelect?: StyledProp<DatePickerComponentProps>;
    };
    /** Props to be passed into the clearIcon component.
     * @themable */
    clearIconProps?: IconPresentationProps;
    /** Props to be passed into the calendarIcon component.
     * @themable */
    calendarIconProps?: IconPresentationProps;
    /** Object of values describing the placeholders to be used for each time unit.
     * @themable */
    placeholders?: Partial<
        Pick<
            DateTimePickerProps,
            | "dayPlaceholder"
            | "monthPlaceholder"
            | "yearPlaceholder"
            | "hourPlaceholder"
            | "minutePlaceholder"
            | "secondPlaceholder"
        >
    >;
    /** react-datetime-picker props that govern presentational concerns.
     * @themable */
    dateTimePickerProps?: Partial<
        Pick<
            DateTimePickerProps,
            "calendarType" | "showLeadingZeros" | "showFixedNumberOfWeeks" | "showNeighboringMonth"
        >
    >;
    /** Background color of the form element */
    backgroundColor?: string;
}

export interface DateTimePickerLibComponentProps extends DateTimePickerProps {}

interface DatePickerComponentProps
    extends ThemeProps<BaseTheme>,
        Partial<
            Pick<
                FormFieldComponentProps,
                "disabled" | "error" | "hint" | "label" | "labelPosition" | "labelId" | "required"
            >
        > {
    /** Props to be passed into the `react-datetime-picker` input element. */
    dateTimePickerProps?: DateTimePickerProps;
    /**
     * Unique id to be passed into the input element.
     * If not provided, a random id is assigned (an id is required for accessibility purposes).
     */
    uid?: number | string;
    /** Callback function to be called when the selectedDate is changed. Please note that because the input is typeable,
     * this may be called a number of times based on a single date change, so validation is encouraged.  */
    onDayChange?(pickerState: DatePickerState): void;
    /** Adds an asterisk to the input's label (if provided). Additionally, governs whether an error if the date
     * field is empty or a disabled day is selected */
    required?: boolean;
    /** Selected date provided to the input and picker. */
    selectedDay?: Date;
    /** label for screen reader to speak when focus is on the month input field */
    monthAriaLabel?: string;
    /** label for screen reader to speak when focus is on the day input field */
    dayAriaLabel?: string;
    /** label for screen reader to speak when focus is on the year input field */
    yearAriaLabel?: string;
    /** Callback function that will be called when the user is pressing a key (on the keyboard) */
    onKeyDown?(event: React.KeyboardEvent): void;
}

export interface DatePickerState {
    selectedDay?: Date;
    datePickerValue?: Date;
    isEmpty: boolean;
    selectedDayDisabled: boolean;
    mobilePopupDirection?: DatePickerPopupDirection;
    windowWidth?: number;
    calendarCompensationX?: number | null;
}

enum DatePickerPopupDirection {
    Right = "Right",
    Left = "Left",
}

export type DatePickerProps = DatePickerPresentationProps & DatePickerComponentProps;

const DatePickerIcon = styled(Icon)<
    { _sizeVariant: FormFieldSizeVariant; _backgroundColor: string } & ThemeProps<BaseTheme>
>`
    width: ${({ _sizeVariant, size }) => size ?? sizeVariantValues[_sizeVariant].height - 4}px;
    height: ${({ _sizeVariant, size }) => size ?? sizeVariantValues[_sizeVariant].height - 4}px;
    padding: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].iconPadding - 2}px;
    background: ${({ theme, _backgroundColor }) => resolveColor(_backgroundColor, theme)};
    border-radius: 100%;
`;
/* background: ${getColor("common.background")}; */

interface DateTimePickerStyleProps extends ThemeProps<BaseTheme> {
    _sizeVariant: FormFieldSizeVariant;
    css?: StyledProp;
    disabled: boolean;
    mobilePopupDirection?: DatePickerPopupDirection;
    calendarCompensationX?: number | null;
}

const DateTimePickerStyle = styled.div<DateTimePickerStyleProps>`
    button:focus {
        /* outline is added on span for border reasons */
        outline: none;
        span {
            outline-color: ${getProp("theme.focus.color", "#09f")};
            outline-style: ${getProp("theme.focus.style", "solid")};
            outline-width: ${getProp("theme.focus.width", "2px")};
        }
    }
    .react-datetime-picker {
        color: ${({ disabled, theme }) => (disabled ? theme.colors.text.disabled : theme.colors.text.main)};
        display: inline-flex;
        position: relative;
        &,
        & *,
        & *::before,
        & *::after {
            box-sizing: border-box;
        }
        &__wrapper {
            display: flex;
            flex-grow: 1;
            flex-shrink: 0;
        }
        &__inputGroup {
            /* own padding + inputs padding + digits width + dots width */
            min-width: calc(4px + (4px * 3) + 0.54em * 6 + 0.217em * 2);
            flex-grow: 1;
            &__divider {
                padding: 1px 0;
                white-space: pre;
            }
            &__input {
                /* outline removed as the parent 'input' provides the focus indicator. */
                outline: none;
                min-width: 0.54em;
                height: calc(100% - 2px);
                position: relative;
                border: 0;
                background: none;
                font: inherit;
                box-sizing: content-box;
                appearance: textfield;
                padding: 1px 2px;
                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                    appearance: none;
                    margin: 0;
                }
            }
            select {
                appearance: menuList;
            }
            &__amPm {
                font: inherit;
            }
            &__leadingZero {
                margin: -1px -2px 0 0;
            }
        }

        &__button {
            border: 0;
            background: transparent;
            padding: 0;
            &:enabled {
                cursor: pointer;
            }
        }
        &__calendar {
            top: 100% !important;
            z-index: ${getProp("theme.zIndex.datePicker")};
            width: 100%;

            &--closed {
                display: none;
            }
        }
    }
    .react-calendar {
        position: absolute;
        ${({ mobilePopupDirection }) =>
            mobilePopupDirection === DatePickerPopupDirection.Left
                ? css`
                      right: 0;
                      left: unset;
                  `
                : css`
                      left: 0;
                      right: unset;
                  `}
        background: ${getColor("common.background")};
        z-index: ${getProp("theme.zIndex.datePicker")};
        margin-top: 2px;
        box-shadow: ${getProp("theme.shadows.2")};
        top: 100%;
        font-family: inherit;
        padding: 1em;
        flex-direction: row;
        user-select: none;

        &,
        & *,
        & *::before,
        & *::after {
            box-sizing: border-box;
        }

        button {
            background-color: ${getColor("common.background")};
            &:enabled {
                &:hover:not(:disabled),
                &:focus:not(:disabled) {
                    color: ${getColor("text.main")};
                    background-color: ${props => safeColor(props.theme.colors.primary.main).rgb().alpha(0.25).string()};
                    cursor: pointer;
                }
            }
        }

        &__navigation {
            display: flex;
            margin-bottom: 4px;

            button {
                min-width: 44px;
                border: none;
                cursor: pointer;
            }
            &__arrow {
                background-position: center center;
                background-repeat: no-repeat;
                width: 35px;
                height: 30px;
                font-size: 0;
                padding: 4px;
                margin: 2px;
            }
            &__next-button {
                background-image: url("${`data:image/svg+xml;base64,${chevronRightString}`}");
            }
            &__prev-button {
                background-image: url("${`data:image/svg+xml;base64,${chevronLeftString}`}");
            }
            &__prev2-button,
            &__next2-button {
                display: none;
            }
            &__label {
                width: 180px;
                color: ${getColor("text.main")};
                font-weight: 700;
                font-size: 20px;
            }
        }

        &__month-view {
            &__weekdays {
                font-size: 12px;
                font-weight: 400;
                color: ${getColor("text.accent")};
                text-align: center;
                abbr {
                    text-decoration: none;
                }
            }

            &__days {
                &__day {
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 9.5px 0;
                    margin: 0;

                    &:disabled,
                    &--neighboringMonth {
                        color: ${getColor("common.border")};
                        cursor: default;
                    }
                }
            }
        }

        &__year-view,
        &__decade-view,
        &__century-view {
            .react-calendar__tile {
                padding: 1em 1px;
                background: none;
                border: none;
                font-size: 16px;
            }
        }

        &__tile {
            &--hasActive:not(:disabled):not(.react-calendar__month-view__days__day--neighboringMonth),
            &--active:not(:disabled):not(.react-calendar__month-view__days__day--neighboringMonth) {
                background-color: ${getColor("primary")};
                color: ${({ theme }) => getContrastColor("primary", theme)};
                font-weight: 200;
            }
            &--now {
                color: ${getColor("primary")};
                font-weight: 600;
            }
        }

        ${props => {
            return (
                props.calendarCompensationX !== null &&
                css`
                    @media (max-width: 600px) {
                        left: ${props.calendarCompensationX}px;
                        right: unset;
                    }
                `
            );
        }}
    }
    ${injectCss}
`;

/**
 * Input component for selecting a single date from an input field and calendar interface.
 */
class DatePicker extends React.Component<DatePickerProps & HasDisablerContext, DatePickerState> {
    static displayName = "DatePicker";

    private readonly datePickerRef = React.createRef<HTMLDivElement>();
    private readonly datePickerStyleRef = React.createRef<HTMLDivElement>();
    private readonly calendarWidth: number;

    constructor(props: DatePickerProps & HasDisablerContext) {
        super(props);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.calendarWidth = 306;
        this.state = {
            selectedDay: this.props.selectedDay || undefined,
            datePickerValue: this.props.selectedDay || undefined,
            isEmpty: !this.props.selectedDay,
            selectedDayDisabled: this.isSelectedDayDisabled(this.props.selectedDay, this.props.dateTimePickerProps),
            mobilePopupDirection: DatePickerPopupDirection.Right,
            windowWidth: typeof window !== "undefined" ? window.innerWidth : 0,
            calendarCompensationX: null,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: DatePickerProps) {
        if (nextProps.selectedDay !== this.props.selectedDay) {
            // if the next props don't have a date, but we think the date is disabled
            // then it means the datepicker has an invalid value, don't change state
            // otherwise we will lose that value
            if (!nextProps.selectedDay && this.state.selectedDayDisabled) {
                return;
            }

            this.setState({
                isEmpty: !nextProps.selectedDay,
                selectedDay: nextProps.selectedDay,
                datePickerValue: nextProps.selectedDay,
                selectedDayDisabled: this.isSelectedDayDisabled(
                    this.state.datePickerValue,
                    nextProps.dateTimePickerProps,
                ),
            });
        }
    }

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        const yearInput: HTMLInputElement | null = this.datePickerStyleRef.current!.querySelector(
            ".react-datetime-picker__inputGroup__year",
        );

        if (yearInput) {
            // firefox allows someone to add more than 4 digits in a year, it does not seem to respect the max="9999"
            // this prevents someone from typing too much into the year field in firefox
            yearInput.addEventListener("keydown", (e: KeyboardEvent) => {
                const regex = /\d/;
                if (yearInput.value.length === 4 && regex.test(e.key)) {
                    e.preventDefault();
                }
            });
        }

        window.addEventListener("resize", this.handleResize, true);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    isSelectedDayDisabled = (value: Date | undefined, dateTimePickerProps?: DateTimePickerProps) => {
        let selectedDayDisabled = false;
        if (value && typeof dateTimePickerProps?.tileDisabled === "function") {
            selectedDayDisabled = dateTimePickerProps?.tileDisabled({ date: value });
        }
        if (value && !selectedDayDisabled && dateTimePickerProps?.minDate) {
            selectedDayDisabled = value < dateTimePickerProps.minDate;
        }
        if (value && !selectedDayDisabled && dateTimePickerProps?.maxDate) {
            selectedDayDisabled = value > dateTimePickerProps.maxDate;
        }
        return selectedDayDisabled;
    };

    handleDayChange = (value: Date | undefined) => {
        const selectedDayDisabled = this.isSelectedDayDisabled(value, this.props.dateTimePickerProps);

        const setActualState = () => {
            this.setState(
                {
                    isEmpty: !value,
                    selectedDay: value,
                    datePickerValue: value,
                    selectedDayDisabled,
                },
                () => {
                    // when the date is cleared, we let the parent know from here
                    if (!value && typeof this.props.onDayChange === "function") {
                        this.props.onDayChange(this.state);
                    }
                },
            );
        };

        // if the last state was disabled, and we don't have a value
        // then someone clicked clear when there was an invalid date
        // we need to set the date to a valid value and back to null
        // to get the datepicker to rerender and clear the invalid date.
        // this also applies to if the value selected is the same as the last valid value in the datepicker
        if (this.state.selectedDayDisabled && (!value || value.toString() === this.state.datePickerValue?.toString())) {
            this.setState(
                {
                    datePickerValue: new Date(),
                },
                () => {
                    setActualState();
                },
            );
        } else {
            setActualState();
        }
    };

    handlePickerClosed = () => {
        // the datepicker library that we use won't return a selected date if it is
        // outside of the min/max, and it doesn't expose any way to know an invalid date
        // is selected, looking for :invalid inputs is the only way to detect it
        const selectedDayDisabled = !!(
            this.datePickerRef.current && this.datePickerRef.current.querySelectorAll(":invalid").length > 0
        );

        this.setState(
            { selectedDayDisabled, selectedDay: selectedDayDisabled ? undefined : this.state.selectedDay },
            () => {
                if (typeof this.props.onDayChange === "function") {
                    this.props.onDayChange(this.state);
                }
                const main = document.querySelector("main");
                main?.classList?.remove("overflow-visible");
            },
        );
    };

    render() {
        const {
            cssOverrides,
            disable,
            disabled,
            error,
            label,
            required,
            theme: { translate },
            monthAriaLabel,
            dayAriaLabel,
            yearAriaLabel,
            backgroundColor,
            ...otherProps
        } = this.props;
        // Because disabled html attribute doesn't accept undefined
        // eslint-disable-next-line no-unneeded-ternary
        const isDisabled = disable || disabled ? true : false;
        const { isEmpty, selectedDayDisabled, datePickerValue } = this.state;
        const { applyProp, spreadProps } = applyPropBuilder(this.props, {
            component: "datePicker",
            category: "formField",
        });
        const inputId = this.props.uid || uniqueId();
        const descriptionId = `${inputId}-description`;
        const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");
        const { datePicker: datePickerCss, ..._cssOverrides } = spreadProps("cssOverrides");
        const calendarIconProps = spreadProps("calendarIconProps");
        const clearIconProps = spreadProps("clearIconProps");

        const pickerInput = (
            <DateTimePickerStyle
                _sizeVariant={sizeVariant}
                css={datePickerCss}
                ref={this.datePickerStyleRef}
                disabled={!!isDisabled}
                mobilePopupDirection={this.state.mobilePopupDirection}
                role="group"
                aria-invalid={selectedDayDisabled || (required && isEmpty) || false}
                calendarCompensationX={this.state.calendarCompensationX}
            >
                <DateTimePicker
                    value={datePickerValue}
                    onCalendarClose={this.handlePickerClosed}
                    onClockClose={this.handlePickerClosed}
                    onCalendarOpen={() => {
                        const main = document.querySelector("main");
                        main?.classList?.add("overflow-visible");

                        const rect = this.datePickerStyleRef.current!.getBoundingClientRect();
                        const halfPageWidth = Math.round(this.state.windowWidth! / 2);
                        const rightHandSpace = Math.round(this.state.windowWidth! - rect.right);

                        let isLeft = rightHandSpace < this.calendarWidth - rect.width;

                        let calendarCompensationX = null;

                        if (isLeft) {
                            isLeft = false;
                            calendarCompensationX = Math.abs(halfPageWidth - rightHandSpace) * -1;
                        }

                        this.setState({
                            mobilePopupDirection: isLeft
                                ? DatePickerPopupDirection.Left
                                : DatePickerPopupDirection.Right,
                            calendarCompensationX,
                        });
                    }}
                    calendarIcon={
                        <>
                            <DatePickerIcon
                                _sizeVariant={sizeVariant}
                                {...calendarIconProps}
                                _backgroundColor={backgroundColor}
                                color={isDisabled ? "text.disabled" : calendarIconProps.color}
                            />
                            <VisuallyHidden>{translate("open or close calendar")}</VisuallyHidden>
                        </>
                    }
                    clearIcon={
                        <>
                            <DatePickerIcon
                                _sizeVariant={sizeVariant}
                                {...clearIconProps}
                                _backgroundColor={backgroundColor}
                                color={isDisabled ? "text.disabled" : clearIconProps.color}
                            />
                            <VisuallyHidden>{translate("clear date")}</VisuallyHidden>
                        </>
                    }
                    disabled={isDisabled}
                    monthAriaLabel={monthAriaLabel}
                    dayAriaLabel={dayAriaLabel}
                    yearAriaLabel={yearAriaLabel}
                    {...otherProps}
                    format={applyProp("format", "MM/dd/y")}
                    {...spreadProps("dateTimePickerProps")}
                    minDate={otherProps.dateTimePickerProps?.minDate || new Date("2000-01-01T00:00:00")}
                    maxDate={otherProps.dateTimePickerProps?.maxDate || new Date("9999-01-01T00:00:00")}
                    {...spreadProps("placeholders")}
                    onChange={this.handleDayChange}
                    nativeInputAriaLabel={typeof label === "string" ? label : undefined}
                    id={inputId}
                />
            </DateTimePickerStyle>
        );
        return (
            <div ref={this.datePickerRef}>
                <FormField
                    descriptionId={descriptionId}
                    formInput={pickerInput}
                    inputId={inputId}
                    cssOverrides={_cssOverrides}
                    backgroundColor={backgroundColor}
                    error={
                        selectedDayDisabled || (required && isEmpty)
                            ? error || translate("please choose a valid date")
                            : null
                    }
                    {...this.props}
                />
            </div>
        );
    }
}

DatePicker.displayName = "DatePicker";
/** @component */
export default withDisabler(withTheme(DatePicker));

export { DatePickerIcon };
