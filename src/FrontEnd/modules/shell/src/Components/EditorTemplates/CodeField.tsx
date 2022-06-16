import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { CodeFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import "codemirror/addon/display/autorefresh.js";
import "codemirror/addon/lint/css-lint.js";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/css/css.js";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import * as React from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { css } from "styled-components";

type Props = EditorTemplateProps<string, CodeFieldDefinition>;

export default class CodeField extends React.Component<Props> {
    onChange = (model: string) => {
        this.props.updateField(this.props.fieldDefinition.name, model);
    };

    editorStyles = {
        css: css`
            .cm-editor {
                height: 30em;
            }

            .CodeMirror {
                margin-top: 0.5em;
                border: 1px solid #000;
            }
        `,
    };

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <StyledWrapper {...this.editorStyles}>
                    <CodeMirror
                        value={this.props.fieldValue}
                        options={this.props.fieldDefinition.options}
                        onChange={(editor, data, value) => {
                            const cursorPosition = editor.getCursor();
                            this.onChange(value);
                            editor.setCursor(cursorPosition);
                        }}
                    />
                </StyledWrapper>
            </StandardControl>
        );
    }
}
