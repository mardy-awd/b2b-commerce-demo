declare let TokenEx: any;
declare let $XIFrame: any;

module insite.cart {
    "use strict";
    import StateModel = Insite.Websites.WebApi.V1.ApiModels.StateModel;
    import TokenExDto = insite.core.TokenExDto;
    import PaymetricDto = insite.core.PaymetricDto;
    import CreditCardDto = Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto;
    import WarehouseModel = Insite.Catalog.WebApi.V1.ApiModels.WarehouseModel;
    import SessionModel = Insite.Account.WebApi.V1.ApiModels.SessionModel;
    import PaymentMethodDto = Insite.Cart.Services.Dtos.PaymentMethodDto;
    import CustomerSettingsModel = Insite.Customers.WebApi.V1.ApiModels.CustomerSettingsModel;
    import IPaymentService = insite.payment.IPaymentService;
    import PaymentAuthenticationModel = Insite.Payments.WebApi.V1.ApiModels.PaymentAuthenticationModel;
    import ThreeDsModel = Insite.Cart.Services.Dtos.ThreeDsDto;

    export interface IReviewAndPayControllerAttributes extends ng.IAttributes {
        cartUrl: string;
    }

    export class ReviewAndPayController {
        cart: CartModel;
        cartId: string;
        cartIdParam: string;
        countries: CountryModel[];
        creditCardBillingCountry: CountryModel;
        creditCardBillingState: StateModel;
        promotions: PromotionModel[];
        promotionAppliedMessage: string;
        promotionErrorMessage: string;
        promotionCode: string;
        submitErrorMessage: string;
        submitting: boolean;
        cartUrl: string;
        cartSettings: CartSettingsModel;
        customerSettings: CustomerSettingsModel;
        pageIsReady = false;
        showQuoteRequiredProducts: boolean;
        submitSuccessUri: string;
        useTokenExGateway: boolean;
        useECheckTokenExGateway: boolean;
        tokenExIframe: any;
        tokenExAccountNumberIframe: any;
        tokenExRoutingNumberIframe: any;
        usePaymetricGateway: boolean;
        paymetricIframe: any;
        paymetricDto: PaymetricDto;
        isRequiredCardNumber: boolean;
        isInvalidCardNumber: boolean;
        isRequiredSecurityCode: boolean;
        isInvalidSecurityCode: boolean;
        isInvalidAccountNumber: boolean;
        isInvalidRoutingNumber: boolean;
        session: SessionModel;
        enableWarehousePickup: boolean;
        taxFailureReason: string;
        manyAttemptsError: string;
        canUpdateShipToAddress: boolean;
        ppTokenExIframe: any;
        ppTokenExIframeIsLoaded: boolean;
        ppIsRequiredSecurityCode: boolean;
        ppIsInvalidSecurityCode: boolean;
        hasInvalidPrice = false;
        bypassCvvForSavedCards: boolean;
        paymentGatewayRequiresAuthentication: boolean;
        threeDs: ThreeDsModel;

        static $inject = [
            "$http",
            "$scope",
            "$window",
            "cartService",
            "promotionService",
            "sessionService",
            "coreService",
            "spinnerService",
            "$attrs",
            "settingsService",
            "queryString",
            "$localStorage",
            "websiteService",
            "deliveryMethodPopupService",
            "selectPickUpLocationPopupService",
            "paymentService",
            "tokenExIFrameService"
        ];

        constructor(
            protected $http: ng.IHttpService,
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected cartService: ICartService,
            protected promotionService: promotions.IPromotionService,
            protected sessionService: account.ISessionService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected $attrs: IReviewAndPayControllerAttributes,
            protected settingsService: core.ISettingsService,
            protected queryString: common.IQueryStringService,
            protected $localStorage: common.IWindowStorage,
            protected websiteService: websites.IWebsiteService,
            protected deliveryMethodPopupService: account.IDeliveryMethodPopupService,
            protected selectPickUpLocationPopupService: account.ISelectPickUpLocationPopupService,
            protected paymentService: IPaymentService,
            protected tokenExIFrameService: insite.common.ITokenExIFrameService) {
        }

        $onInit(): void {
            this.$scope.$on("cartChanged", (event: ng.IAngularEvent) => this.onCartChanged(event));

            this.cartUrl = this.$attrs.cartUrl;
            this.manyAttemptsError = this.$attrs.manyAttemptsError;
            this.cartId = this.queryString.get("cartId") || "current";

            this.getCart(true);

            $("#reviewAndPayForm").validate();

            this.$scope.$watch("vm.cart.paymentMethod", (paymentMethod: PaymentMethodDto) => {
                if (paymentMethod && paymentMethod.isPaymentProfile && !this.bypassCvvForSavedCards) {
                    this.setUpPPTokenExGateway();
                }
                if (paymentMethod && paymentMethod.isCreditCard && this.usePaymetricGateway) {
                    this.setUpPaymetricGateway();
                }
            });
            this.$scope.$watch("vm.cart.paymentOptions.creditCard.expirationYear", (year: number) => {
                this.onExpirationYearChanged(year);
            });
            this.$scope.$watch("vm.cart.paymentOptions.creditCard.useBillingAddress", (useBillingAddress: boolean) => {
                this.onUseBillingAddressChanged(useBillingAddress);
            });
            this.$scope.$watch("vm.creditCardBillingCountry", (country: CountryModel) => {
                this.onCreditCardBillingCountryChanged(country);
            });
            this.$scope.$watch("vm.creditCardBillingState", (state: StateModel) => {
                this.onCreditCardBillingStateChanged(state);
            });

            this.settingsService.getSettings().then(
                (settings: core.SettingsCollection) => {
                    this.getSettingsCompleted(settings);
                },
                (error: any) => {
                    this.getSettingsFailed(error);
                });

            this.$scope.$on("sessionUpdated", (event, session) => {
                this.onSessionUpdated(session);
            });

            jQuery.validator.addMethod("angularmin", (value, element, minValue) => {
                const valueParts = value.split(":");
                return valueParts.length === 2 && valueParts[1] > minValue;
            });

            this.$scope.$on("$locationChangeStart", () => {
                this.tokenExIFrameService.removeScript();
            });
        }

