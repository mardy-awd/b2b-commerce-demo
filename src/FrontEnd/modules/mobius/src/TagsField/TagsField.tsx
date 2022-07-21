import FormField, { FormFieldPresentationProps, FormFieldSizeVariant } from "@insite/mobius/FormField";
import borderByState from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Tag, { TagPresentationProps } from "@insite/mobius/Tag/Tag";
import { applyPropBuilder } from "@insite/mobius/utilities";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import styled, { css, ThemeProps, withTheme } from "styled-components";

export interface TagsFieldPresentationProps extends FormFieldPresentationProps<TagsFieldComponentProps> {
    /** Props to be passed down to the Tag component.
     * @themable */
    tagProps?: TagPresentationProps;
    /** Props to be passed down to the input.
     * @themable */
    inputProps?: InjectableCss;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<TagsFieldProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
}

export interface TagsFieldComponentProps extends TagsFieldPresentationProps {
    uid?: string;
    value?: string[];
    placeholder?: string;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    validate?: (value: string) => boolean;
    validationFailedError?: React.ReactNode;
    onChange?: (value: string[]) => void;
}

export type TagsFieldProps = TagsFieldPresentationProps & TagsFieldComponentProps & ThemeProps<BaseTheme>;

interface State {
    uid: string;
    inputValue: string;
    inputError: React.ReactNode;
    isFocused: boolean;
}

class TagsField extends React.Component<TagsFieldProps, State> {
    state = {
        uid: this.props.uid || uniqueId(),
        inputValue: "",
        inputError: "",
        isFocused: false,
    };

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            inputValue: event.currentTarget.value,
            inputError: "",
        });
    };

    onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();

            let currentArray = this.props.value || [];
            const nextValue = event.currentTarget.value.trim();
            if (this.props.validate && !this.props.validate(nextValue)) {
                this.setState({ inputError: this.props.validationFailedError });
                return;
            }

            if (currentArray.indexOf(nextValue) === -1) {
                currentArray = [...currentArray, nextValue];
                this.props.onChange?.(currentArray);
            }

            this.setState({ inputValue: "", inputError: "" });
        }
    };

    removeTag = (tag: string) => {
        if (!this.props.value) {
            return;
        }

        const currentArray = [...this.props.value];
        currentArray.splice(currentArray.indexOf(tag), 1);
        this.props.onChange?.(currentArray);
    };

    onFocus = () => {
        this.setState({ isFocused: true });
    };

    onBlur = () => {
        this.setState({ isFocused: false });
    };

    render() {
        const { applyStyledProp } = applyPropBuilder(this.props, { component: "tagsField" });
        const { applyProp: applyTextFieldProp } = applyPropBuilder(this.props, {
            component: "textField",
            category: "formField",
        });
        const resolvedMergeCss = this.props.mergeCss ?? this.props?.theme?.accordion?.defaultProps?.mergeCss;

        const tagsFieldInput = (
            <TagsFieldStyle
                _sizeVariant={applyTextFieldProp("sizeVariant", "default")}
                border={applyTextFieldProp("border", "underline")}
                isFocused={this.state.isFocused}
                isError={!!this.state.inputError || !!this.props.error}
                css={applyStyledProp("css", resolvedMergeCss)}
            >
                {this.props.value?.map(tag => (
                    <Tag
                        key={tag}
                        onClick={() => this.removeTag(tag)}
                        css={css`
                            margin-bottom: 0;
                            margin-top: 5px;
                            padding: 0 5px 0 10px;
                            max-width: none;

                            span {
                                display: flex;
                                cursor: pointer;
                                align-items: center;
                            }
                        `}
                        {...this.props.tagProps}
                    >
                        {tag}
                    </Tag>
                ))}
                <InputStyle
                    id={`${this.state.uid}-input`}
                    type="text"
                    value={this.state.inputValue}
                    placeholder={this.props.placeholder}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    {...this.props.inputProps}
                />
            </TagsFieldStyle>
        );

        return (
            <FormField
                inputId={this.state.uid}
                formInput={tagsFieldInput}
                descriptionId={`${this.state.uid}-description`}
                labelId={`${this.state.uid}-label`}
                cssOverrides={{
                    inputSelect: css`
                        border: none;
                        outline: none;
                        padding: 0 3px;

                        &:not(:disabled),
                        &:not(:disabled):focus,
                        &:focus {
                            border: none;
                            outline: none;
                            padding: 0 3px;
                        }
                    `,
                }}
                {...this.props}
                error={this.state.inputError || this.props.error}
            />
        );
    }
}

interface TagsFieldStyleProps
    extends InjectableCss<any>,
        ThemeProps<BaseTheme>,
        Required<Pick<TagsFieldPresentationProps, "border">> {
    _sizeVariant: FormFieldSizeVariant;
    isFocused: boolean;
    isError: boolean;
}

const TagsFieldStyle = styled.div<TagsFieldStyleProps>`
    background: ${({ theme }) => theme.formField?.defaultProps?.backgroundColor};
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    ${props => borderByState(props, "inactive")}
    padding: 2px 8px 2px 8px;
    ${props => {
        if (props.isFocused) {
            return css`
                ${borderByState(props, "focus")}
                padding: 1px 5px 1px 7px;
            `;
        }
        if (props.isError) {
            return css`
                ${borderByState(props, "error")}
                padding: 1px 5px 1px 7px;
            `;
        }
        return "";
    }}
    ${injectCss}
`;

const InputStyle = styled.input<InjectableCss>`
    ${injectCss}
`;

export default withTheme(TagsField);
