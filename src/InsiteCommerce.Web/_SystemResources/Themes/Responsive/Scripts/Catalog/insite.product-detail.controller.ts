﻿import ConfigSectionDto = Insite.Catalog.Services.Dtos.ConfigSectionDto;
import ConfigSectionOptionDto = Insite.Catalog.Services.Dtos.ConfigSectionOptionDto;
import StyleTraitDto = Insite.Catalog.Services.Dtos.StyleTraitDto;
import StyledProductDto = Insite.Catalog.Services.Dtos.StyledProductDto;
import StyleValueDto = Insite.Catalog.Services.Dtos.StyleValueDto;
import BreadCrumbModel = Insite.Catalog.WebApi.V1.ApiModels.BreadCrumbModel;

module insite.catalog {
    "use strict";

    export class ProductDetailController {
        product: ProductDto;
        category: CategoryModel;
        breadCrumbs: BreadCrumbModel[];
        enableStructuredPageData: boolean;
        settings: ProductSettingsModel;
        configurationSelection: ConfigSectionOptionDto[] = [];
        configurationCompleted = false;
        styleSelection: StyleValueDto[] = [];
        styleSelectionCompleted = false;
        parentProduct: ProductDto = null;
        initialStyleTraits: StyleTraitDto[] = [];
        initialStyledProducts: StyledProductDto[] = [];
        styleTraitFiltered: StyleTraitDto[] = [];
        disabledTraits: {} = {};
        showUnitError = false;
        failedToGetRealTimePrices = false;
        failedToGetRealTimeInventory = false;
        productSubscription: ProductSubscriptionDto;
        addingToCart = false;
        languageId: System.Guid;
        enableWarehousePickup: boolean;
        session: SessionModel;
        initResolvePageCalled: boolean;
        configuration: string[] = [];
        ignoreLocationChange: boolean;
        realTimeInventoryWasLoaded: boolean;

        static $inject = [
            "$scope",
            "$window",
            "coreService",
            "cartService",
            "productService",
            "addToWishlistPopupService",
            "productSubscriptionPopupService",
            "settingsService",
            "$stateParams",
            "sessionService",
            "spinnerService",
            "queryString",
            "tellAFriendPopupService",
            "$location"
            ];

        constructor(
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected coreService: core.ICoreService,
            protected cartService: cart.ICartService,
            protected productService: IProductService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected productSubscriptionPopupService: catalog.ProductSubscriptionPopupService,
            protected settingsService: core.ISettingsService,
            protected $stateParams: IContentPageStateParams,
            protected sessionService: account.ISessionService,
            protected spinnerService: core.ISpinnerService,
            protected queryString: common.IQueryStringService,
            protected tellAFriendPopupService: catalog.ITellAFriendPopupService,
            protected $location: ng.ILocationService) {
        }

        $onInit(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.$scope.$on("updateProductSubscription", (event: ng.IAngularEvent, productSubscription: ProductSubscriptionDto, product: ProductDto, cartLine: CartLineModel) => {
                this.onUpdateProductSubscription(event, productSubscription, product, cartLine);
            });

            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });

            this.$scope.$on("sessionUpdated", (event: ng.IAngularEvent, session: SessionModel) => {
                this.onSessionUpdated(session);
            });

            this.$scope.$on("$locationChangeSuccess", (event, newUrl: string) => {
                if (this.product && this.product.styleTraits && !this.ignoreLocationChange) {
                    if (newUrl.toLowerCase().indexOf(this.product.productDetailUrl.split("?")[0].toLowerCase()) !== -1) {
                        this.initStyleSelection(this.product.styleTraits);
                    }
                }
                this.ignoreLocationChange = false;
            });

            this.$window.addEventListener("click", function (event) {
                const target = angular.element(event.target);

                if (target.id !== "swatch_dropdown_id"
                    && target.parents('#swatch_dropdown_id').length === 0) {
                    const swatchDropdown = document.getElementsByClassName("swatch-dropdown-selected-item");
                    if (swatchDropdown && swatchDropdown.length > 0) {
                        for (var i = 0; i < swatchDropdown.length; i++) {
                            swatchDropdown[i].classList.remove("show-dropdown-list");
                        }
                    }
                }
            });