        protected onCartChanged(event: ng.IAngularEvent): void {
            this.getCart();
        }

        protected onExpirationYearChanged(year: number): void {
            if (year) {
                const now = new Date();
                const minMonth = now.getFullYear() === year ? now.getMonth() : 0;
                jQuery("#expirationMonth").rules("add", { angularmin: minMonth });
                jQuery("#expirationMonth").valid();
            }
        }

        protected onUseBillingAddressChanged(useBillingAddress: boolean): void {
            if (typeof (useBillingAddress) === "undefined" || useBillingAddress) {
                return;
            }

            if (typeof (this.countries) !== "undefined") {
                return;
            }

            this.websiteService.getCountries("states").then(
                (countryCollection: CountryCollectionModel) => {
                    this.getCountriesCompleted(countryCollection);
                },
                (error: any) => {
                    this.getCountriesFailed(error);
                });
        }

        protected onCreditCardBillingCountryChanged(country: CountryModel): void {
            if (typeof (country) !== "undefined") {
                if (country != null) {
                    this.cart.paymentOptions.creditCard.country = country.name;
                    this.cart.paymentOptions.creditCard.countryAbbreviation = country.abbreviation;
                } else {
                    this.cart.paymentOptions.creditCard.country = "";
                    this.cart.paymentOptions.creditCard.countryAbbreviation = "";
                }
            }
        }

        protected onCreditCardBillingStateChanged(state: StateModel): void {
            if (typeof (state) !== "undefined") {
                if (state != null) {
                    this.cart.paymentOptions.creditCard.state = state.name;
                    this.cart.paymentOptions.creditCard.stateAbbreviation = state.abbreviation;
                } else {
                    this.cart.paymentOptions.creditCard.state = "";
                    this.cart.paymentOptions.creditCard.stateAbbreviation = "";
                }
            }
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.cartSettings = settingsCollection.cartSettings;
            this.customerSettings = settingsCollection.customerSettings;
            this.useTokenExGateway = settingsCollection.websiteSettings.useTokenExGateway;
            this.useECheckTokenExGateway = settingsCollection.websiteSettings.useECheckTokenExGateway;
            this.usePaymetricGateway = settingsCollection.websiteSettings.usePaymetricGateway;
            this.enableWarehousePickup = settingsCollection.accountSettings.enableWarehousePickup;
            this.bypassCvvForSavedCards = settingsCollection.cartSettings.bypassCvvForSavedCards;
            this.paymentGatewayRequiresAuthentication = settingsCollection.websiteSettings.paymentGatewayRequiresAuthentication;

            this.tokenExIFrameService.addScript(settingsCollection.websiteSettings);

            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getCountriesCompleted(countryCollection: CountryCollectionModel) {
            this.countries = countryCollection.countries;
            if (this.countries.length === 1) {
                this.creditCardBillingCountry = this.countries[0];
            }
        }

        protected getCountriesFailed(error: any): void {
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
            this.canUpdateShipToAddress = this.session.billTo.isGuest || this.session.shipTo.oneTimeAddress || this.customerSettings.allowBillToAddressEdit || this.customerSettings.allowShipToAddressEdit;
        }

        protected getSessionFailed(error: any): void {
        }

        protected onSessionUpdated(session: SessionModel): void {
            this.session = session;
            this.getCart(true);
        }

        getCart(isInit?: boolean): void {
            this.spinnerService.show();
            this.cartService.expand = `cartlines,shipping,tax,carriers,paymentoptions,${Date.now()}`; // include date to prevent caching when clicking back from order confirmation
            if (this.$localStorage.get("hasRestrictedProducts") === true.toString()) {
                this.cartService.expand += ",restrictions";
            }
            this.cartService.forceRecalculation = true;
            this.cartService.allowInvalidAddress = true;
            this.cartService.getCart(this.cartId).then(
                (cart: CartModel) => {
                    this.getCartCompleted(cart, isInit);
                },
                (error: any) => {
                    this.getCartFailed(error);
                });
        }

        protected getCartCompleted(cart: CartModel, isInit: boolean): void {
            this.cartService.expand = "";
            this.cartService.forceRecalculation = false;
            this.cartService.allowInvalidAddress = false;

            this.restoreAlreadyFilledFields(this.cart, cart);

            let paymentMethod: Insite.Cart.Services.Dtos.PaymentMethodDto;
            let transientCard: Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto;
            if (this.cart && this.cart.paymentOptions) {
                paymentMethod = this.cart.paymentMethod;
                transientCard = this.saveTransientCard();
            }

            this.cart = cart;

            const hasRestrictions = cart.cartLines.some(o => o.isRestricted);
            // if cart does not have cartLines or any cartLine is restricted, go to Cart page
            if (!this.isOpenedFromCmsShell() && (!this.cart.cartLines || this.cart.cartLines.length === 0 || hasRestrictions)) {
                this.coreService.redirectToPath(this.cartUrl);
            }

            if (isInit) {
                this.showQuoteRequiredProducts = this.cart.status !== "Cart";
            }

            this.hasInvalidPrice = cart.cartLines.some(o => !o.isPromotionItem && !o.quoteRequired && !o.allowZeroPricing &&
                o.pricing.unitNetPrice === 0 && o.pricing.unitRegularPrice === 0);

            this.cartIdParam = this.cart.id === "current" ? "" : `?cartId=${this.cart.id}`;

            if (transientCard) {
                this.restoreTransientCard(transientCard);
            }

            this.setUpCarrier(isInit);
            this.setUpShipVia(isInit);
            this.setUpPaymentMethod(isInit, paymentMethod || this.cart.paymentMethod);
            this.setUpPayPal(isInit);

            if (isInit) {
                setTimeout(() => {
                    this.setUpTokenExGateway();
                }, 0, false);
                setTimeout(() => {
                    this.setUpECheckTokenExGateway();
                }, 0, false);
                setTimeout(() => {
                    this.setUpPaymetricGateway();
                }, 0, false);
            }

            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => {
                    this.getCartPromotionsCompleted(promotionCollection);
                },
                (error: any) => {
                    this.getCartPromotionsFailed(error);
                });

            if (!isInit) {
                this.pageIsReady = true;
            }
        }

