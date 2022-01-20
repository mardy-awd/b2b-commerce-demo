module insite.catalog {
    "use strict";

    angular
        .module("insite")
        .directive("iscProductVariantDropdown", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Catalog-ProductDetailsVariantDropdown",
            scope: {
                styleTrait: "=",
                styleSelection: "=",
                index: "=",
                styleChange: "&",
                isStyleTraitDisabled: "&"
            }
        }))
        .directive("iscProductVariantButtons", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Catalog-ProductDetailsVariantButtons",
            scope: {
                styleTrait: "=",
                index: "=",
                styleSelection: "=",
                clickHandler: "&",
                isStyleTraitDisabled: "&"
            }
        }))
        .directive("iscProductVariantSwatchDropdown", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Catalog-ProductDetailsVariantSwatchDropdown",
            scope: {
                styleTrait: "=",
                index: "=",
                styleSelection: "=",
                clickHandler: "&",
                isStyleTraitDisabled: "&",
                toggleSwatchDropdown: "&"
            }
        }))
        .directive("iscProductVariantSwatchGrid", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Catalog-ProductDetailsVariantSwatchGrid",
            scope: {
                styleTrait: "=",
                index: "=",
                styleSelection: "=",
                clickHandler: "&",
                isStyleTraitDisabled: "&"
            }
        }))
        .directive("iscProductVariantSwatchList", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Catalog-ProductDetailsVariantSwatchList",
            scope: {
                styleTrait: "=",
                index: "=",
                styleSelection: "=",
                clickHandler: "&",
                isStyleTraitDisabled: "&"
            }
        }));
}