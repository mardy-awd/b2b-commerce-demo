import useFilteredVariantTraits from "@insite/client-framework/Common/Hooks/useFilteredVariantTraits";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { ProductModel, VariantTraitModel } from "@insite/client-framework/Types/ApiModels";

describe("useFilteredVariantTraits", () => {
    const baseVariantTraits: VariantTraitModel[] = [
        {
            id: "testVariantTrait1",
            sortOrder: 1,
            traitValues: [
                {
                    id: "traitValueModel1",
                },
                {
                    id: "traitValueModel2",
                },
            ],
        } as VariantTraitModel,
        {
            id: "testVariantTrait2",
            sortOrder: 2,
            traitValues: [
                {
                    id: "traitValueModel3",
                },
                {
                    id: "traitValueModel4",
                },
            ],
        } as VariantTraitModel,
    ];

    const baseVariantChildren: ProductModel[] = [
        {
            childTraitValues: [
                {
                    id: "traitValueModel1",
                    styleTraitId: "test",
                    value: "test",
                    valueDisplay: "test",
                },
            ],
        } as ProductModel,
    ];

    test("Should not filter out variant traits", () => {
        // arrange
        const variantTraits = baseVariantTraits;
        const variantChildren = baseVariantChildren;
        const variantSelection: SafeDictionary<string> = {};

        // act
        const result = useFilteredVariantTraits(variantTraits, variantChildren, variantSelection);

        // assert
        expect(result).not.toBeNull();
        expect(result.length).toEqual(2);
        expect(result[0].traitValues?.length).toEqual(0);
        expect(result[0].id).toEqual("testVariantTrait1");
    });

    test("Should filter out one variant trait", () => {
        // arrange
        const variantTraits = baseVariantTraits;
        const variantChildren = baseVariantChildren;
        variantChildren.push({
            childTraitValues: [
                {
                    id: "traitValueModel1",
                    styleTraitId: "testVariantTrait1",
                    value: "test",
                    valueDisplay: "test",
                },
            ],
        } as ProductModel);
        const variantSelection: SafeDictionary<string> = {
            testVariantTrait1: "traitValueModel1",
            testVariantTrait2: "",
        };

        // act
        const result = useFilteredVariantTraits(variantTraits, variantChildren, variantSelection);

        // assert
        expect(result).not.toBeNull();
        expect(result.length).toEqual(2);
        expect(result[0].traitValues?.length).toEqual(1);
        expect(result[0].id).toEqual("testVariantTrait1");
    });

    test("Should mark trait values as disabled", () => {
        // arrange
        const variantTraits = baseVariantTraits;
        const variantChildren = baseVariantChildren;
        variantChildren.push({
            childTraitValues: [
                {
                    id: "traitValueModel1",
                    styleTraitId: "testVariantTrait1",
                    value: "test",
                    valueDisplay: "test",
                },
            ],
        } as ProductModel);
        const variantSelection: SafeDictionary<string> = {
            testVariantTrait1: "traitValueModel1",
            testVariantTrait2: "",
        };

        // act
        const result = useFilteredVariantTraits(variantTraits, variantChildren, variantSelection, true);

        // assert
        expect(result).not.toBeNull();
        expect(result.length).toEqual(2);
        expect(result[0].traitValues?.length).toEqual(2);
        expect(result[0].traitValues![1].isDisabled).toBeTruthy();
        expect(result[0].id).toEqual("testVariantTrait1");
    });
});