        protected saveTransientCard(): Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto {
            return {
                cardType: this.cart.paymentOptions.creditCard.cardType,
                cardHolderName: this.cart.paymentOptions.creditCard.cardHolderName,
                cardNumber: this.cart.paymentOptions.creditCard.cardNumber,
                expirationMonth: this.cart.paymentOptions.creditCard.expirationMonth,
                expirationYear: this.cart.paymentOptions.creditCard.expirationYear,
                securityCode: this.cart.paymentOptions.creditCard.securityCode,
                useBillingAddress: this.cart.paymentOptions.creditCard.useBillingAddress,
                address1: this.cart.paymentOptions.creditCard.address1,
                city: this.cart.paymentOptions.creditCard.city,
                state: this.cart.paymentOptions.creditCard.state,
                stateAbbreviation: this.cart.paymentOptions.creditCard.stateAbbreviation,
                postalCode: this.cart.paymentOptions.creditCard.postalCode,
                country: this.cart.paymentOptions.creditCard.country,
                countryAbbreviation: this.cart.paymentOptions.creditCard.countryAbbreviation
            };
        }

        protected restoreTransientCard(transientCard: Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto): void {
            this.cart.paymentOptions.creditCard.cardType = transientCard.cardType;
            this.cart.paymentOptions.creditCard.cardHolderName = transientCard.cardHolderName;
            this.cart.paymentOptions.creditCard.cardNumber = transientCard.cardNumber;
            this.cart.paymentOptions.creditCard.expirationMonth = transientCard.expirationMonth;
            this.cart.paymentOptions.creditCard.expirationYear = transientCard.expirationYear;
            this.cart.paymentOptions.creditCard.securityCode = transientCard.securityCode;
        }

        protected restoreAlreadyFilledFields(currentCart: CartModel, newCart: CartModel): void {
            if (!currentCart) {
                return;
            }

            newCart.poNumber = currentCart.poNumber;
            newCart.notes = currentCart.notes;
            newCart.requestedDeliveryDate = currentCart.requestedDeliveryDate;
            newCart.requestedPickupDate = currentCart.requestedPickupDate;
        }

        protected setUpCarrier(isInit: boolean): void {
            if (this.cart.carriers.length > 0) {
                this.cart.carriers.forEach(carrier => {
                    if (carrier.id === this.cart.carrier.id) {
                        this.cart.carrier = carrier;
                        if (isInit) {
                            this.updateCarrier();
                        }
                    }
                });
            } else {
                this.pageIsReady = true;
            }
        }

        protected setUpShipVia(isInit: boolean): void {
            if (this.cart.carrier && this.cart.carrier.shipVias) {
                this.cart.carrier.shipVias.forEach(shipVia => {
                    if (shipVia.id === this.cart.shipVia.id) {
                        this.cart.shipVia = shipVia;
                    }
                });
            }
        }

        protected setUpPaymentMethod(isInit: boolean, selectedMethod: Insite.Cart.Services.Dtos.PaymentMethodDto): void {
            if (selectedMethod) {
                this.cart.paymentOptions.paymentMethods.forEach(paymentMethod => {
                    if (paymentMethod.name === selectedMethod.name) {
                        this.cart.paymentMethod = paymentMethod;
                    }
                });
            } else if (this.cart.paymentOptions.paymentMethods.length === 1) {
                this.cart.paymentMethod = this.cart.paymentOptions.paymentMethods[0];
            }
        }

        protected setUpPayPal(isInit: boolean): void {
            const payerId = this.queryString.get("PayerID").toUpperCase();
            const token = this.queryString.get("token").toUpperCase();

            if (payerId && token) {
                this.cart.paymentOptions.isPayPal = true;
                this.cart.status = "Cart";
                this.cart.paymentOptions.payPalToken = token;
                this.cart.paymentOptions.payPalPayerId = payerId;
                this.cart.paymentMethod = null;
            }
        }

        protected getCartFailed(error: any): void {
            this.cartService.expand = "";
            this.cartService.forceRecalculation = false;
            this.cartService.allowInvalidAddress = false;
        }

        protected getCartPromotionsCompleted(promotionCollection: PromotionCollectionModel): void {
            this.promotions = promotionCollection.promotions;
        }

        protected getCartPromotionsFailed(error: any): void {
        }

        updateCarrier(): void {
            if (this.cart.carrier && this.cart.carrier.shipVias) {
                if (this.cart.carrier.shipVias.length === 1 && (!this.cart.shipVia || this.cart.carrier.shipVias[0].id !== this.cart.shipVia.id)) {
                    this.cart.shipVia = this.cart.carrier.shipVias[0];
                    this.updateShipVia();
                } else if (this.cart.carrier.shipVias.length > 1 &&
                    (!this.cart.shipVia || this.cart.carrier.shipVias.every(sv => sv.id !== this.cart.shipVia.id)) &&
                    this.cart.carrier.shipVias.filter(sv => sv.isDefault).length > 0) {
                    this.cart.shipVia = this.cart.carrier.shipVias.filter(sv => sv.isDefault)[0];
                    this.updateShipVia();
                } else {
                    this.pageIsReady = true;
                }
            } else {
                this.pageIsReady = true;
            }
        }