            this.$scope.$watch(() => this.product, (newValue) => {
                if (newValue) {
                    this.setStructuredPageData();
                }
            }, true);
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.productSettings;
            this.enableWarehousePickup = settingsCollection.accountSettings.enableWarehousePickup;
            const context = this.sessionService.getContext();
            this.languageId = context.languageId;
            this.resolvePageOnInit();
        }

        protected getSettingsFailed(error: any): void {
        }

        protected onUpdateProductSubscription(event: ng.IAngularEvent, productSubscription: ProductSubscriptionDto, product: ProductDto, cartLine: CartLineModel): void {
            this.productSubscription = productSubscription;
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
            this.resolvePageOnInit();
        }

        protected getSessionFailed(error: any): void {
        }

        protected onSessionUpdated(session: SessionModel): void {
            this.session = session;
            this.resolvePage();
        }

        protected resolvePageOnInit(): void {
            if (this.session && this.settings && !this.initResolvePageCalled) {
                this.initResolvePageCalled = true;
                this.resolvePage();
            }
        }

        protected resolvePage(): void {
            this.spinnerService.show();
            const path = this.$stateParams.path || window.location.pathname;
            this.productService.getCatalogPage(path).then(
                (catalogPage: CatalogPageModel) => { this.getCatalogPageCompleted(catalogPage); },
                (error: any) => { this.getCatalogPageFailed(error); });
        }

        protected getCatalogPageCompleted(catalogPage: CatalogPageModel): void {
            const productId = catalogPage.productId; // this url is already known to map to a single product so productId should always be non null.
            this.category = catalogPage.category;
            this.breadCrumbs = catalogPage.breadCrumbs;
            this.enableStructuredPageData = catalogPage.enableStructuredPageData;
            this.getProductData(productId.toString());
        }

        protected getCatalogPageFailed(error: any): void {
        }

        protected getProductData(productId: string): void {
            this.spinnerService.show();
            const expand = ["documents", "specifications", "styledproducts", "htmlcontent", "attributes", "crosssells", "pricing", "relatedproducts", "brand"];
            let includeAlternateInventory = !this.enableWarehousePickup || this.session.fulfillmentMethod !== "PickUp";
            this.productService.getProduct(this.category ? this.category.id.toString() : null, productId, expand, true, true, "IncludeOnProduct,NotFromCategory", includeAlternateInventory, this.configuration, false).then(
                (productModel: ProductModel) => { this.getProductCompleted(productModel); },
                (error: any) => { this.getProductFailed(error); });
        }

        protected getProductCompleted(productModel: ProductModel): void {
            const productWasAlreadyLoaded = !!this.product;
            this.product = productModel.product;
            this.product.qtyOrdered = this.product.minimumOrderQty || 1;
            const isConfigured = this.product.isConfigured && this.product.configurationDto && this.product.configurationDto.sections;

            if (!productWasAlreadyLoaded && isConfigured) {
                this.initConfigurationSelection(this.product.configurationDto.sections);
            }

            if (this.product.styleTraits.length > 0) {
                this.initialStyledProducts = this.product.styledProducts.slice();
                this.styleTraitFiltered = this.product.styleTraits.slice();
                this.disabledTraits = {};
                this.initialStyleTraits = this.product.styleTraits.slice();
                if (this.product.isStyleProductParent) {
                    this.parentProduct = angular.copy(this.product);
                }

                if (!productWasAlreadyLoaded) {
                    this.initStyleSelection(this.product.styleTraits);
                }
            }

            if (productWasAlreadyLoaded && isConfigured) {
                this.configurationCompleted = false;
                this.configChanged();
            } else {
                if (isConfigured && this.configurationCompleted){
                    this.getConfigurablePrice(this.product)
                } else {
                    this.getRealTimePrices()
                }

                if (!this.settings.inventoryIncludedWithPricing) {
                    this.getRealTimeInventory();
                }
            }

            this.setTabs();
        }

        protected setTabs() {
            setTimeout(() => {
                ($(".easy-resp-tabs") as any).easyResponsiveTabs();
            }, 10);
        }

        protected getProductFailed(error: any): void {
        }

        protected getRealTimePrices(): void {
            if (this.product.quoteRequired) {
                return;
            }

            if (this.settings.realTimePricing) {
                const priceProducts = [this.product];
                if (this.product.styledProducts != null && this.product.styledProducts.length > 0) {
                    this.product.styledProducts.forEach((s) => {
                        const priceProduct = <ProductDto>{
                            id: s.productId,
                            selectedUnitOfMeasure: s.unitOfMeasure
                        };
                        priceProducts.push(priceProduct);
                    });
                }

                this.product.pricing.requiresRealTimePrice = true;
                this.productService.getProductRealTimePrices(priceProducts).then(
                    (realTimePrice: RealTimePricingModel) => this.getProductRealTimePricesCompleted(realTimePrice),
                    (error: any) => this.getProductRealTimePricesFailed(error));
            }
        }

        protected getProductRealTimePricesCompleted(realTimePrice: RealTimePricingModel): void {
            // product.pricing is already updated
            if (this.product.isStyleProductParent) {
                this.parentProduct = angular.copy(this.product);
            }

            if (this.settings.inventoryIncludedWithPricing) {
                this.getRealTimeInventory();
            }
        }

        protected getProductRealTimePricesFailed(error: any): void {
            this.failedToGetRealTimePrices = true;

            if (this.settings.inventoryIncludedWithPricing) {
                this.failedToGetRealTimeInventory = true;
            }
        }

        protected getRealTimeInventory(): void {
            if (this.settings.realTimeInventory) {
                const inventoryProducts = [this.product];
                if (this.product.styledProducts != null && this.product.styledProducts.length > 0) {
                    this.product.styledProducts.forEach((s) => {
                        const inventoryProduct = <ProductDto>{
                            id: s.productId,
                            selectedUnitOfMeasure: s.unitOfMeasure,
                            productUnitOfMeasures: s.productUnitOfMeasures
                        };
                        inventoryProducts.push(inventoryProduct);
                    });
                }

                this.productService.getProductRealTimeInventory(inventoryProducts).then(
                    (realTimeInventory: RealTimeInventoryModel) => this.getProductRealTimeInventoryCompleted(realTimeInventory),
                    (error: any) => this.getProductRealTimeInventoryFailed(error));
            }
        }

        protected getProductRealTimeInventoryCompleted(realTimeInventory: RealTimeInventoryModel): void {
            // product inventory is already updated
            this.realTimeInventoryWasLoaded = true;
            if (this.product.isStyleProductParent) {
                this.parentProduct = angular.copy(this.product);
                this.styleChange();
            }

            if (this.product.isConfigured && this.product.configurationDto && this.product.configurationDto.sections) {
                this.configurationCompleted = this.isConfigurationCompleted();
            }
        }

        protected getProductRealTimeInventoryFailed(error: any): void {
            this.failedToGetRealTimeInventory = true;
        }

        protected initConfigurationSelection(sections: ConfigSectionDto[]): void {
            this.configurationSelection = [];
            angular.forEach(sections, (section: ConfigSectionDto) => {
                const result = this.coreService.getObjectByPropertyValue(section.options, { selected: true });
                this.configurationSelection.push(result);
            });
            this.configurationCompleted = this.isConfigurationCompleted();
        }

        protected initStyleSelection(styleTraits: StyleTraitDto[]): void {
            // from autocomplete we are using option, from search user will be redirected with criteria
            const styledOption = this.queryString.get("option") || this.queryString.get("criteria");
            const styledOptionLowerCase = styledOption ? styledOption.toLowerCase() : "";
            let styledProduct: StyledProductDto;
            if (styledOptionLowerCase && this.product.styledProducts) {
                styledProduct = this.product.styledProducts.filter(o => o.erpNumber.toLowerCase() === styledOptionLowerCase)[0];
            }

            this.styleSelection = [];
            angular.forEach(styleTraits.sort((a, b) => a.sortOrder - b.sortOrder), (styleTrait: StyleTraitDto) => {
                let result: StyleValueDto = null;
                if (styledProduct) {
                    for (let styleValue of styledProduct.styleValues) {
                        result = this.coreService.getObjectByPropertyValue(styleTrait.styleValues,
                            { styleTraitId: styleValue.styleTraitId, styleTraitValueId: styleValue.styleTraitValueId });
                        if (result) {
                            break;
                        }
                    }
                }

                if (!result) {
                    result = this.coreService.getObjectByPropertyValue(styleTrait.styleValues, { isDefault: true });
                }

                this.styleSelection.push(result);
            });

            if (styledProduct) {
                this.product.qtyOrdered = styledProduct.minimumOrderQty || 1;
            } else if (this.styleSelection.length > 1 && !this.initialStyledProducts.some(o => this.styleSelection.every(s => s && o.styleValues.some(v => v.styleTraitValueId === s.styleTraitValueId)))) {
                for (let i = 1; i < this.styleSelection.length; i++) {
                    this.styleSelection[i] = null;
                }
            }

            this.styleChange();
        }

        addToCart(product: ProductDto): void {
            this.addingToCart = true;

            let sectionOptions: ConfigSectionOptionDto[] = null;
            if (this.configurationCompleted && product.configurationDto && product.configurationDto.sections) {
                sectionOptions = this.configurationSelection;
            }

            this.cartService.addLineFromProduct(product, sectionOptions, this.productSubscription, true).then(
                (cartLine: CartLineModel) => { this.addToCartCompleted(cartLine); },
                (error: any) => { this.addToCartFailed(error); }
            );
        }

        protected addToCartCompleted(cartLine: CartLineModel): void {
            this.addingToCart = false;
        }

        protected addToCartFailed(error: any): void {
            this.addingToCart = false;
        }

        openWishListPopup(product: ProductDto): void {
            this.addToWishlistPopupService.display([product]);
        }

        openProductSubscriptionPopup(product: ProductDto): void {
            this.productSubscriptionPopupService.display({ product: product, cartLine: null, productSubscription: this.productSubscription });
        }

        openSharePopup(product: ProductDto): void {
            this.tellAFriendPopupService.display({ product: product });
        }

        changeUnitOfMeasure(product: ProductDto): void {
            this.showUnitError = false;
            this.productService.changeUnitOfMeasure(product).then(
                (productDto: ProductDto) => { this.changeUnitOfMeasureCompleted(productDto); },
                (error: any) => { this.changeUnitOfMeasureFailed(error); }
            );
        }

        protected changeUnitOfMeasureCompleted(product: ProductDto): void {
            this.product = product;
            this.productService.updateAvailability(product);
            if (this.parentProduct) {
                this.parentProduct.selectedUnitOfMeasure = product.selectedUnitOfMeasure;
                this.parentProduct.unitOfMeasureDisplay = product.unitOfMeasureDisplay;
            }
        }

        protected changeUnitOfMeasureFailed(error: any): void {
        }

        isStyleTraitDisabled(styleTraitValueId: System.Guid): boolean {
            return !!this.disabledTraits[styleTraitValueId.toString()];
        }

        toggleSwatchDropdown(elementId: string): void {
            const swatchDropdowns = document.getElementsByClassName("swatch-dropdown-selected-item");
            if (swatchDropdowns && swatchDropdowns.length > 0) {
                for (var i = 0; i < swatchDropdowns.length; i++) {
                    if (swatchDropdowns[i].id.includes(elementId)) {
                        swatchDropdowns[i].classList.toggle("show-dropdown-list");
                    } else {
                        swatchDropdowns[i].classList.remove("show-dropdown-list");
                    }
                }
            }
        }

        selectStyle(style: StyleValueDto, index: number): void {
            this.styleSelection[index] = style;
            this.styleChange();
        }

        styleChange(): void {
            this.showUnitError = false;
            this.disabledTraits = {};
            let styledProductsFiltered: StyledProductDto[] = [];

            angular.copy(this.initialStyleTraits, this.styleTraitFiltered); // init styleTraitFiltered to display

            // loop trough every trait and compose values
            this.styleTraitFiltered.forEach((styleTrait) => {
                if (styleTrait) {
                    styledProductsFiltered = this.initialStyledProducts.slice();

                    // iteratively filter products for selected traits (except current)
                    this.styleSelection.forEach((styleValue: StyleValueDto) => {
                        if (styleValue && styleValue.styleTraitId !== styleTrait.styleTraitId) { // skip current style trait
                            styledProductsFiltered = this.getProductsByStyleTraitValueId(styledProductsFiltered, styleValue.styleTraitValueId);
                        }
                    });

                    // for current trait get all distinct values in filtered products
                    const filteredValues: StyleValueDto[] = [];
                    styledProductsFiltered.forEach((product: StyledProductDto) => {
                        const currentProduct = this.coreService.getObjectByPropertyValue(product.styleValues, { styleTraitId: styleTrait.styleTraitId }); // get values for current product
                        const isProductInFilteredList = currentProduct && filteredValues.some(item => (item.styleTraitValueId === currentProduct.styleTraitValueId)); // check if value already selected
                        if (currentProduct && !isProductInFilteredList) {
                            filteredValues.push(currentProduct);
                        }
                    });

                    let disabledValues = styleTrait.styleValues.filter(x => !filteredValues.some(filteredValue => filteredValue.styleTraitValueId === x.styleTraitValueId));
                    disabledValues.map(disabled => this.disabledTraits[disabled.styleTraitValueId.toString()] = true);
                }
            });

            this.styleSelectionCompleted = this.isStyleSelectionCompleted();

            if (this.styleSelectionCompleted) {
                const selectedProduct = this.getSelectedStyleProduct(styledProductsFiltered);
                if (selectedProduct) {
                    this.selectStyledProduct(selectedProduct);
                    this.product.isStyleProductParent = false;
                    this.ignoreLocationChange = true;
                    this.$location.search("option", selectedProduct.erpNumber);
                }
            } else {
                if (!this.product.isStyleProductParent) {
                    // displaying parent product when style selection is not completed and completed product was displayed
                    if (this.parentProduct.productUnitOfMeasures && this.parentProduct.productUnitOfMeasures.length > 0 && !this.parentProduct.canConfigure) {
                        if (this.parentProduct.productUnitOfMeasures.every(elem => elem.unitOfMeasure !== this.product.selectedUnitOfMeasure)) {
                            this.parentProduct.selectedUnitOfMeasure = this.getDefaultValue(this.parentProduct.productUnitOfMeasures);
                            this.changeUnitOfMeasure(this.parentProduct);
                        }

                        if (!this.settings.realTimePricing) {
                            this.productService.getProductPrice(this.parentProduct).then(
                                (productPrice: ProductPriceModel) => { this.styleChangeGetProductPriceCompleted(productPrice); },
                                (error: any) => { this.styleChangeGetProductPriceFailed(error); });
                        } else {
                            this.product = angular.copy(this.parentProduct);
                            this.setTabs();
                        }

                    } else {
                        this.product = angular.copy(this.parentProduct);
                        this.product.unitOfMeasureDisplay = "";
                        this.setTabs();
                    }
                }

                if (this.$location.search()) {
                    this.ignoreLocationChange = true;
                    this.$location.search("");
                }
            }
        }

        protected styleChangeGetProductPriceCompleted(productPrice: ProductPriceModel): void {
            this.product = angular.copy(this.parentProduct);
            this.setTabs();
        }

        protected styleChangeGetProductPriceFailed(error: any): void {
        }

        protected getSelectedStyleProduct(styledProducts: StyledProductDto[]): StyledProductDto {
            this.styleSelection.forEach((styleValue: StyleValueDto) => {
                styledProducts = this.getProductsByStyleTraitValueId(styledProducts, styleValue.styleTraitValueId);
            });

            return (styledProducts && styledProducts.length > 0) ? styledProducts[0] : null;
        }

        protected getProductsByStyleTraitValueId(styledProducts: StyledProductDto[], styleTraitValueId: System.Guid): StyledProductDto[] {
            return styledProducts.filter(product => product.styleValues.some(value => value.styleTraitValueId === styleTraitValueId));
        }

        protected selectStyledProduct(styledProduct: StyledProductDto): void {
            this.product.erpNumber = styledProduct.erpNumber;
            this.product.customerName = styledProduct.customerName;
            this.product.smallImagePath = styledProduct.smallImagePath;
            this.product.mediumImagePath = styledProduct.mediumImagePath;
            this.product.largeImagePath = styledProduct.largeImagePath;
            this.product.name = styledProduct.name;
            this.product.id = styledProduct.productId;
            this.product.qtyOnHand = styledProduct.qtyOnHand;
            this.product.quoteRequired = styledProduct.quoteRequired;
            this.product.shortDescription = styledProduct.shortDescription;
            this.product.availability = styledProduct.availability;
            this.product.productUnitOfMeasures = styledProduct.productUnitOfMeasures;
            this.product.productImages = styledProduct.productImages;
            this.product.trackInventory = styledProduct.trackInventory;
            this.product.minimumOrderQty = styledProduct.minimumOrderQty;
            this.product.productDetailUrl = styledProduct.productDetailUrl;
            this.product.cantBuy = styledProduct.cantBuy;
            this.product.allowZeroPricing = styledProduct.allowZeroPricing;

            if (this.product.qtyOrdered < this.product.minimumOrderQty) {
                this.product.qtyOrdered = this.product.minimumOrderQty;
            }

            if (this.product.productUnitOfMeasures && this.product.productUnitOfMeasures.length > 1) {
                if (!this.product.selectedUnitOfMeasure
                    || this.product.productUnitOfMeasures.every(o => o.unitOfMeasure !== this.product.selectedUnitOfMeasure)
                    || this.settings.alternateUnitsOfMeasure === false
                ) {
                    this.product.selectedUnitOfMeasure = this.getDefaultValue(this.product.productUnitOfMeasures);
                    this.changeUnitOfMeasure(this.product);
                } else if (!this.settings.realTimePricing) {
                    this.productService.getProductPrice(this.product).then(
                        (productPrice: ProductPriceModel) => { this.selectStyleProductGetProductPriceCompleted(productPrice); },
                        (error: any) => { this.selectStyleProductGetProductPriceFailed(error); }
                    );
                } else if (this.product.selectedUnitOfMeasure) {
                    this.getRealTimePrices();
                }
            } else {
                if (this.product.productUnitOfMeasures && this.product.productUnitOfMeasures.length === 1) {
                    this.product.selectedUnitOfMeasure = this.getDefaultValue(this.product.productUnitOfMeasures);
                    this.changeUnitOfMeasure(this.product);
                } else {
                    this.product.unitOfMeasureDisplay = "";
                }
                this.product.pricing = styledProduct.pricing;
                this.product.quoteRequired = styledProduct.quoteRequired;
            }
        }

        protected selectStyleProductGetProductPriceCompleted(productPrice: ProductPriceModel): void {
        }

        protected selectStyleProductGetProductPriceFailed(error: any): void {
        }

        protected isStyleSelectionCompleted(): boolean {
            if (!this.product.styleTraits) {
                return true;
            }

            return this.styleSelection.every(item => (item != null));
        }

        protected isConfigurationCompleted(): boolean {
            if (!this.product.isConfigured) {
                return true;
            }

            return this.configurationSelection.every(item => (item != null));
        }

        configChanged(): void {
            this.spinnerService.show();
            this.configuration = [];
            angular.forEach(this.configurationSelection, (selection) => {
                this.configuration.push(selection ? selection.sectionOptionId.toString() : guidHelper.emptyGuid());
            });

            this.getConfigurablePrice(this.product);
            this.getConfigurableAvailability(this.product);
        }

        protected getConfigurablePrice(product: ProductDto): void {
            if (this.settings.realTimePricing) {
                this.productService.getProductRealTimePrice(product, this.configuration).then(
                    (realTimePrice: RealTimePricingModel) => this.getProductRealTimePricesCompleted(realTimePrice),
                    (error: any) => this.getProductRealTimePricesFailed(error));
            } else {
                this.productService.getProductPrice(product, this.configuration).then(
                    (productPrice: ProductPriceModel) => { this.getConfigurablePriceCompleted(productPrice); },
                    (error: any) => { this.getConfigurablePriceFailed(error); }
                );
            }
        }

        protected getConfigurablePriceCompleted(productPrice: ProductPriceModel): void {
        }

        protected getConfigurablePriceFailed(error: any): void {
        }

        protected getConfigurableAvailability(product: ProductDto): void {
            if (this.settings.realTimeInventory) {
                const configurations: { [key: string]: string[] } = {};
                configurations[`${product.id}`] = this.configuration;
                this.productService.getProductRealTimeInventory([product], null, configurations).then(
                    (realTimeInventory: RealTimeInventoryModel) => this.getProductRealTimeInventoryCompleted(realTimeInventory),
                    (error: any) => this.getProductRealTimeInventoryFailed(error));
            } else {
                this.productService.getProductAvailability(product, this.configuration).then(
                    (productAvailability: ProductAvailabilityModel) => { this.getProductAvailabilityCompleted(productAvailability); },
                    (error: any) => { this.getProductAvailabilityFailed(error); }
                );
            }
        }

        protected getProductAvailabilityCompleted(productAvailability: ProductAvailabilityModel): void {
            this.configurationCompleted = this.isConfigurationCompleted();
        }

        protected getProductAvailabilityFailed(error: any): void {
        }

        protected getDefaultValue(unitOfMeasures: ProductUnitOfMeasureDto[]): string {
            const defaultMeasures = unitOfMeasures.filter(value => {
                return value.isDefault;
            });
            if (defaultMeasures.length > 0) {
                return defaultMeasures[0].unitOfMeasure;
            } else {
                return unitOfMeasures[0].unitOfMeasure;
            }
        }

        protected isAddToCartVisible() {
            return this.product && this.product.allowedAddToCart && !this.product.cantBuy &&
                ((this.product.canAddToCart && (!this.settings.realTimeInventory || this.realTimeInventoryWasLoaded))
                    || (((this.styleSelectionCompleted || this.configurationCompleted)
                        && (this.settings.allowBackOrder || ((<any>this.product.availability) && (<any>this.product.availability).messageType !== 2)))
                        && !this.product.canConfigure));
        }

        protected setStructuredPageData() {
            if (!this.enableStructuredPageData) {
                return;
            }

            const data = {
                "@context": "https://schema.org",
                "@type": "Product",
                productID: this.product.id,
                name: this.product.shortDescription,
                image: [this.product.smallImagePath, this.product.mediumImagePath, this.product.largeImagePath],
                mpn: this.product.manufacturerItem,
                sku: this.product.sku,
                url: this.product.productDetailUrl,
            } as any;

            if (!this.product.pricing.requiresRealTimePrice && !this.product.availability.requiresRealTimeInventory) {
                data.offers = {
                    "@type": "Offer",
                    availability:
                        this.product.availability.messageType !== 2
                            ? this.product.availability.messageType === 3
                                ? "https://schema.org/LimitedAvailability"
                                : "https://schema.org/InStock"
                            : "https://schema.org/OutOfStock",
                    price: this.product.pricing.unitNetPrice,
                    priceCurrency: this.session.currency.currencyCode,
                    url: this.product.productDetailUrl,
                };
            }

            if (!data.offers) {
                this.updateStructuredPageDataScript("");
                return;
            }

            if (this.product.brand) {
                data.brand = {
                    "@type": "Brand",
                    identifier: this.product.brand.id,
                    name: this.product.brand.name,
                    url: this.product.brand.detailPagePath,
                };
            }

            if (this.category) {
                data.category = this.category.path;
            }

            this.updateStructuredPageDataScript(JSON.stringify(data));
        }

        protected updateStructuredPageDataScript(structuredPageData: string) {
            let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
            if (jsonLdScript) {
                jsonLdScript.innerHTML = structuredPageData || "";
            } else if (structuredPageData) {
                jsonLdScript = document.createElement("script");
                jsonLdScript.setAttribute("type", "application/ld+json");
                jsonLdScript.innerHTML = structuredPageData;
                document.head.appendChild(jsonLdScript);
            }
        }
    }

    angular
        .module("insite")
        .controller("ProductDetailController", ProductDetailController);
}
