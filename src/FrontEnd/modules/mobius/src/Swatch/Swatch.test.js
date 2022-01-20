import baseTheme from "@insite/mobius/globals/baseTheme";
import Swatch, { Border, Color, Disabled, Image } from "@insite/mobius/Swatch/Swatch";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import Typography from "@insite/mobius/Typography";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";

describe("Swatch", () => {
    let props;
    const theme = baseTheme;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Swatch {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = null;
    });

    describe("Image component", () => {
        test("Should render image when image type provided", () => {
            props = {
                isDisabled: false,
                isSelected: false,
                caption: "",
                type: "Image",
                value: "filled-src",
            };

            expect(wrapper().find(Image).props().src).toEqual(props.value);
            expect(wrapper().find(Disabled)).toHaveLength(0);
        });

        test("Should render disabled image when isDisabled is true", () => {
            props = {
                isDisabled: true,
                isSelected: false,
                caption: "",
                type: "Image",
                value: "filled-src",
            };

            expect(wrapper().find(Disabled)).toHaveLength(1);
        });

        test("Should show default color when type is image, but no value is provided", () => {
            props = {
                isDisabled: true,
                isSelected: false,
                caption: "",
                type: "Image",
                value: "",
            };

            expect(wrapper().find(Color)).toHaveLength(1);
            expect(wrapper().find(Color)).toHaveStyleRule("background-color", "#222");
        });
    });

    describe("Color component", () => {
        test("Should render color when color type is provided", () => {
            props = {
                isDisabled: false,
                isSelected: false,
                caption: "",
                type: "Color",
                value: "#000",
            };

            expect(wrapper().find(Color)).toHaveLength(1);
            expect(wrapper().find(Color)).toHaveStyleRule("background-color", props.value);
            expect(wrapper().find(Disabled)).toHaveLength(0);
        });

        test("Should render color with disabled div overlapping when isDisabled is true and type is Color", () => {
            props = {
                isDisabled: true,
                isSelected: false,
                caption: "",
                type: "Color",
                value: "#000",
            };

            expect(wrapper().find(Disabled)).toHaveLength(1);
            expect(wrapper().find(Color)).toHaveStyleRule("background-color", "#000");
        });
    });

    describe("Border component", () => {
        test("Should render transparent border when isSelected is false", () => {
            props = {
                isDisabled: false,
                isSelected: false,
                caption: "",
                type: "Color",
                value: "#000",
            };

            expect(wrapper().find(Border)).toHaveStyleRule("border-color", "transparent");
        });

        test("Should render border with specific blue color when isSelected is true", () => {
            props = {
                isDisabled: false,
                isSelected: true,
                caption: "",
                type: "Color",
                value: "#000",
            };

            expect(wrapper().find(Border)).toHaveStyleRule("border-color", "#00A3FF");
        });
    });

    describe("Typography caption component", () => {
        test("Should render typography when caption is provided", () => {
            props = {
                isDisabled: false,
                isSelected: false,
                caption: "Lorem Hipsum",
                type: "Color",
                value: "#000",
            };

            expect(wrapper().find(Typography).text()).toEqual(props.caption);
        });

        test("Should not render typography when caption is not provided", () => {
            props = {
                isDisabled: false,
                isSelected: true,
                caption: "",
                type: "Color",
                value: "#000",
            };

            expect(wrapper().find(Typography)).toHaveLength(0);
        });
    });
});