        updateShipVia(): void {
            if (this.cart.shipVia === null) {
                return;
            }

            this.spinnerService.show();
            this.cartService.updateCart(this.cart).then(
                (cart: CartModel) => {
                    this.updateShipViaCompleted(cart);
                },
                (error: any) => {
                    this.updateShipViaFailed(error);
                });
        }

        protected updateShipViaCompleted(cart: CartModel): void {
            this.getCart();
        }

        protected updateShipViaFailed(error: any): void {
        }

        submit(submitSuccessUri: string, signInUri: string): void {
            this.submitting = true;
            this.submitErrorMessage = "";
            if (!this.validateReviewAndPayForm()) {
                this.submitting = false;
                return;
            }

            this.sessionService.getIsAuthenticated().then(
                (isAuthenticated: boolean) => { this.getIsAuthenticatedForSubmitCompleted(isAuthenticated, submitSuccessUri, signInUri); },
                (error: any) => { this.getIsAuthenticatedForSubmitFailed(error); });
        }

        protected getIsAuthenticatedForSubmitCompleted(isAuthenticated: boolean, submitSuccessUri: string, signInUri: string): void {
            if (!isAuthenticated) {
                this.coreService.redirectToPathAndRefreshPage(`${signInUri}?returnUrl=${this.coreService.getCurrentPath()}`);
                return;
            }

            this.spinnerService.show("mainLayout", true);

            this.tokenizeCardInfoIfNeeded(submitSuccessUri);
        }

        protected tokenizeCardInfoIfNeeded(submitSuccessUri: string) {
            this.submitSuccessUri = submitSuccessUri;

            if (this.useTokenExGateway && this.cart.showCreditCard && !this.cart.paymentOptions.isPayPal && this.cart.paymentMethod && !this.cart.paymentMethod.isECheck && !this.cart.requiresApproval) {
                if (this.cart.paymentMethod.isCreditCard) {
                    if (typeof this.isInvalidCardNumber !== 'undefined') {
                        this.tokenExIframe.tokenize();
                    } else {
                        this.tokenExIframe.validate();
                        this.spinnerService.hide();
                        this.scrollToTopOfForm();
                        this.submitting = false;
                    }
                    return;
                }

                if (this.cart.paymentMethod.isPaymentProfile && !this.bypassCvvForSavedCards) {
                    this.ppTokenExIframe.tokenize();
                    return;
                }
            }

            if (this.useECheckTokenExGateway && this.cart.showECheck && !this.cart.paymentOptions.isPayPal && this.cart.paymentMethod && this.cart.paymentMethod.isECheck && !this.cart.requiresApproval) {
                if (typeof this.isInvalidAccountNumber !== 'undefined' && typeof this.isInvalidRoutingNumber !== 'undefined') {
                    this.tokenExAccountNumberIframe.tokenize();
                } else {
                    this.tokenExAccountNumberIframe.validate();
                    this.tokenExRoutingNumberIframe.validate();
                    this.spinnerService.hide();
                    this.scrollToTopOfForm();
                    this.submitting = false;
                }
                return;
            }

            if (this.usePaymetricGateway && this.cart.showCreditCard && !this.cart.paymentOptions.isPayPal && !this.cart.requiresApproval) {
                if (this.cart.paymentMethod.isCreditCard) {
                    this.submitPaymetric();
                    return;
                }
            }

            this.submitCart();
        }

        protected submitCart(): void {
            if (this.paymentGatewayRequiresAuthentication) {
                const transactionId = guidHelper.generateGuid();
                this.paymentService.authenticate({
                    transactionId: transactionId,
                    cardNumber: this.cart.paymentOptions.creditCard.cardNumber ?? this.cart.paymentMethod.name,
                    expirationMonth: this.cart.paymentOptions.creditCard.expirationMonth,
                    expirationYear: this.cart.paymentOptions.creditCard.expirationYear,
                    orderAmount: this.cart.orderGrandTotal.toString(),
                    operation: 'authenticate',
                    isPaymentProfile: this.cart.paymentMethod.isPaymentProfile,
                }).then(
                    (result: PaymentAuthenticationModel) => {
                        if (result.redirectHtml) {
                            if (result.redirectHtml.includes("threedsFrictionLessRedirect"))
                            {
                                this.threeDs = { 
                                    authenticationToken: result.threeDs.authenticationToken, 
                                    authenticationVersion : result.threeDs.authenticationVersion,
                                    dsTransactionId : result.threeDs.dsTransactionId,
                                    acsEci: result.threeDs.acsEci
                                };
                                this.submitCart2();
                            }
                            else {
                                this.coreService.displayModal(angular.element("#3ds"));
                                angular.element("#redirect-html").html(result.redirectHtml.replace("100vh", "70vh"));
                                this.checkForRedirectResult(transactionId);
                            }
                        } else {
                            this.submitCart2();
                        }
                    }, (error: any) => {
                        this.submitFailed(error);
                    }
                );
                return;
            } else {
                this.submitCart2();
            }
        }

        protected close3dsModal(): void {
            this.submitFailed({ message: "" });
        }

        protected checkForRedirectResult(transactionId: string): void {
            this.paymentService.getAuthenticationStatus(transactionId)
                .then(
                    (result: PaymentAuthenticationModel) => {
                        if (result.action === 'PENDING') {
                            setTimeout(() => this.checkForRedirectResult(transactionId), 250);
                        } else {
                            this.coreService.closeModal("#3ds");
                            if (result.action === 'SUCCESS') {
                                this.threeDs = { 
                                    authenticationToken: result.threeDs.authenticationToken, 
                                    authenticationVersion : result.threeDs.authenticationVersion,
                                    dsTransactionId : result.threeDs.dsTransactionId,
                                    acsEci: result.threeDs.acsEci
                                };
                                this.submitCart2();
                           } else {
                               this.$scope.$apply(() => {
                                   this.submitFailed({ message: "" });
                               });
                           }
                        }
                }, (error: any) => {
                    this.coreService.closeModal("#3ds");
                    this.submitFailed(error);
                });
        }

