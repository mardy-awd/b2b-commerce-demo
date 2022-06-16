module insite.quickorder {
    "use strict";

    import ProductVariantSelectorPopupController = insite.common.ProductVariantSelectorPopupController;

    export class SelectVariantProductPopupController extends ProductVariantSelectorPopupController {
        static $inject = ["coreService", "selectVariantProductPopupService", "$rootScope", "productService", "settingsService"];

        selector = "#popup-select-variant-product";

        constructor(
            protected coreService: core.ICoreService,
            protected selectVariantProductPopupService: ISelectVariantProductPopupService,
            protected $rootScope: ng.IRootScopeService,
            protected productService: catalog.IProductService,
            protected settingsService: core.ISettingsService) {
            super(coreService, selectVariantProductPopupService, $rootScope, productService, settingsService)
        }

        $onInit(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.selectVariantProductPopupService.registerDisplayFunction((product: ProductDto) => {
                this.initialStyledProducts = product.styledProducts.slice();
                this.styleTraitFiltered = product.styleTraits.slice();
                this.initialStyleTraits = product.styleTraits.slice();
                this.styleSelection = this.initialStyleTraits.map(p => null);
                this.product = {} as ProductDto;
                this.coreService.displayModal(this.selector);
            });
        }

        protected addToQuickOrderForm(): void {
            this.$rootScope.$broadcast("addProductToQuickOrderForm", this.product);
            this.coreService.closeModal(this.selector);
        }
    }

    export interface ISelectVariantProductPopupData {
        
    }

    export interface ISelectVariantProductPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class SelectVariantProductPopupService extends base.BasePopupService<any> implements ISelectVariantProductPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-select-variant-product-popup></isc-select-variant-product-popup>";
        }
    }

    angular
        .module("insite")
        .service("selectVariantProductPopupService", SelectVariantProductPopupService)
        .controller("SelectVariantProductPopupController", SelectVariantProductPopupController)
        .directive("iscSelectVariantProductPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/QuickOrder-SelectVariantProductPopup",
            controller: "SelectVariantProductPopupController",
            controllerAs: "vm"
        }));
}