        protected submitCart2(): void {
            this.cart.requestedDeliveryDate = this.formatWithTimezone(this.cart.requestedDeliveryDate);
            this.cart.status = this.cart.requiresApproval ? "AwaitingApproval" : "Submitted";
            this.cart.paymentOptions.threeDs = this.threeDs;

            this.cartService.updateCart(this.cart, true).then(
                (cart: CartModel) => {
                    this.submitCompleted(cart, this.submitSuccessUri);
                },
                (error: any) => {
                    this.submitFailed(error);
                });
        }

        private formatWithTimezone(date: string): string {
            return date ? moment(date).format() : date;
        }

        protected getIsAuthenticatedForSubmitFailed(error: any): void {
        }

        protected submitCompleted(cart: CartModel, submitSuccessUri: string): void {
            this.cart.id = cart.id;
            this.coreService.redirectToPathAndRefreshPage(`${submitSuccessUri}?cartid=${this.cart.id}`);
        }

        protected submitFailed(error: any): void {
            if (this.useTokenExGateway && this.cart.showCreditCard && this.cart.paymentMethod.isCreditCard) {
                this.tokenExIframe.reset();
            }

            if (this.manyAttemptsError === error.message) {
                this.coreService.displayModal(angular.element("#userLocked"), () => {
                    this.sessionService.signOut().then(
                        () => {
                            this.signOutCompleted();
                        },
                        (error: any) => {
                            this.signOutFailed(error);
                        },
                    );
                });
            }

            this.submitting = false;
            this.cart.paymentOptions.isPayPal = false;
            this.submitErrorMessage = error.message;
            this.spinnerService.hide();
        }

        protected signOutFailed(error: any): void {
        }

        protected signOutCompleted(): void {
            this.coreService.redirectToSignIn(false);
        }

        submitPaypal(returnUri: string, signInUri: string): void {
            this.submitErrorMessage = "";
            this.cart.paymentOptions.isPayPal = true;

            setTimeout(() => {
                if (!this.validateReviewAndPayForm()) {
                    this.cart.paymentOptions.isPayPal = false;
                    return;
                }

                this.sessionService.getIsAuthenticated().then(
                    (isAuthenticated: boolean) => {
                        this.getIsAuthenticatedForSubmitPaypalCompleted(isAuthenticated, returnUri, signInUri);
                    },
                    (error: any) => {
                        this.getIsAuthenticatedForSubmitPaypalFailed(error);
                    });
            }, 0);
        }

        protected getIsAuthenticatedForSubmitPaypalCompleted(isAuthenticated: boolean, returnUri: string, signInUri: string): void {
            if (!isAuthenticated) {
                this.coreService.redirectToPath(`${signInUri}?returnUrl=${this.coreService.getCurrentPath()}`);
                return;
            }

            this.spinnerService.show("mainLayout", true);
            this.cart.paymentOptions.isPayPal = true;
            this.cart.paymentOptions.payPalPaymentUrl = this.$window.location.host + returnUri + this.cartIdParam;
            this.cart.paymentMethod = null;
            this.cart.status = "PaypalSetup";
            this.cartService.updateCart(this.cart, true).then(
                (cart: CartModel) => {
                    this.submitPaypalCompleted(cart);
                },
                (error: any) => {
                    this.submitPaypalFailed(error);
                });
        }

        protected getIsAuthenticatedForSubmitPaypalFailed(error: any): void {
            this.cart.paymentOptions.isPayPal = false;
        }

        protected submitPaypalCompleted(cart: CartModel): void {
            // full redirect to paypal
            this.$window.location.href = cart.paymentOptions.payPalPaymentUrl;
        }

        protected submitPaypalFailed(error: any): void {
            this.cart.paymentOptions.isPayPal = false;
            this.submitErrorMessage = error.message;
            this.spinnerService.hide();
        }

        protected validateReviewAndPayForm(): boolean {
            const valid = jQuery("#reviewAndPayForm").validate().form();
            if (!valid) {
                if (this.useTokenExGateway &&
                    this.cart.showCreditCard &&
                    this.cart.paymentMethod.isCreditCard &&
                    !this.cart.paymentOptions.isPayPal &&
                    this.cart.paymentMethod &&
                    !this.cart.paymentMethod.isECheck &&
                    this.tokenExIframe
                ) {
                    this.tokenExIframe.validate();
                }
                this.scrollToTopOfForm();
                return false;
            }

            return true;
        }

        protected scrollToTopOfForm(): void {
            jQuery("html, body").animate({
                scrollTop: jQuery("#reviewAndPayForm").offset().top
            }, 300);
        }

        applyPromotion(): void {
            this.promotionAppliedMessage = "";
            this.promotionErrorMessage = "";

            this.promotionService.applyCartPromotion(this.cartId, this.promotionCode).then(
                (promotion: PromotionModel) => {
                    this.applyPromotionCompleted(promotion);
                },
                (error: any) => {
                    this.applyPromotionFailed(error);
                });
        }

        protected applyPromotionCompleted(promotion: PromotionModel): void {
            if (promotion.promotionApplied) {
                this.promotionAppliedMessage = promotion.message;
            } else {
                this.promotionErrorMessage = promotion.message;
            }

            this.getCart();
        }

        protected applyPromotionFailed(error: any): void {
            this.promotionErrorMessage = error.message;
            this.getCart();
        }

        setUpTokenExGateway(): void {
            if (!this.useTokenExGateway) {
                return;
            }

            this.settingsService.getTokenExConfig().then(
                (tokenExDto: TokenExDto) => {
                    this.getTokenExConfigCompleted(tokenExDto);
                },
                (error: any) => {
                    this.getTokenExConfigFailed(error);
                });
        }

        protected getTokenExConfigCompleted(tokenExDto: TokenExDto) {
            this.setUpTokenExIframe(tokenExDto);
        }

        protected setUpTokenExIframe(tokenExDto: TokenExDto) {
            this.tokenExIframe = new TokenEx.Iframe("tokenExCardNumber", this.getTokenExIframeConfig(tokenExDto));

            this.tokenExIframe.load();

            this.tokenExIframe.on("tokenize", (data) => {
                this.$scope.$apply(() => {
                    this.cart.paymentOptions.creditCard.cardNumber = data.token;
                    this.cart.paymentOptions.creditCard.securityCode = "CVV";
                    this.submitCart();
                });
            });

            this.tokenExIframe.on("validate", (data) => {
                this.$scope.$apply(() => {
                    this.isRequiredCardNumber = false;
                    this.isInvalidCardNumber = false;
                    if (!data.isValid && data.validator) {
                        if (data.validator === "required") {
                            this.isRequiredCardNumber = true;
                        } else {
                            this.isInvalidCardNumber = true;
                        }
                    }

                    this.isRequiredSecurityCode = false;
                    this.isInvalidSecurityCode = false;
                    if (!data.isCvvValid && data.cvvValidator) {
                        if (data.cvvValidator === "required") {
                            this.isRequiredSecurityCode = true;
                        } else {
                            this.isInvalidSecurityCode = true;
                        }
                    }

                    if (this.submitting && (!data.isValid || !data.isCvvValid)) {
                        this.submitting = false;
                        this.spinnerService.hide();
                    }
                });
            });

            this.tokenExIframe.on("error", () => {
                this.$scope.$apply(() => {
                    // if there was some sort of unknown error from tokenex tokenization (the example they gave was authorization timing out)
                    // try to completely re-initialize the tokenex iframe
                    this.setUpTokenExGateway();
                });
            });
        }

        protected setUpECheckAccountNumberTokenExIframe(tokenExDto: TokenExDto) {
            this.tokenExAccountNumberIframe = new TokenEx.Iframe("tokenExAccountNumber", this.getECheckAccountNumberTokenExIframeConfig(tokenExDto));

            this.tokenExAccountNumberIframe.load();

            this.tokenExAccountNumberIframe.on("tokenize", (data) => {
                this.$scope.$apply(() => {
                    this.cart.paymentOptions.eCheck.accountNumber = data.token;
                    this.tokenExRoutingNumberIframe.tokenize();
                });
            });

            this.tokenExAccountNumberIframe.on("validate", (data) => {
                this.$scope.$apply(() => {
                    if (data.isValid) {
                        this.isInvalidAccountNumber = false;
                    } else if (this.submitting || data.validator && data.validator !== "required") {
                        this.isInvalidAccountNumber = true;
                    }

                    if (this.submitting && (this.isInvalidAccountNumber || this.isInvalidRoutingNumber)) {
                        this.submitting = false;
                        this.spinnerService.hide();
                    }
                });
            });

            this.tokenExAccountNumberIframe.on("error", () => {
                this.$scope.$apply(() => {
                    // if there was some sort of unknown error from tokenex tokenization (the example they gave was authorization timing out)
                    // try to completely re-initialize the tokenex iframe
                    this.setUpECheckTokenExGateway();
                });
            });
        }

        protected setUpECheckRoutingNumberTokenExIframe(tokenExDto: TokenExDto) {
            this.tokenExRoutingNumberIframe = new TokenEx.Iframe("tokenExRoutingNumber", this.getECheckRoutingNumberTokenExIframeConfig(tokenExDto));

            this.tokenExRoutingNumberIframe.load();

            this.tokenExRoutingNumberIframe.on("tokenize", (data) => {
                this.$scope.$apply(() => {
                    this.cart.paymentOptions.eCheck.routingNumber = data.token;
                    if (this.cart.paymentOptions.eCheck.accountNumber) {
                        this.submitCart();
                    }
                });
            });

            this.tokenExRoutingNumberIframe.on("validate", (data) => {
                this.$scope.$apply(() => {
                    if (data.isValid) {
                        this.isInvalidRoutingNumber = false;
                    } else if (this.submitting || data.validator && data.validator !== "required") {
                        this.isInvalidRoutingNumber = true;
                    }

                    if (this.submitting && (this.isInvalidAccountNumber || this.isInvalidRoutingNumber)) {
                        this.submitting = false;
                        this.spinnerService.hide();
                    }
                });
            });

            this.tokenExRoutingNumberIframe.on("error", () => {
                this.$scope.$apply(() => {
                    // if there was some sort of unknown error from tokenex tokenization (the example they gave was authorization timing out)
                    // try to completely re-initialize the tokenex iframe
                    this.setUpECheckTokenExGateway();
                });
            });
        }

        protected getTokenExConfigFailed(error: any): void {
        }

        protected getTokenExIframeConfig(tokenExDto: TokenExDto): any {
            return {
                origin: tokenExDto.origin,
                timestamp: tokenExDto.timestamp,
                tokenExID: tokenExDto.tokenExId,
                tokenScheme: tokenExDto.tokenScheme,
                authenticationKey: tokenExDto.authenticationKey,
                styles: {
                    base: "font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 14px;line-height: 30px;height: 2.7em;box-sizing: border-box;-moz-box-sizing: border-box;",
                    focus: "box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;",
                    error: "box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);",
                    cvv: {
                        base: "font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 14px;line-height: 30px;height: 2.7em;box-sizing: border-box;-moz-box-sizing: border-box;",
                        focus: "box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;",
                        error: "box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);",
                    }
                },
                pci: true,
                enableValidateOnBlur: true,
                inputType: "text",
                enablePrettyFormat: true,
                cvv: true,
                cvvContainerID: "tokenExSecurityCode",
                cvvInputType: "text"
            };
        }

        setUpPPTokenExGateway(): void {
            if (!this.useTokenExGateway) {
                return;
            }

            this.ppTokenExIframeIsLoaded = false;

            this.settingsService.getTokenExConfig(this.cart.paymentMethod.name).then(
                (tokenExDto: TokenExDto) => {
                    this.getTokenExConfigForCVVOnlyCompleted(tokenExDto);
                },
                (error: any) => {
                    this.getTokenExConfigForCVVOnlyFailed(error);
                });
        }

        protected getTokenExConfigForCVVOnlyCompleted(tokenExDto: TokenExDto) {
            this.setUpPPTokenExIframe(tokenExDto);
        }

        protected setUpPPTokenExIframe(tokenExDto: TokenExDto) {
            if (!this.useTokenExGateway) {
                return;
            }

            if (this.ppTokenExIframe) {
                this.ppTokenExIframe.remove();
            }

            this.ppTokenExIframe = new TokenEx.Iframe("ppTokenExSecurityCode", this.getPPTokenExIframeConfig(tokenExDto));

            this.ppTokenExIframe.load();

            this.ppTokenExIframe.on("load", () => {
                this.$scope.$apply(() => {
                    this.ppTokenExIframeIsLoaded = true;
                    this.ppIsInvalidSecurityCode = false;
                });
            });

            this.ppTokenExIframe.on("tokenize", () => {
                this.$scope.$apply(() => {
                    this.submitCart();
                });
            });

            this.ppTokenExIframe.on("validate", (data) => {
                this.$scope.$apply(() => {
                    this.ppIsRequiredSecurityCode = false;
                    this.ppIsInvalidSecurityCode = false;
                    if (!data.isValid && data.validator) {
                        if (data.validator === "required") {
                            this.ppIsRequiredSecurityCode = true;
                        } else {
                            this.ppIsInvalidSecurityCode = true;
                        }
                    }

                    if (this.submitting && !data.isValid) {
                        this.submitting = false;
                        this.spinnerService.hide();
                    }
                });
            });

            this.ppTokenExIframe.on("error", () => {
                this.$scope.$apply(() => {
                    // if there was some sort of unknown error from tokenex tokenization (the example they gave was authorization timing out)
                    // try to completely re-initialize the tokenex iframe
                    this.setUpPPTokenExGateway();
                });
            });
        }

        protected getTokenExConfigForCVVOnlyFailed(error: any): void {
        }

        protected getPPTokenExIframeConfig(tokenExDto: TokenExDto): any {
            return {
                origin: tokenExDto.origin,
                timestamp: tokenExDto.timestamp,
                tokenExID: tokenExDto.tokenExId,
                token: this.cart.paymentMethod.name,
                tokenScheme: this.cart.paymentMethod.tokenScheme,
                authenticationKey: tokenExDto.authenticationKey,
                styles: {
                    base: "font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 14px;line-height: 30px;height: 2.7em;box-sizing: border-box;-moz-box-sizing: border-box;",
                    focus: "box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;",
                    error: "box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);",
                    cvv: {
                        base: "font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 14px;line-height: 30px;height: 2.7em;box-sizing: border-box;-moz-box-sizing: border-box;",
                        focus: "box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;",
                        error: "box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);",
                    }
                },
                enableValidateOnBlur: true,
                cvv: true,
                cvvOnly: true,
                inputType: "text",
                cardType: this.getValidTokenExCardType(this.cart.paymentMethod.cardType)
            };
        }

        private getValidTokenExCardType(cardType: string): string {
            cardType = cardType.toLowerCase();
            if (cardType === "visa") {
                return cardType;
            } else if (cardType === "mastercard") {
                return "masterCard";
            } else if (cardType === "discover") {
                return cardType;
            } else if (cardType.indexOf("american") > -1) {
                return "americanExpress";
            } else {
                return cardType;
            }
        }

        setUpECheckTokenExGateway(): void {
            if (!this.useECheckTokenExGateway) {
                return;
            }

            this.settingsService.getTokenExConfig(null, true).then(
                (tokenExDto) => this.getECheckTokenExConfigCompleted(tokenExDto),
                (error) => this.getECheckTokenExConfigFailed(error));
        }

        protected getECheckTokenExConfigCompleted(tokenExDto: TokenExDto) {
            this.setUpECheckAccountNumberTokenExIframe(tokenExDto);
            this.setUpECheckRoutingNumberTokenExIframe(tokenExDto);
        }

        protected getECheckTokenExConfigFailed(error: any): void {
        }

        protected getECheckAccountNumberTokenExIframeConfig(tokenExDto: TokenExDto): any {
            return {
                origin: tokenExDto.origin,
                timestamp: tokenExDto.timestamp,
                tokenExID: tokenExDto.tokenExId,
                tokenScheme: tokenExDto.tokenScheme,
                authenticationKey: tokenExDto.authenticationKey,
                styles: {
                    base: "font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 14px;line-height: 30px;height: 2.7em;box-sizing: border-box;-moz-box-sizing: border-box;",
                    focus: "box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;",
                    error: "box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);"
                },
                pci: false,
                enableValidateOnBlur: true,
                inputType: "text"
            };
        }

        protected getECheckRoutingNumberTokenExIframeConfig(tokenExDto: TokenExDto): any {
            return {
                origin: tokenExDto.origin,
                timestamp: tokenExDto.timestamp,
                tokenExID: tokenExDto.tokenExId,
                tokenScheme: tokenExDto.tokenScheme,
                authenticationKey: tokenExDto.authenticationKey,
                styles: {
                    base: "font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 14px;line-height: 30px;height: 2.7em;box-sizing: border-box;-moz-box-sizing: border-box;",
                    focus: "box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;",
                    error: "box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);"
                },
                pci: false,
                enableValidateOnBlur: true,
                inputType: "text"
            };
        }

        /**
         * Setup Paymetric Gateway
         * */
        setUpPaymetricGateway(): void {
            if (!this.usePaymetricGateway || !this.cart.paymentMethod || !this.cart.paymentMethod.isCreditCard) {
                return;
            }
            // Reset the frame, Paymetric could init against an already existing iFrame.
            $("#paymetricIframe").attr("src", "");

            this.settingsService.getPaymetricConfig().then(
                (paymetricDto: PaymetricDto) => {
                    this.getPaymetricConfigCompleted(paymetricDto);
                },
                (error: any) => {
                    this.getPaymetricConfigFailed(error);
                });
        }

        protected getPaymetricConfigCompleted(paymetricDto: PaymetricDto) {
            this.paymetricDto = paymetricDto;
            this.setUpPaymetricIframe(paymetricDto);
        }

        protected setUpPaymetricIframe(paymetricDto: PaymetricDto) {
            $("#paymetricIframe").attr("src", paymetricDto.message).on("load", () => {
                // After the IFrame finishes loading, setup the Paymetric IFrame.
                this.paymetricIframe = $XIFrame(this.getPaymetricIframeConfig(paymetricDto));
                this.paymetricIframe.onload();
            });
        }

        protected getPaymetricConfigFailed(_: any): void {
        }

        protected getPaymetricIframeConfig(paymetricDto: PaymetricDto): any {
            return {
                iFrameId: "paymetricIframe",
                targetUrl: paymetricDto.message,
                autosizewidth: false,
                autosizeheight: true,
            };
        }

        protected submitPaymetric() {
            if (!this.paymetricIframe) {
                return;
            }
            this.paymetricIframe.validate({
                onValidate: (success) => {
                    this.handlePaymetricValidateSuccess(success);
                },
                onError: () => {
                    this.spinnerService.hide();
                    this.submitting = false;
                },
            });
        }

        protected handlePaymetricValidateSuccess(success: boolean) {
            if (success) {
                this.paymetricIframe.submit({
                    onSuccess: (msg) => {
                        var message = JSON.parse(msg);
                        // The HasPassed is case sensitive, and not starndard json.
                        if (message.data.HasPassed) {
                            this.handleSuccessSubmitPaymetricIframe();
                        }
                    },
                    onError: (msg) => {
                        var message = JSON.parse(msg);
                        // Code = 150 -> Already submitted
                        if (message.data.Code === 150) {
                            this.handleSuccessSubmitPaymetricIframe();
                            return;
                        }
                        // Unlock Cart, error on submit of Paymetric
                        this.spinnerService.hide();
                        this.scrollToTopOfForm();
                        this.submitting = false;
                    },
                });
            } else {
                // Unlock Cart
                // Paymetric should be showing error messages.
                this.spinnerService.hide();
                this.scrollToTopOfForm();
                this.submitting = false;
            }
        }

        protected handleSuccessSubmitPaymetricIframe() {

            this.$http({
                method: "GET",
                url: `api/v1/paymetric/responsepacket?accessToken=${this.paymetricDto.accessToken}`
            }).then((result: ng.IHttpPromiseCallbackArg<{ success: boolean; message: string, creditCard: CreditCardDto }>) => {
                // Success
                if (!result.data.success) {
                    this.spinnerService.hide();
                    this.scrollToTopOfForm();
                    this.submitting = false;
                    return;
                }
                // Set result with CC details 
                this.cart.paymentOptions.creditCard.cardType = this.convertPaymetricCardType(result.data.creditCard.cardType);
                this.cart.paymentOptions.creditCard.expirationMonth = result.data.creditCard.expirationMonth;
                this.cart.paymentOptions.creditCard.expirationYear = result.data.creditCard.expirationYear;
                this.cart.paymentOptions.creditCard.cardNumber = result.data.creditCard.cardNumber;
                this.cart.paymentOptions.creditCard.securityCode = result.data.creditCard.securityCode;
                this.cart.paymentOptions.creditCard.cardHolderName = result.data.creditCard.cardHolderName;
                this.submitCart();
            }, () => {
                // Error
                this.spinnerService.hide();
                this.scrollToTopOfForm();
                this.submitting = false;
            });
        }

        private convertPaymetricCardType(cardType: string): string {
            switch (cardType.toLowerCase()) {
                case "vi":
                    return "Visa";
                case "mc":
                    return "MasterCard";
                case "ax":
                    return "American Express";
                case "dc":
                    return "Diner's";
                case "di":
                    return "Discover";
                case "jc":
                    return "JCB";
                case "sw":
                    return "Maestro";
                default:
                    return "unknown";
            }
        }

        protected openDeliveryMethodPopup() {
            this.deliveryMethodPopupService.display({
                session: this.session
            });
        }

        protected openWarehouseSelectionModal(): void {
            this.selectPickUpLocationPopupService.display({
                session: this.session,
                updateSessionOnSelect: true,
                selectedWarehouse: this.session.pickUpWarehouse,
                onSelectWarehouse: (warehouse: WarehouseModel, onSessionUpdate?: Function) => this.updateSession(warehouse, onSessionUpdate)
            });
        }

        updateSession(warehouse: WarehouseModel, onSessionUpdate?: Function): void {
            const session = {} as SessionModel;
            session.pickUpWarehouse = warehouse;
            this.sessionService.updateSession(session).then(
                (updatedSession: SessionModel) => { this.updateSessionCompleted(updatedSession, onSessionUpdate); },
                (error: any) => { this.updateSessionFailed(error); });
        }

        protected updateSessionCompleted(session: SessionModel, onSessionUpdate?: Function): void {
            this.session = session;
            if (angular.isFunction(onSessionUpdate)) {
                onSessionUpdate();
            }
        }

        protected updateSessionFailed(error: any): void {
        }

        protected isOpenedFromCmsShell() {
            let url = window.location !== window.parent.location ? document.referrer : document.location.href;
            return url.toLowerCase().indexOf("/contentadmin") !== -1;
        }
    }

    angular
        .module("insite")
        .controller("ReviewAndPayController", ReviewAndPayController);
}
