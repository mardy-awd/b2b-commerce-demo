﻿  
 
 
 



declare module Insite.Account.WebApi.V1.ApiModels {
	interface AccountModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		email: string;
		userName: string;
		password: string;
		isSubscribed: boolean;
		isGuest: boolean;
		canApproveOrders: boolean;
		canViewApprovalOrders: boolean;
		billToId: System.Guid;
		shipToId: System.Guid;
		firstName: string;
		lastName: string;
		role: string;
		roleTranslated: string;
		vmiRole: string;
		vmiRoleTranslated: string;
		approver: string;
		isApproved: boolean;
		activationStatus: string;
		lastLoginOn: Date;
		availableApprovers: string[];
		availableRoles: string[];
		availableRolesTranslated: {[key: string]:  string};
		requiresActivation: boolean;
		setDefaultCustomer: boolean;
		defaultCustomerId: System.Guid;
		defaultFulfillmentMethod: string;
		defaultWarehouseId: System.Guid;
		defaultWarehouse: Insite.Catalog.WebApi.V1.ApiModels.WarehouseModel;
		accessToken: string;
	}
	interface AccountSettingsModel extends Insite.Core.WebApi.BaseModel {
		allowCreateAccount: boolean;
		allowGuestCheckout: boolean;
		allowSubscribeToNewsLetter: boolean;
		requireSelectCustomerOnSignIn: boolean;
		passwordMinimumLength: number;
		passwordMinimumRequiredLength: number;
		passwordRequiresSpecialCharacter: boolean;
		passwordRequiresUppercase: boolean;
		passwordRequiresLowercase: boolean;
		passwordRequiresDigit: boolean;
		rememberMe: boolean;
		daysToRetainUser: number;
		useEmailAsUserName: boolean;
		enableWarehousePickup: boolean;
	}
	interface AccountCollectionModel extends Insite.Core.WebApi.BaseModel {
		accounts: Insite.Account.WebApi.V1.ApiModels.AccountModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
	interface AccountPaymentProfileModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		description: string;
		cardType: string;
		expirationDate: string;
		maskedCardNumber: string;
		cardIdentifier: string;
		cardHolderName: string;
		address1: string;
		address2: string;
		address3: string;
		address4: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
		isDefault: boolean;
		tokenScheme: string;
	}
	interface AccountPaymentProfileCollectionModel extends Insite.Core.WebApi.BaseModel {
		accountPaymentProfiles: Insite.Account.WebApi.V1.ApiModels.AccountPaymentProfileModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
	interface SessionModel extends Insite.Core.WebApi.BaseModel {
		isAuthenticated: boolean;
		hasRfqUpdates: boolean;
		userName: string;
		userProfileId: System.Guid;
		userLabel: string;
		userRoles: string;
		userRolesTranslated: string;
		email: string;
		password: string;
		newPassword: string;
		resetPassword: boolean;
		activateAccount: boolean;
		resetToken: string;
		displayChangeCustomerLink: boolean;
		redirectToChangeCustomerPageOnSignIn: boolean;
		billTo: Insite.Customers.WebApi.V1.ApiModels.BillToModel;
		shipTo: Insite.Customers.WebApi.V1.ApiModels.ShipToModel;
		language: Insite.Websites.WebApi.V1.ApiModels.LanguageModel;
		currency: Insite.Websites.WebApi.V1.ApiModels.CurrencyModel;
		deviceType: string;
		persona: string;
		personas: Insite.Account.WebApi.V1.ApiModels.PersonaModel[];
		dashboardIsHomepage: boolean;
		isSalesPerson: boolean;
		customLandingPage: string;
		hasDefaultCustomer: boolean;
		rememberMe: boolean;
		isRestrictedProductRemovedFromCart: boolean;
		firstName: string;
		lastName: string;
		customerWasUpdated: boolean;
		isGuest: boolean;
		isRestrictedProductExistInCart: boolean;
		pickUpWarehouse: Insite.Catalog.WebApi.V1.ApiModels.WarehouseModel;
		fulfillmentMethod: string;
		cartReminderUnsubscribeToken: string;
		cartReminderUnsubscribeEmail: string;
		displayMyAccountMenu: boolean;
	}
	interface PersonaModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		description: string;
		isDefault: boolean;
	}
	interface AccountShipToCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		userShipToCollection: Insite.Account.WebApi.V1.ApiModels.AccountShipToModel[];
		costCodeCollection: Insite.Account.Services.Dtos.CustomerCostCodeDto[];
	}
	interface AccountShipToModel {
		shipToNumber: string;
		city: string;
		state: string;
		address: string;
		assign: boolean;
		isDefaultShipTo: boolean;
		costCode: string;
		id: System.Guid;
	}
	interface VmiUserImportCollectionModel extends Insite.Core.WebApi.BaseModel {
		vmiUsers: Insite.Account.WebApi.V1.ApiModels.VmiUserImportModel[];
	}
	interface VmiUserImportModel extends Insite.Core.WebApi.BaseModel {
		userId: System.Guid;
		vmiLocationNames: string[];
		vmiRoles: string[];
	}
	interface VmiUserModel extends Insite.Core.WebApi.BaseModel {
		userId: System.Guid;
		role: string;
		vmiLocationIds: System.Guid[];
		removeVmiPermissions: boolean;
	}
}
declare module Insite.Core.WebApi {
	interface BaseModel {
		uri: string;
		properties: {[key: string]:  string};
	}
	interface PaginationModel {
		currentPage: number;
		page: number;
		pageSize: number;
		defaultPageSize: number;
		totalItemCount: number;
		numberOfPages: number;
		pageSizeOptions: number[];
		sortOptions: Insite.Core.WebApi.SortOptionModel[];
		sortType: string;
		nextPageUri: string;
		prevPageUri: string;
	}
	interface SortOptionModel {
		displayName: string;
		sortType: string;
	}
	interface BaseParameter {
	}
}
declare module System.Collections.Generic {
	interface KeyValuePair<TKey, TValue> {
		key: TKey;
		value: TValue;
	}
}
declare module System {
	interface Guid {
	}
}
declare module Insite.Catalog.WebApi.V1.ApiModels {
	interface WarehouseModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		address1: string;
		address2: string;
		city: string;
		contactName: string;
		countryId: System.Guid;
		deactivateOn: Date;
		description: string;
		phone: string;
		postalCode: string;
		shipSite: string;
		state: string;
		isDefault: boolean;
		alternateWarehouses: Insite.Catalog.WebApi.V1.ApiModels.WarehouseModel[];
		latitude: number;
		longitude: number;
		hours: string;
		distance: number;
		allowPickup: boolean;
		pickupShipViaId: System.Guid;
	}
	interface AutocompleteModel extends Insite.Core.WebApi.BaseModel {
		categories: Insite.Catalog.WebApi.V1.ApiModels.AutocompleteItemModel[];
		products: Insite.Catalog.WebApi.V1.ApiModels.ProductAutocompleteItemModel[];
		content: Insite.Catalog.WebApi.V1.ApiModels.AutocompleteItemModel[];
		brands: Insite.Catalog.WebApi.V1.ApiModels.BrandAutocompleteModel[];
	}
	interface AutocompleteItemModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		image: string;
		subtitle: string;
		title: string;
		url: string;
	}
	interface ProductAutocompleteItemModel extends Insite.Catalog.WebApi.V1.ApiModels.AutocompleteItemModel {
		manufacturerItemNumber: string;
		name: string;
		isNameCustomerOverride: boolean;
		erpNumber: string;
		brandName: string;
		brandDetailPagePath: string;
		styleParentId: System.Guid;
	}
	interface BrandAutocompleteModel extends Insite.Catalog.WebApi.V1.ApiModels.AutocompleteItemModel {
		productLineName: string;
		productLineId: System.Guid;
	}
	interface ProductModel extends Insite.Core.WebApi.BaseModel {
		product: Insite.Catalog.Services.Dtos.ProductDto;
	}
	interface ProductCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		products: Insite.Catalog.Services.Dtos.ProductDto[];
		categoryFacets: Insite.Core.Plugins.Search.Dtos.CategoryFacetDto[];
		attributeTypeFacets: Insite.Core.Plugins.Search.Dtos.AttributeTypeFacetDto[];
		brandFacets: Insite.Core.Plugins.Search.Dtos.GenericFacetDto[];
		productLineFacets: Insite.Core.Plugins.Search.Dtos.GenericFacetDto[];
		didYouMeanSuggestions: Insite.Core.Plugins.Search.Dtos.SuggestionDto[];
		priceRange: Insite.Core.Plugins.Search.Dtos.PriceRangeDto;
		exactMatch: boolean;
		notAllProductsFound: boolean;
		notAllProductsAllowed: boolean;
		originalQuery: string;
		correctedQuery: string;
		searchTermRedirectUrl: string;
	}
	interface AutocompleteProductModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		erpNumber: string;
		shortDescription: string;
		productDetailUrl: string;
		smallImagePath: string;
	}
	interface AutocompleteProductCollectionModel extends Insite.Core.WebApi.BaseModel {
		products: Insite.Catalog.WebApi.V1.ApiModels.AutocompleteProductModel[];
	}
	interface CrossSellCollectionModel extends Insite.Core.WebApi.BaseModel {
		products: Insite.Catalog.Services.Dtos.ProductDto[];
	}
	interface CatalogPageModel extends Insite.Core.WebApi.BaseModel {
		category: Insite.Catalog.WebApi.V1.ApiModels.CategoryModel;
		brandId: System.Guid;
		productLineId: System.Guid;
		productId: System.Guid;
		productName: string;
		title: string;
		metaDescription: string;
		metaKeywords: string;
		canonicalPath: string;
		alternateLanguageUrls: {[key: string]:  string};
		isReplacementProduct: boolean;
		breadCrumbs: Insite.Catalog.WebApi.V1.ApiModels.BreadCrumbModel[];
		obsoletePath: boolean;
		needRedirect: boolean;
		redirectUrl: string;
		primaryImagePath: string;
		openGraphTitle: string;
		openGraphImage: string;
		openGraphUrl: string;
		enableStructuredPageData: boolean;
	}
	interface CategoryModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		shortDescription: string;
		urlSegment: string;
		smallImagePath: string;
		largeImagePath: string;
		imageAltText: string;
		activateOn: Date;
		deactivateOn: Date;
		metaKeywords: string;
		metaDescription: string;
		htmlContent: string;
		sortOrder: number;
		isFeatured: boolean;
		isDynamic: boolean;
		subCategories: Insite.Catalog.WebApi.V1.ApiModels.CategoryModel[];
		path: string;
		mobileBannerImageUrl: string;
		mobilePrimaryText: string;
		mobileSecondaryText: string;
		mobileTextJustification: string;
		mobileTextColor: string;
	}
	interface BreadCrumbModel {
		text: string;
		url: string;
		categoryId: string;
	}
	interface CategoryCollectionModel extends Insite.Core.WebApi.BaseModel {
		categories: Insite.Catalog.WebApi.V1.ApiModels.CategoryModel[];
	}
	interface ProductAvailabilityModel extends Insite.Core.WebApi.BaseModel {
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
	}
	interface ProductPriceModel extends Insite.Core.WebApi.BaseModel {
		productId: System.Guid;
		isOnSale: boolean;
		requiresRealTimePrice: boolean;
		quoteRequired: boolean;
		additionalResults: {[key: string]:  string};
		unitCost: number;
		unitCostDisplay: string;
		unitListPrice: number;
		unitListPriceDisplay: string;
		extendedUnitListPrice: number;
		extendedUnitListPriceDisplay: string;
		unitRegularPrice: number;
		unitRegularPriceDisplay: string;
		extendedUnitRegularPrice: number;
		extendedUnitRegularPriceDisplay: string;
		unitNetPrice: number;
		unitNetPriceDisplay: string;
		extendedUnitNetPrice: number;
		extendedUnitNetPriceDisplay: string;
		unitOfMeasure: string;
		vatRate: number;
		vatAmount: number;
		vatAmountDisplay: string;
		unitListBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		unitRegularBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		regularPrice: number;
		regularPriceDisplay: string;
		extendedRegularPrice: number;
		extendedRegularPriceDisplay: string;
		actualPrice: number;
		actualPriceDisplay: string;
		extendedActualPrice: number;
		extendedActualPriceDisplay: string;
		regularBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		actualBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
	}
	interface ProductSettingsModel extends Insite.Core.WebApi.BaseModel {
		allowBackOrder: boolean;
		allowBackOrderForDelivery: boolean;
		allowBackOrderForPickup: boolean;
		showInventoryAvailability: boolean;
		showAddToCartConfirmationDialog: boolean;
		enableProductComparisons: boolean;
		alternateUnitsOfMeasure: boolean;
		thirdPartyReviews: string;
		defaultViewType: string;
		showSavingsAmount: boolean;
		showSavingsPercent: boolean;
		realTimePricing: boolean;
		realTimeInventory: boolean;
		inventoryIncludedWithPricing: boolean;
		storefrontAccess: string;
		canShowPriceFilters: boolean;
		canSeeProducts: boolean;
		canSeePrices: boolean;
		canAddToCart: boolean;
		pricingService: string;
		displayAttributesInTabs: boolean;
		attributesTabSortOrder: string;
		displayDocumentsInTabs: boolean;
		documentsTabSortOrder: string;
		displayInventoryPerWarehouse: boolean;
		displayInventoryPerWarehouseOnlyOnProductDetail: boolean;
		displayFacetsForStockedItems: boolean;
		imageProvider: string;
		catalogUrlPath: string;
		enableVat: boolean;
		vatPriceDisplay: string;
	}
	interface WarehouseCollectionModel extends Insite.Core.WebApi.BaseModel {
		warehouses: Insite.Catalog.WebApi.V1.ApiModels.WarehouseModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
		distanceUnitOfMeasure: string;
		defaultLatitude: number;
		defaultLongitude: number;
		defaultRadius: number;
	}
	interface VmiLocationCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		vmiLocations: Insite.Catalog.WebApi.V1.ApiModels.VmiLocationModel[];
	}
	interface VmiLocationModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		billToId: System.Guid;
		useBins: boolean;
		isPrimaryLocation: boolean;
		shipToId: System.Guid;
		customer: Insite.Customers.WebApi.V1.ApiModels.BaseAddressModel;
		customerLabel: string;
		note: string;
	}
	interface VmiBinCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		vmiBins: Insite.Catalog.WebApi.V1.ApiModels.VmiBinModel[];
	}
	interface VmiBinModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		vmiLocationId: System.Guid;
		binNumber: string;
		productId: System.Guid;
		minimumQty: number;
		maximumQty: number;
		lastCountDate: Date;
		lastCountQty: number;
		lastCountUserName: string;
		previousCountDate: Date;
		previousCountQty: number;
		previousCountUserName: string;
		lastOrderDate: Date;
		product: Insite.Catalog.Services.Dtos.ProductDto;
		lastOrderErpOrderNumber: string;
		lastOrderWebOrderNumber: string;
	}
	interface VmiBinCountModel extends Insite.Core.WebApi.BaseModel {
		count: number;
	}
	interface VmiCountCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		binCounts: Insite.Catalog.WebApi.V1.ApiModels.VmiCountModel[];
	}
	interface VmiCountModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		vmiBinId: System.Guid;
		productId: System.Guid;
		count: number;
		createdOn: Date;
		createdBy: string;
	}
}
declare module Insite.Customers.WebApi.V1.ApiModels {
	interface BillToModel extends Insite.Customers.WebApi.V1.ApiModels.BaseAddressModel {
		shipTosUri: string;
		isGuest: boolean;
		label: string;
		budgetEnforcementLevel: string;
		costCodeTitle: string;
		customerCurrencySymbol: string;
		costCodes: Insite.Customers.WebApi.V1.ApiModels.CostCodeModel[];
		shipTos: Insite.Customers.WebApi.V1.ApiModels.ShipToModel[];
		validation: Insite.Customers.Services.Dtos.CustomerValidationDto;
		isDefault: boolean;
		accountsReceivable: Insite.Customers.Services.Dtos.AccountsReceivableDto;
	}
	interface BaseAddressModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		customerNumber: string;
		customerSequence: string;
		customerName: string;
		firstName: string;
		lastName: string;
		contactFullName: string;
		companyName: string;
		attention: string;
		address1: string;
		address2: string;
		address3: string;
		address4: string;
		city: string;
		postalCode: string;
		state: Insite.Websites.WebApi.V1.ApiModels.StateModel;
		country: Insite.Websites.WebApi.V1.ApiModels.CountryModel;
		phone: string;
		fullAddress: string;
		email: string;
		fax: string;
		isVmiLocation: boolean;
	}
	interface CostCodeModel {
		id: System.Guid;
		costCode: string;
		description: string;
		isActive: boolean;
	}
	interface ShipToModel extends Insite.Customers.WebApi.V1.ApiModels.BaseAddressModel {
		isNew: boolean;
		oneTimeAddress: boolean;
		label: string;
		validation: Insite.Customers.Services.Dtos.CustomerValidationDto;
		isDefault: boolean;
	}
	interface CustomerSettingsModel extends Insite.Core.WebApi.BaseModel {
		allowBillToAddressEdit: boolean;
		allowShipToAddressEdit: boolean;
		allowCreateNewShipToAddress: boolean;
		billToCompanyRequired: boolean;
		billToFirstNameRequired: boolean;
		billToLastNameRequired: boolean;
		shipToCompanyRequired: boolean;
		shipToFirstNameRequired: boolean;
		shipToLastNameRequired: boolean;
		budgetsFromOnlineOnly: boolean;
		billToStateRequired: boolean;
		shipToStateRequired: boolean;
		displayAccountsReceivableBalances: boolean;
		allowOneTimeAddresses: boolean;
	}
	interface BillToCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		billTos: Insite.Customers.WebApi.V1.ApiModels.BillToModel[];
	}
	interface ShipToCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		shipTos: Insite.Customers.WebApi.V1.ApiModels.ShipToModel[];
	}
}
declare module Insite.Websites.WebApi.V1.ApiModels {
	interface StateModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		name: string;
		abbreviation: string;
	}
	interface CountryModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		name: string;
		abbreviation: string;
		states: Insite.Websites.WebApi.V1.ApiModels.StateModel[];
	}
	interface LanguageModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		languageCode: string;
		cultureCode: string;
		description: string;
		imageFilePath: string;
		isDefault: boolean;
		isLive: boolean;
	}
	interface CurrencyModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		currencyCode: string;
		description: string;
		currencySymbol: string;
		isDefault: boolean;
	}
	interface WebsiteModel extends Insite.Core.WebApi.BaseModel {
		countriesUri: string;
		statesUri: string;
		languagesUri: string;
		currenciesUri: string;
		id: string;
		name: string;
		description: string;
		isActive: boolean;
		isRestricted: boolean;
		websiteFavicon: string;
		mobilePrimaryColor: string;
		mobilePrivacyPolicyUrl: string;
		mobileTermsOfUseUrl: string;
		countries: Insite.Websites.WebApi.V1.ApiModels.CountryCollectionModel;
		states: Insite.Websites.WebApi.V1.ApiModels.StateCollectionModel;
		languages: Insite.Websites.WebApi.V1.ApiModels.LanguageCollectionModel;
		currencies: Insite.Websites.WebApi.V1.ApiModels.CurrencyCollectionModel;
	}
	interface CountryCollectionModel extends Insite.Core.WebApi.BaseModel {
		countries: Insite.Websites.WebApi.V1.ApiModels.CountryModel[];
	}
	interface StateCollectionModel extends Insite.Core.WebApi.BaseModel {
		states: Insite.Websites.WebApi.V1.ApiModels.StateModel[];
	}
	interface LanguageCollectionModel extends Insite.Core.WebApi.BaseModel {
		languages: Insite.Websites.WebApi.V1.ApiModels.LanguageModel[];
	}
	interface CurrencyCollectionModel extends Insite.Core.WebApi.BaseModel {
		currencies: Insite.Websites.WebApi.V1.ApiModels.CurrencyModel[];
	}
	interface WebsiteSettingsModel extends Insite.Core.WebApi.BaseModel {
		mobileAppEnabled: boolean;
		useTokenExGateway: boolean;
		useECheckTokenExGateway: boolean;
		tokenExTestMode: boolean;
		usePaymetricGateway: boolean;
		useSquareGateway: boolean;
		paymentGatewayRequiresAuthentication: boolean;
		defaultPageSize: number;
		enableCookiePrivacyPolicyPopup: boolean;
		enableDynamicRecommendations: boolean;
		googleMapsApiKey: string;
		googleTrackingTypeComputed: string;
		googleTrackingAccountId: string;
		cmsType: Insite.Data.Entities.CmsType;
		includeSiteNameInPageTitle: boolean;
		pageTitleDelimiter: string;
		siteNameAfterTitle: boolean;
		reCaptchaSiteKey: string;
		reCaptchaEnabledForContactUs: boolean;
		reCaptchaEnabledForCreateAccount: boolean;
		reCaptchaEnabledForForgotPassword: boolean;
		reCaptchaEnabledForShareProduct: boolean;
		advancedSpireCmsFeatures: boolean;
		previewLoginEnabled: boolean;
		useAdyenDropIn: boolean;
		squareLocationId: string;
		squareApplicationId: string;
	}
	interface AddressFieldCollectionModel extends Insite.Core.WebApi.BaseModel {
		billToAddressFields: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayCollectionModel;
		shipToAddressFields: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayCollectionModel;
	}
	interface AddressFieldDisplayCollectionModel extends Insite.Core.WebApi.BaseModel {
		address1: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		address2: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		address3: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		address4: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		attention: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		city: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		companyName: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		contactFullName: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		country: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		email: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		fax: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		firstName: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		lastName: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		phone: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		postalCode: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
		state: Insite.Websites.WebApi.V1.ApiModels.AddressFieldDisplayModel;
	}
	interface AddressFieldDisplayModel extends Insite.Core.WebApi.BaseModel {
		displayName: string;
		isVisible: boolean;
	}
}
declare module Insite.Customers.Services.Dtos {
	interface CustomerValidationDto {
		firstName: Insite.Customers.Services.Dtos.FieldValidationDto;
		lastName: Insite.Customers.Services.Dtos.FieldValidationDto;
		companyName: Insite.Customers.Services.Dtos.FieldValidationDto;
		attention: Insite.Customers.Services.Dtos.FieldValidationDto;
		address1: Insite.Customers.Services.Dtos.FieldValidationDto;
		address2: Insite.Customers.Services.Dtos.FieldValidationDto;
		address3: Insite.Customers.Services.Dtos.FieldValidationDto;
		address4: Insite.Customers.Services.Dtos.FieldValidationDto;
		country: Insite.Customers.Services.Dtos.FieldValidationDto;
		state: Insite.Customers.Services.Dtos.FieldValidationDto;
		city: Insite.Customers.Services.Dtos.FieldValidationDto;
		postalCode: Insite.Customers.Services.Dtos.FieldValidationDto;
		phone: Insite.Customers.Services.Dtos.FieldValidationDto;
		email: Insite.Customers.Services.Dtos.FieldValidationDto;
		fax: Insite.Customers.Services.Dtos.FieldValidationDto;
	}
	interface FieldValidationDto {
		isRequired: boolean;
		isDisabled: boolean;
		maxLength: number;
	}
	interface AccountsReceivableDto {
		agingBuckets: Insite.Customers.Services.Dtos.AgingBucketDto[];
		agingBucketTotal: Insite.Customers.Services.Dtos.AgingBucketDto;
		agingBucketFuture: Insite.Customers.Services.Dtos.AgingBucketDto;
	}
	interface AgingBucketDto {
		amount: number;
		amountDisplay: string;
		label: string;
	}
}
declare module Insite.Account.Services.Dtos {
	interface CustomerCostCodeDto {
		customerCostCodeId: System.Guid;
		costCode: string;
		description: string;
		isActive: boolean;
	}
}
declare module Insite.Brands.WebApi.V1.ApiModels {
	interface BrandAlphabetModel extends Insite.Core.WebApi.BaseModel {
		alphabet: Insite.Brands.WebApi.V1.ApiModels.BrandAlphabetLetterModel[];
	}
	interface BrandAlphabetLetterModel {
		letter: string;
		count: number;
	}
	interface BrandCategoryCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		brandCategories: Insite.Brands.WebApi.V1.ApiModels.BrandCategoryModel[];
	}
	interface BrandCategoryModel extends Insite.Core.WebApi.BaseModel {
		brandId: System.Guid;
		categoryId: System.Guid;
		contentManagerId: System.Guid;
		categoryName: string;
		categoryShortDescription: string;
		featuredImagePath: string;
		featuredImageAltText: string;
		productListPagePath: string;
		htmlContent: string;
		subCategories: Insite.Brands.WebApi.V1.ApiModels.BrandCategoryModel[];
	}
	interface BrandModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		manufacturer: string;
		externalUrl: string;
		detailPagePath: string;
		productListPagePath: string;
		logoSmallImagePath: string;
		logoLargeImagePath: string;
		logoAltText: string;
		featuredImagePath: string;
		featuredImageAltText: string;
		topSellerProducts: Insite.Catalog.Services.Dtos.ProductDto[];
		htmlContent: string;
		pageTitle: string;
		metaDescription: string;
	}
	interface BrandCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		brands: Insite.Brands.WebApi.V1.ApiModels.BrandModel[];
	}
	interface BrandProductLineModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		sortOrder: number;
		productListPagePath: string;
		featuredImagePath: string;
		featuredImageAltText: string;
		isFeatured: boolean;
		isSponsored: boolean;
	}
	interface BrandProductLineCollectionModel extends Insite.Core.WebApi.BaseModel {
		pagination: Insite.Core.WebApi.PaginationModel;
		productLines: Insite.Brands.WebApi.V1.ApiModels.BrandProductLineModel[];
	}
}
declare module Insite.Catalog.Services.Dtos {
	interface ProductDto {
		id: System.Guid;
		orderLineId: System.Guid;
		name: string;
		customerName: string;
		shortDescription: string;
		erpNumber: string;
		erpDescription: string;
		urlSegment: string;
		basicListPrice: number;
		basicSalePrice: number;
		basicSaleStartDate: Date;
		basicSaleEndDate: Date;
		smallImagePath: string;
		mediumImagePath: string;
		largeImagePath: string;
		pricing: Insite.Core.Plugins.Pricing.ProductPriceDto;
		currencySymbol: string;
		qtyOnHand: number;
		isConfigured: boolean;
		isFixedConfiguration: boolean;
		isActive: boolean;
		isHazardousGood: boolean;
		isDiscontinued: boolean;
		isSpecialOrder: boolean;
		isGiftCard: boolean;
		isBeingCompared: boolean;
		isSponsored: boolean;
		isSubscription: boolean;
		quoteRequired: boolean;
		manufacturerItem: string;
		packDescription: string;
		altText: string;
		customerUnitOfMeasure: string;
		canBackOrder: boolean;
		trackInventory: boolean;
		multipleSaleQty: number;
		minimumOrderQty: number;
		htmlContent: string;
		productCode: string;
		priceCode: string;
		sku: string;
		upcCode: string;
		modelNumber: string;
		taxCode1: string;
		taxCode2: string;
		taxCategory: string;
		shippingClassification: string;
		shippingLength: string;
		shippingWidth: string;
		shippingHeight: string;
		shippingWeight: string;
		qtyPerShippingPackage: number;
		shippingAmountOverride: number;
		handlingAmountOverride: number;
		metaDescription: string;
		metaKeywords: string;
		pageTitle: string;
		allowAnyGiftCardAmount: boolean;
		sortOrder: number;
		hasMsds: boolean;
		unspsc: string;
		roundingRule: string;
		vendorNumber: string;
		configurationDto: Insite.Catalog.Services.Dtos.LegacyConfigurationDto;
		unitOfMeasure: string;
		unitOfMeasureDisplay: string;
		unitOfMeasureDescription: string;
		selectedUnitOfMeasure: string;
		selectedUnitOfMeasureDisplay: string;
		productDetailUrl: string;
		canAddToCart: boolean;
		allowedAddToCart: boolean;
		canAddToWishlist: boolean;
		canViewDetails: boolean;
		canShowPrice: boolean;
		canShowUnitOfMeasure: boolean;
		canEnterQuantity: boolean;
		canConfigure: boolean;
		isStyleProductParent: boolean;
		styleParentId: System.Guid;
		requiresRealTimeInventory: boolean;
		numberInCart: number;
		qtyOrdered: number;
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
		styleTraits: Insite.Catalog.Services.Dtos.StyleTraitDto[];
		styledProducts: Insite.Catalog.Services.Dtos.StyledProductDto[];
		attributeTypes: Insite.Catalog.Services.Dtos.AttributeTypeDto[];
		documents: Insite.Catalog.Services.Dtos.DocumentDto[];
		specifications: Insite.Catalog.Services.Dtos.SpecificationDto[];
		crossSells: Insite.Catalog.Services.Dtos.ProductDto[];
		accessories: Insite.Catalog.Services.Dtos.ProductDto[];
		productUnitOfMeasures: Insite.Catalog.Services.Dtos.ProductUnitOfMeasureDto[];
		productImages: Insite.Catalog.Services.Dtos.ProductImageDto[];
		properties: {[key: string]:  string};
		score: number;
		scoreExplanation: Insite.Core.Plugins.Search.Dtos.ScoreExplanationDto;
		searchBoost: number;
		searchBoostDecimal: number;
		salePriceLabel: string;
		cantBuy: boolean;
		allowZeroPricing: boolean;
		brand: Insite.Catalog.Services.Dtos.BrandDto;
		productLine: Insite.Catalog.Services.Dtos.ProductLineDto;
		productSubscription: Insite.Catalog.Services.Dtos.ProductSubscriptionDto;
		replacementProductId: System.Guid;
		warehouses: Insite.Catalog.Services.Dtos.WarehouseDto[];
		relatedProducts: Insite.Catalog.Services.Dtos.RelatedProductDto[];
		alsoPurchasedProducts: Insite.Catalog.Services.Dtos.ProductDto[];
	}
	interface LegacyConfigurationDto {
		sections: Insite.Catalog.Services.Dtos.ConfigSectionDto[];
		hasDefaults: boolean;
		isKit: boolean;
	}
	interface ConfigSectionDto {
		sectionName: string;
		label: string;
		options: Insite.Catalog.Services.Dtos.ConfigSectionOptionDto[];
	}
	interface ConfigSectionOptionDto {
		sectionOptionId: System.Guid;
		sectionName: string;
		productName: string;
		productId: System.Guid;
		description: string;
		price: number;
		userProductPrice: boolean;
		selected: boolean;
		sortOrder: number;
		quantity: number;
	}
	interface AvailabilityDto {
		messageType: number;
		requiresRealTimeInventory?: boolean;
	}
	interface StyleTraitDto {
		styleTraitId: System.Guid;
		name: string;
		nameDisplay: string;
		unselectedValue: string;
		sortOrder: number;
		styleValues: Insite.Catalog.Services.Dtos.StyleValueDto[];
		displayType: string;
		numberOfSwatchesVisible: number;
		displayTextWithSwatch: boolean;
	}
	interface StyleValueDto {
		styleTraitName: string;
		styleTraitId: System.Guid;
		styleTraitValueId: System.Guid;
		value: string;
		valueDisplay: string;
		sortOrder: number;
		isDefault: boolean;
		swatchType: string;
		swatchImageValue: string;
		swatchColorValue: string;
	}
	interface StyledProductDto {
		productId: System.Guid;
		name: string;
		shortDescription: string;
		erpNumber: string;
		customerName: string;
		mediumImagePath: string;
		smallImagePath: string;
		largeImagePath: string;
		qtyOnHand: number;
		unitOfMeasure: string;
		trackInventory: boolean;
		minimumOrderQty: number;
		productDetailUrl: string;
		numberInCart: number;
		pricing: Insite.Core.Plugins.Pricing.ProductPriceDto;
		quoteRequired: boolean;
		styleValues: Insite.Catalog.Services.Dtos.StyleValueDto[];
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
		productUnitOfMeasures: Insite.Catalog.Services.Dtos.ProductUnitOfMeasureDto[];
		productImages: Insite.Catalog.Services.Dtos.ProductImageDto[];
		warehouses: Insite.Catalog.Services.Dtos.WarehouseDto[];
		manufacturerItem: string;
		upcCode: string;
		sku: string;
		cantBuy: boolean;
		allowZeroPricing: boolean;
	}
	interface ProductUnitOfMeasureDto {
		productUnitOfMeasureId: System.Guid;
		unitOfMeasure: string;
		unitOfMeasureDisplay: string;
		description: string;
		qtyPerBaseUnitOfMeasure: number;
		roundingRule: string;
		isDefault: boolean;
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
	}
	interface ProductImageDto {
		id: System.Guid;
		sortOrder: number;
		name: string;
		imageType: string;
		smallImagePath: string;
		mediumImagePath: string;
		largeImagePath: string;
		altText: string;
	}
	interface WarehouseDto extends Insite.Catalog.Services.Dtos.AvailabilityDto {
		name: string;
		description: string;
		qty: number;
		properties: {[key: string]:  string};
	}
	interface AttributeTypeDto {
		id: System.Guid;
		name: string;
		label: string;
		isFilter: boolean;
		isComparable: boolean;
		isSearchable: boolean;
		includeOnProduct: boolean;
		isActive: boolean;
		sortOrder: number;
		attributeValues: Insite.Catalog.Services.Dtos.AttributeValueDto[];
	}
	interface AttributeValueDto {
		id: System.Guid;
		value: string;
		valueDisplay: string;
		sortOrder: number;
		isActive: boolean;
	}
	interface DocumentDto {
		id: System.Guid;
		name: string;
		description: string;
		createdOn: Date;
		filePath: string;
		fileUrl: string;
		documentType: string;
		languageId: System.Guid;
		fileTypeString: string;
	}
	interface SpecificationDto {
		specificationId: System.Guid;
		name: string;
		nameDisplay: string;
		value: string;
		description: string;
		sortOrder: number;
		isActive: boolean;
		parentSpecification: Insite.Catalog.Services.Dtos.SpecificationDto;
		htmlContent: string;
		specifications: Insite.Catalog.Services.Dtos.SpecificationDto[];
	}
	interface BrandDto {
		id: System.Guid;
		name: string;
		urlSegment: string;
		logoSmallImagePath: string;
		logoLargeImagePath: string;
		logoImageAltText: string;
		detailPagePath: string;
	}
	interface ProductLineDto {
		id: System.Guid;
		name: string;
	}
	interface ProductSubscriptionDto {
		subscriptionAddToInitialOrder: boolean;
		subscriptionAllMonths: boolean;
		subscriptionApril: boolean;
		subscriptionAugust: boolean;
		subscriptionCyclePeriod: string;
		subscriptionDecember: boolean;
		subscriptionFebruary: boolean;
		subscriptionFixedPrice: boolean;
		subscriptionJanuary: boolean;
		subscriptionJuly: boolean;
		subscriptionJune: boolean;
		subscriptionMarch: boolean;
		subscriptionMay: boolean;
		subscriptionNovember: boolean;
		subscriptionOctober: boolean;
		subscriptionPeriodsPerCycle: number;
		subscriptionSeptember: boolean;
		subscriptionShipViaId: System.Guid;
		subscriptionTotalCycles: number;
	}
	interface RelatedProductDto {
		relatedProductType: string;
		productDto: Insite.Catalog.Services.Dtos.ProductDto;
	}
}
declare module Insite.Core.Plugins.Pricing {
	interface ProductPriceDto {
		productId: System.Guid;
		isOnSale: boolean;
		requiresRealTimePrice: boolean;
		additionalResults: {[key: string]:  string};
		unitCost: number;
		unitCostDisplay: string;
		unitListPrice: number;
		unitListPriceDisplay: string;
		extendedUnitListPrice: number;
		extendedUnitListPriceDisplay: string;
		unitRegularPrice: number;
		unitRegularPriceDisplay: string;
		extendedUnitRegularPrice: number;
		extendedUnitRegularPriceDisplay: string;
		unitNetPrice: number;
		unitNetPriceDisplay: string;
		extendedUnitNetPrice: number;
		extendedUnitNetPriceDisplay: string;
		unitOfMeasure: string;
		vatRate: number;
		vatAmount: number;
		vatAmountDisplay: string;
		unitListBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		unitRegularBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		regularPrice: number;
		regularPriceDisplay: string;
		extendedRegularPrice: number;
		extendedRegularPriceDisplay: string;
		actualPrice: number;
		actualPriceDisplay: string;
		extendedActualPrice: number;
		extendedActualPriceDisplay: string;
		regularBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		actualBreakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		unitListPriceWithVat: number;
		unitListPriceWithVatDisplay: string;
		extendedUnitListPriceWithVat: number;
		extendedUnitListPriceWithVatDisplay: string;
		unitRegularPriceWithVat: number;
		unitRegularPriceWithVatDisplay: string;
		extendedUnitRegularPriceWithVat: number;
		extendedUnitRegularPriceWithVatDisplay: string;
		vatMinusExtendedUnitRegularPrice: number;
	}
	interface BreakPriceDto {
		breakQty: number;
		breakPrice: number;
		breakPriceDisplay: string;
		savingsMessage: string;
		breakPriceWithVat: number;
		breakPriceWithVatDisplay: string;
	}
}
declare module Insite.Core.Plugins.Search.Dtos {
	interface ScoreExplanationDto {
		totalBoost: number;
		aggregateFieldScores: Insite.Core.Plugins.Search.Dtos.FieldScoreDto[];
		detailedFieldScores: Insite.Core.Plugins.Search.Dtos.FieldScoreDetailedDto[];
	}
	interface FieldScoreDto {
		name: string;
		score: number;
	}
	interface FieldScoreDetailedDto {
		name: string;
		score: number;
		boost: number;
		matchText: string;
		termFrequencyNormalized: number;
		inverseDocumentFrequency: number;
		scoreUsed: boolean;
	}
	interface CategoryFacetDto {
		categoryId: System.Guid;
		websiteId: System.Guid;
		shortDescription: string;
		count: number;
		selected: boolean;
		subCategoryDtos: Insite.Core.Plugins.Search.Dtos.CategoryFacetDto[];
	}
	interface AttributeTypeFacetDto {
		attributeTypeId: System.Guid;
		name: string;
		nameDisplay: string;
		sort: number;
		attributeValueFacets: Insite.Core.Plugins.Search.Dtos.AttributeValueFacetDto[];
	}
	interface AttributeValueFacetDto {
		attributeValueId: System.Guid;
		value: string;
		valueDisplay: string;
		count: number;
		sortOrder: number;
		selected: boolean;
		styleParentId: System.Guid;
		styleChildId: System.Guid;
	}
	interface GenericFacetDto {
		id: System.Guid;
		name: string;
		count: number;
		selected: boolean;
	}
	interface SuggestionDto {
		highlightedSuggestion: string;
		score: number;
		suggestion: string;
	}
	interface PriceRangeDto {
		minimumPrice: number;
		maximumPrice: number;
		count: number;
		priceFacets: Insite.Core.Plugins.Search.Dtos.PriceFacetDto[];
	}
	interface PriceFacetDto {
		minimumPrice: number;
		maximumPrice: number;
		count: number;
		selected: boolean;
	}
}
declare module Insite.Budget.WebApi.V1.ApiModels {
	interface BudgetModel extends Insite.Core.WebApi.BaseModel {
		fiscalYear: number;
		fiscalYearEndDate: Date;
		budgetLineCollection: Insite.Budget.WebApi.V1.ApiModels.BudgetLineModel[];
		userProfileId: string;
		shipToId: string;
	}
	interface BudgetLineModel extends Insite.Core.WebApi.BaseModel {
		period: number;
		startDate: Date;
		currentFiscalYearBudget: number;
		currentFiscalYearBudgetDisplay: string;
		currentFiscalYearActual: number;
		currentFiscalYearActualDisplay: string;
		currentFiscalYearVariance: number;
		currentFiscalYearVarianceDisplay: string;
		lastFiscalYearBudget: number;
		lastFiscalYearBudgetDisplay: string;
		lastFiscalYearActual: number;
		lastFiscalYearActualDisplay: string;
		lastFiscalYearVariance: number;
		lastFiscalYearVarianceDisplay: string;
	}
	interface BudgetCalendarModel extends Insite.Core.WebApi.BaseModel {
		fiscalYear: number;
		fiscalYearEndDate: Date;
		budgetPeriods: Date[];
	}
}
declare module Insite.Cart.WebApi.V1.ApiModels {
	interface CartCollectionModel extends Insite.Core.WebApi.BaseModel {
		carts: Insite.Cart.WebApi.V1.ApiModels.CartModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
	interface CartModel extends Insite.Core.WebApi.BaseModel {
		cartLinesUri: string;
		id: string;
		status: string;
		statusDisplay: string;
		type: string;
		typeDisplay: string;
		orderNumber: string;
		erpOrderNumber: string;
		orderDate: Date;
		billTo: Insite.Customers.WebApi.V1.ApiModels.BillToModel;
		shipTo: Insite.Customers.WebApi.V1.ApiModels.ShipToModel;
		userLabel: string;
		userRoles: string;
		shipToLabel: string;
		notes: string;
		carrier: Insite.Cart.Services.Dtos.CarrierDto;
		shipVia: Insite.Cart.Services.Dtos.ShipViaDto;
		paymentMethod: Insite.Cart.Services.Dtos.PaymentMethodDto;
		fulfillmentMethod: string;
		requestedPickupDate: string;
		poNumber: string;
		promotionCode: string;
		initiatedByUserName: string;
		totalQtyOrdered: number;
		lineCount: number;
		totalCountDisplay: number;
		quoteRequiredCount: number;
		orderSubTotal: number;
		orderSubTotalDisplay: string;
		orderSubTotalWithOutProductDiscounts: number;
		orderSubTotalWithOutProductDiscountsDisplay: string;
		totalTax: number;
		totalTaxDisplay: string;
		shippingAndHandling: number;
		shippingAndHandlingDisplay: string;
		orderGrandTotal: number;
		orderGrandTotalDisplay: string;
		costCodeLabel: string;
		isAuthenticated: boolean;
		isGuestOrder: boolean;
		isSalesperson: boolean;
		isSubscribed: boolean;
		requiresPoNumber: boolean;
		displayContinueShoppingLink: boolean;
		canModifyOrder: boolean;
		canSaveOrder: boolean;
		canBypassCheckoutAddress: boolean;
		canRequisition: boolean;
		canRequestQuote: boolean;
		canEditCostCode: boolean;
		showTaxAndShipping: boolean;
		showLineNotes: boolean;
		showCostCode: boolean;
		showNewsletterSignup: boolean;
		showPoNumber: boolean;
		showCreditCard: boolean;
		showECheck: boolean;
		showPayPal: boolean;
		isAwaitingApproval: boolean;
		requiresApproval: boolean;
		approverReason: string;
		hasApprover: boolean;
		salespersonName: string;
		paymentOptions: Insite.Cart.Services.Dtos.PaymentOptionsDto;
		costCodes: Insite.Cart.Services.Dtos.CostCodeDto[];
		carriers: Insite.Cart.Services.Dtos.CarrierDto[];
		warehouses: Insite.Cart.Services.Dtos.WarehouseDto[];
		cartLines: Insite.Cart.WebApi.V1.ApiModels.CartLineModel[];
		customerOrderTaxes: Insite.Cart.Services.Dtos.CustomerOrderTaxDto[];
		canCheckOut: boolean;
		hasInsufficientInventory: boolean;
		currencySymbol: string;
		requestedDeliveryDate: string;
		requestedDeliveryDateDisplay: Date;
		cartNotPriced: boolean;
		messages: string[];
		creditCardBillingAddress: Insite.Cart.WebApi.V1.ApiModels.CreditCardBillingAddressDto;
		alsoPurchasedProducts: Insite.Catalog.Services.Dtos.ProductDto[];
		requestedPickupDateDisplay: Date;
		taxFailureReason: string;
		failedToGetRealTimeInventory: boolean;
		unassignCart: boolean;
		customerVatNumber: string;
		vmiLocationId: System.Guid;
	}
	interface CartLineModel extends Insite.Core.WebApi.BaseModel {
		productUri: string;
		id: string;
		line: number;
		productId: System.Guid;
		requisitionId: System.Guid;
		smallImagePath: string;
		altText: string;
		productName: string;
		manufacturerItem: string;
		customerName: string;
		shortDescription: string;
		erpNumber: string;
		unitOfMeasure: string;
		unitOfMeasureDisplay: string;
		unitOfMeasureDescription: string;
		baseUnitOfMeasure: string;
		baseUnitOfMeasureDisplay: string;
		qtyPerBaseUnitOfMeasure: number;
		costCode: string;
		notes: string;
		qtyOrdered: number;
		qtyLeft: number;
		pricing: Insite.Core.Plugins.Pricing.ProductPriceDto;
		isPromotionItem: boolean;
		isDiscounted: boolean;
		isConfigured: boolean;
		isFixedConfiguration: boolean;
		quoteRequired: boolean;
		breakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		sectionOptions: Insite.Cart.Services.Dtos.SectionOptionDto[];
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
		qtyOnHand: number;
		canAddToCart: boolean;
		isQtyAdjusted: boolean;
		hasInsufficientInventory: boolean;
		canBackOrder: boolean;
		trackInventory: boolean;
		salePriceLabel: string;
		isSubscription: boolean;
		productSubscription: Insite.Catalog.Services.Dtos.ProductSubscriptionDto;
		isRestricted: boolean;
		canAddToWishlist: boolean;
		isActive: boolean;
		brand: Insite.Catalog.Services.Dtos.BrandDto;
		vmiBinId: System.Guid;
		isDiscontinued: boolean;
		allowZeroPricing: boolean;
	}
	interface CreditCardBillingAddressDto {
		address1: string;
		address2: string;
		city: string;
		stateAbbreviation: string;
		countryAbbreviation: string;
		postalCode: string;
	}
	interface CartLineCollectionModel extends Insite.Core.WebApi.BaseModel {
		cartLines: Insite.Cart.WebApi.V1.ApiModels.CartLineModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
		notAllAddedToCart: boolean;
	}
	interface CartSettingsModel extends Insite.Core.WebApi.BaseModel {
		canRequestDeliveryDate: boolean;
		canRequisition: boolean;
		canEditCostCode: boolean;
		maximumDeliveryPeriod: number;
		showCostCode: boolean;
		showPoNumber: boolean;
		showPayPal: boolean;
		showCreditCard: boolean;
		showTaxAndShipping: boolean;
		showLineNotes: boolean;
		showNewsletterSignup: boolean;
		requiresPoNumber: boolean;
		addToCartPopupTimeout: number;
		enableRequestPickUpDate: boolean;
		enableSavedCreditCards: boolean;
		bypassCvvForSavedCards: boolean;
	}
}
declare module Insite.Cart.Services.Dtos {
	interface CarrierDto {
		id: System.Guid;
		description: string;
		shipVias: Insite.Cart.Services.Dtos.ShipViaDto[];
	}
	interface ShipViaDto {
		id: System.Guid;
		description: string;
		isDefault: boolean;
	}
	interface PaymentMethodDto {
		name: string;
		description: string;
		isCreditCard: boolean;
		isECheck: boolean;
		isPaymentProfile: boolean;
		cardType: string;
		billingAddress: string;
		isPaymentProfileExpired: boolean;
		tokenScheme: string;
	}
	interface PaymentOptionsDto {
		threeDs: Insite.Cart.Services.Dtos.ThreeDsDto;
		paymentMethods: Insite.Cart.Services.Dtos.PaymentMethodDto[];
		cardTypes: {[key: string]:  string};
		expirationMonths: {[key: string]:  number};
		expirationYears: {[key: number]:  number};
		creditCard: Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto;
		eCheck: Insite.Core.Plugins.PaymentGateway.Dtos.ECheckDto;
		canStorePaymentProfile: boolean;
		storePaymentProfile: boolean;
		isPayPal: boolean;
		payPalPayerId: string;
		payPalToken: string;
		payPalPaymentUrl: string;
	}
	interface CostCodeDto {
		costCode: string;
		description: string;
	}
	interface WarehouseDto {
		id: System.Guid;
		address1: string;
		address2: string;
		city: string;
		countryId: System.Guid;
		description: string;
		isDefault: boolean;
		name: string;
		phone: string;
		postalCode: string;
		shipSite: string;
		state: string;
	}
	interface SectionOptionDto {
		sectionOptionId: System.Guid;
		sectionName: string;
		optionName: string;
	}
	interface CustomerOrderTaxDto {
		taxCode: string;
		taxDescription: string;
		taxRate: number;
		taxAmount: number;
		taxAmountDisplay: string;
		sortOrder: number;
	}
	interface ThreeDsDto {
		authenticationVersion: string;
		authenticationToken: string;
		dsTransactionId: System.Guid;
		acsEci: string;
	}
}
declare module Insite.Core.Plugins.PaymentGateway.Dtos {
	interface CreditCardDto {
		cardType: string;
		cardHolderName: string;
		cardNumber: string;
		expirationMonth: number;
		expirationYear: number;
		securityCode: string;
		useBillingAddress: boolean;
		address1: string;
		city: string;
		state: string;
		stateAbbreviation: string;
		country: string;
		countryAbbreviation: string;
		postalCode: string;
	}
	interface ECheckDto {
		accountHolder: string;
		accountNumber: string;
		routingNumber: string;
		useBillingAddress: boolean;
		address1: string;
		city: string;
		state: string;
		stateAbbreviation: string;
		country: string;
		countryAbbreviation: string;
		postalCode: string;
	}
}
declare module Insite.OrderApproval.WebApi.V1.ApiModels {
	interface OrderApprovalCollectionModel extends Insite.Core.WebApi.BaseModel {
		cartCollection: Insite.Cart.WebApi.V1.ApiModels.CartModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
}
declare module Insite.Catalog.WebApi.V2.ApiModels.Product {
	interface ProductModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		productNumber: string;
		customerProductNumber: string;
		customerUnitOfMeasure: string;
		productTitle: string;
		urlSegment: string;
		canonicalUrl: string;
		manufacturerItem: string;
		packDescription: string;
		unitListPrice: number;
		unitListPriceDisplay: string;
		priceFacet: number;
		smallImagePath: string;
		mediumImagePath: string;
		largeImagePath: string;
		imageAltText: string;
		isDiscontinued: boolean;
		quoteRequired: boolean;
		minimumOrderQty: number;
		isSponsored: boolean;
		trackInventory: boolean;
		configurationType: string;
		canConfigure: boolean;
		canAddToCart: boolean;
		canAddToWishlist: boolean;
		canShowPrice: boolean;
		canShowUnitOfMeasure: boolean;
		isVariantParent: boolean;
		variantTypeId: System.Guid;
		salePriceLabel: string;
		cantBuy: boolean;
		allowZeroPricing: boolean;
		brand: Insite.Catalog.WebApi.V2.ApiModels.Product.BrandModel;
		productLine: Insite.Catalog.WebApi.V2.ApiModels.Product.ProductLineModel;
		unitOfMeasures: Insite.Catalog.WebApi.V2.ApiModels.Product.UnitOfMeasureModel[];
		score: number;
		scoreExplanation: Insite.Catalog.WebApi.V2.ApiModels.Product.ScoreExplanationModel;
		detail: Insite.Catalog.WebApi.V2.ApiModels.Product.DetailModel;
		content: Insite.Catalog.WebApi.V2.ApiModels.Product.ContentModel;
		images: Insite.Catalog.WebApi.V2.ApiModels.Product.ImageModel[];
		documents: Insite.Catalog.WebApi.V2.ApiModels.Product.DocumentModel[];
		specifications: Insite.Catalog.WebApi.V2.ApiModels.Product.SpecificationModel[];
		warehouses: Insite.Catalog.WebApi.V2.ApiModels.Product.WarehouseModel[];
		attributeTypes: Insite.Catalog.WebApi.V2.ApiModels.Product.AttributeTypeModel[];
		variantTraits: Insite.Catalog.WebApi.V2.ApiModels.Product.VariantTraitModel[];
		childTraitValues: Insite.Catalog.WebApi.V2.ApiModels.Product.ChildTraitValueModel[];
	}
	interface BrandModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		urlSegment: string;
		logoSmallImagePath: string;
		logoLargeImagePath: string;
		logoImageAltText: string;
		detailPagePath: string;
	}
	interface ProductLineModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
	}
	interface UnitOfMeasureModel {
		id: System.Guid;
		unitOfMeasure: string;
		unitOfMeasureDisplay: string;
		description: string;
		qtyPerBaseUnitOfMeasure: number;
		roundingRule: string;
		isDefault: boolean;
	}
	interface ScoreExplanationModel {
		totalBoost: number;
		aggregateFieldScores: Insite.Catalog.WebApi.V2.ApiModels.Product.FieldScoreModel[];
		detailedFieldScores: Insite.Catalog.WebApi.V2.ApiModels.Product.FieldScoreDetailedModel[];
	}
	interface FieldScoreModel {
		name: string;
		score: number;
	}
	interface FieldScoreDetailedModel {
		name: string;
		score: number;
		boost: number;
		matchText: string;
		termFrequencyNormalized: number;
		inverseDocumentFrequency: number;
		scoreUsed: boolean;
	}
	interface DetailModel {
		name: string;
		modelNumber: string;
		sku: string;
		upcCode: string;
		unspsc: string;
		productCode: string;
		priceCode: string;
		sortOrder: number;
		multipleSaleQty: number;
		canBackOrder: boolean;
		roundingRule: string;
		replacementProductId: System.Guid;
		isHazardousGood: boolean;
		hasMsds: boolean;
		isSpecialOrder: boolean;
		isGiftCard: boolean;
		isSubscription: boolean;
		subscription: Insite.Catalog.WebApi.V2.ApiModels.Product.ProductSubscriptionModel;
		allowAnyGiftCardAmount: boolean;
		taxCode1: string;
		taxCode2: string;
		taxCategory: string;
		vatCodeId: System.Guid;
		shippingClassification: string;
		shippingLength: number;
		shippingWidth: number;
		shippingHeight: number;
		shippingWeight: number;
		configuration: Insite.Catalog.WebApi.V2.ApiModels.Product.ConfigurationModel;
	}
	interface ProductSubscriptionModel extends Insite.Core.WebApi.BaseModel {
		subscriptionCyclePeriod: string;
		subscriptionPeriodsPerCycle: number;
		subscriptionTotalCycles: number;
		subscriptionAllMonths: boolean;
		subscriptionJanuary: boolean;
		subscriptionFebruary: boolean;
		subscriptionMarch: boolean;
		subscriptionApril: boolean;
		subscriptionMay: boolean;
		subscriptionJune: boolean;
		subscriptionJuly: boolean;
		subscriptionAugust: boolean;
		subscriptionSeptember: boolean;
		subscriptionOctober: boolean;
		subscriptionNovember: boolean;
		subscriptionDecember: boolean;
		subscriptionAddToInitialOrder: boolean;
		subscriptionFixedPrice: boolean;
		subscriptionShipViaId: System.Guid;
	}
	interface ConfigurationModel {
		configSections: Insite.Catalog.WebApi.V2.ApiModels.Product.ConfigSectionModel[];
		hasDefaults: boolean;
		isKit: boolean;
	}
	interface ConfigSectionModel {
		id: System.Guid;
		sectionName: string;
		label: string;
		sortOrder: number;
		sectionOptions: Insite.Catalog.WebApi.V2.ApiModels.Product.SectionOptionModel[];
	}
	interface SectionOptionModel {
		id: System.Guid;
		productId: System.Guid;
		name: string;
		description: string;
		price: number;
		selected: boolean;
		sortOrder: number;
		quantity: number;
	}
	interface ContentModel {
		htmlContent: string;
		pageTitle: string;
		metaDescription: string;
		metaKeywords: string;
		openGraphTitle: string;
		openGraphUrl: string;
		openGraphImage: string;
	}
	interface ImageModel {
		id: System.Guid;
		sortOrder: number;
		name: string;
		imageType: string;
		smallImagePath: string;
		mediumImagePath: string;
		largeImagePath: string;
		imageAltText: string;
	}
	interface DocumentModel {
		id: System.Guid;
		name: string;
		description: string;
		filePath: string;
		documentType: string;
	}
	interface SpecificationModel {
		id: System.Guid;
		name: string;
		nameDisplay: string;
		description: string;
		value: string;
		htmlContent: string;
		sortOrder: number;
	}
	interface WarehouseModel {
		id: System.Guid;
		name: string;
		description: string;
		qtyAvailable: number;
	}
	interface AttributeTypeModel {
		id: System.Guid;
		name: string;
		label: string;
		isFilter: boolean;
		isComparable: boolean;
		isSearchable: boolean;
		includeOnProduct: boolean;
		sortOrder: number;
		attributeValues: Insite.Catalog.WebApi.V2.ApiModels.Product.AttributeValueModel[];
	}
	interface AttributeValueModel {
		id: System.Guid;
		value: string;
		valueDisplay: string;
		sortOrder: number;
	}
	interface VariantTraitModel {
		id: System.Guid;
		name: string;
		nameDisplay: string;
		unselectedValue: string;
		displayType: string;
		numberOfSwatchesVisible: number;
		displayTextWithSwatch: boolean;
		sortOrder: number;
		traitValues: Insite.Catalog.WebApi.V2.ApiModels.Product.TraitValueModel[];
	}
	interface TraitValueModel {
		id: System.Guid;
		value: string;
		valueDisplay: string;
		sortOrder: number;
		isDefault: boolean;
		swatchType: string;
		swatchImageValue: string;
		swatchColorValue: string;
	}
	interface ChildTraitValueModel {
		id: System.Guid;
		styleTraitId: System.Guid;
		value: string;
		valueDisplay: string;
	}
}
declare module Insite.Dashboard.WebApi.V1.ApiModels {
	interface DashboardPanelCollectionModel extends Insite.Core.WebApi.BaseModel {
		dashboardPanels: Insite.Dashboard.WebApi.V1.ApiModels.DashboardPanelModel[];
	}
	interface DashboardPanelModel {
		text: string;
		quickLinkText: string;
		url: string;
		count: number;
		isPanel: boolean;
		isQuickLink: boolean;
		panelType: string;
		order: number;
		quickLinkOrder: number;
		openInNewTab: boolean;
	}
}
declare module Insite.Dealers.WebApi.V1.ApiModels {
	interface DealerModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		name: string;
		address1: string;
		address2: string;
		city: string;
		state: string;
		postalCode: string;
		countryId: System.Guid;
		phone: string;
		latitude: number;
		longitude: number;
		webSiteUrl: string;
		htmlContent: string;
		distance: number;
		distanceUnitOfMeasure: string;
	}
	interface DealerCollectionModel extends Insite.Core.WebApi.BaseModel {
		dealers: Insite.Dealers.WebApi.V1.ApiModels.DealerModel[];
		distanceUnitOfMeasure: string;
		pagination: Insite.Core.WebApi.PaginationModel;
		defaultLatitude: number;
		defaultLongitude: number;
		formattedAddress: string;
		defaultRadius: number;
		startDealerNumber: number;
	}
}
declare module Insite.Email.WebApi.V1.ApiModels {
	interface ShareEntityModel extends Insite.Core.WebApi.BaseModel {
		emailTo: string;
		emailFrom: string;
		subject: string;
		message: string;
		entityId: string;
		entityName: string;
	}
	interface TellAFriendModel extends Insite.Core.WebApi.BaseModel {
		friendsName: string;
		friendsEmailAddress: string;
		yourName: string;
		yourEmailAddress: string;
		yourMessage: string;
		productId: string;
		productImage: string;
		productShortDescription: string;
		altText: string;
		productUrl: string;
	}
}
declare module Insite.IdentityServer.Models {
	interface ExternalProviderLinkCollectionModel {
		externalProviders: Insite.IdentityServer.Models.ExternalProviderLinkModel[];
	}
	interface ExternalProviderLinkModel {
		caption: string;
		url: string;
	}
}
declare module Insite.Invoice.WebApi.V1.ApiModels {
	interface InvoiceModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		invoiceNumber: string;
		invoiceDate: Date;
		dueDate: Date;
		invoiceType: string;
		customerNumber: string;
		customerSequence: string;
		customerPO: string;
		status: string;
		isOpen: boolean;
		currencyCode: string;
		terms: string;
		shipCode: string;
		salesperson: string;
		btCompanyName: string;
		btAddress1: string;
		btAddress2: string;
		billToCity: string;
		billToState: string;
		billToPostalCode: string;
		btCountry: string;
		stCompanyName: string;
		stAddress1: string;
		stAddress2: string;
		shipToCity: string;
		shipToState: string;
		shipToPostalCode: string;
		stCountry: string;
		notes: string;
		productTotal: number;
		discountAmount: number;
		shippingAndHandling: number;
		otherCharges: number;
		taxAmount: number;
		invoiceTotal: number;
		currentBalance: number;
		invoiceLines: Insite.Invoice.WebApi.V1.ApiModels.InvoiceLineModel[];
		invoiceHistoryTaxes: Insite.Invoice.Services.Dtos.InvoiceHistoryTaxDto[];
		invoiceTotalDisplay: string;
		productTotalDisplay: string;
		discountAmountDisplay: string;
		taxAmountDisplay: string;
		shippingAndHandlingDisplay: string;
		otherChargesDisplay: string;
		currentBalanceDisplay: string;
		orderTotalDisplay: string;
		shipViaDescription: string;
		customerVatNumber: string;
	}
	interface InvoiceLineModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		productUri: string;
		mediumImagePath: string;
		altText: string;
		productName: string;
		manufacturerItem: string;
		customerName: string;
		shortDescription: string;
		productERPNumber: string;
		customerProductNumber: string;
		lineType: string;
		erpOrderNumber: string;
		lineNumber: string;
		releaseNumber: number;
		linePOReference: string;
		description: string;
		warehouse: string;
		notes: string;
		qtyInvoiced: number;
		unitOfMeasure: string;
		unitPrice: number;
		discountPercent: number;
		discountAmount: number;
		lineTotal: number;
		shipmentNumber: string;
		unitPriceDisplay: string;
		discountAmountDisplay: string;
		lineTotalDisplay: string;
		taxRate: number;
		taxAmount: number;
		brand: Insite.Catalog.Services.Dtos.BrandDto;
		netPriceWithVat: number;
		netPriceWithVatDisplay: string;
		unitPriceWithVat: number;
		unitPriceWithVatDisplay: string;
	}
	interface InvoiceCollectionModel extends Insite.Core.WebApi.BaseModel {
		invoices: Insite.Invoice.WebApi.V1.ApiModels.InvoiceModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
		showErpOrderNumber: boolean;
	}
	interface InvoiceSettingsModel extends Insite.Core.WebApi.BaseModel {
		lookBackDays: number;
		showInvoices: boolean;
	}
}
declare module Insite.Invoice.Services.Dtos {
	interface InvoiceHistoryTaxDto {
		taxCode: string;
		taxDescription: string;
		taxRate: number;
		taxAmount: number;
		taxAmountDisplay: string;
		sortOrder: number;
	}
}
declare module Insite.Promotions.WebApi.V1.ApiModels {
	interface PromotionModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		promotionCode: string;
		name: string;
		amount: number;
		amountDisplay: string;
		promotionApplied: boolean;
		message: string;
		orderLineId: System.Guid;
		promotionResultType: string;
	}
	interface PromotionCollectionModel extends Insite.Core.WebApi.BaseModel {
		promotions: Insite.Promotions.WebApi.V1.ApiModels.PromotionModel[];
	}
}
declare module Insite.Message.WebApi.V1.ApiModels {
	interface MessageCollectionModel extends Insite.Core.WebApi.BaseModel {
		messages: Insite.Message.WebApi.V1.ApiModels.MessageModel[];
	}
	interface MessageModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		body: string;
		subject: string;
		dateToDisplay: Date;
		isRead: boolean;
		displayName: string;
	}
	interface MessageParameter extends Insite.Core.WebApi.BaseParameter {
		customerOrderId: System.Guid;
		toUserProfileId: System.Guid;
		subject: string;
		message: string;
		process: string;
		toUserProfileName: string;
	}
}
declare module Insite.Order.WebApi.V1.ApiModels {
	interface OrderCollectionModel extends Insite.Core.WebApi.BaseModel {
		orders: Insite.Order.WebApi.V1.ApiModels.OrderModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
		showErpOrderNumber: boolean;
	}
	interface OrderModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		erpOrderNumber: string;
		webOrderNumber: string;
		orderDate: Date;
		status: string;
		statusDisplay: string;
		customerNumber: string;
		customerSequence: string;
		customerPO: string;
		currencyCode: string;
		currencySymbol: string;
		terms: string;
		shipCode: string;
		salesperson: string;
		btCompanyName: string;
		btAddress1: string;
		btAddress2: string;
		btAddress3: string;
		btAddress4: string;
		billToCity: string;
		billToState: string;
		billToPostalCode: string;
		btCountry: string;
		stCompanyName: string;
		stAddress1: string;
		stAddress2: string;
		stAddress3: string;
		stAddress4: string;
		shipToCity: string;
		shipToState: string;
		shipToPostalCode: string;
		stCountry: string;
		notes: string;
		productTotal: number;
		orderSubTotal: number;
		discountAmount: number;
		orderDiscountAmount: number;
		productDiscountAmount: number;
		shippingAndHandling: number;
		shippingCharges: number;
		handlingCharges: number;
		otherCharges: number;
		taxAmount: number;
		orderTotal: number;
		modifyDate: Date;
		requestedDeliveryDateDisplay: Date;
		orderLines: Insite.Order.WebApi.V1.ApiModels.OrderLineModel[];
		orderPromotions: Insite.Order.WebApi.V1.ApiModels.OrderPromotionModel[];
		shipmentPackages: Insite.Order.Services.Dtos.ShipmentPackageDto[];
		returnReasons: string[];
		orderHistoryTaxes: Insite.Order.Services.Dtos.OrderHistoryTaxDto[];
		productTotalDisplay: string;
		orderSubTotalDisplay: string;
		orderTotalDisplay: string;
		orderGrandTotalDisplay: string;
		discountAmountDisplay: string;
		orderDiscountAmountDisplay: string;
		productDiscountAmountDisplay: string;
		taxAmountDisplay: string;
		totalTaxDisplay: string;
		shippingAndHandlingDisplay: string;
		shippingChargesDisplay: string;
		handlingChargesDisplay: string;
		otherChargesDisplay: string;
		canAddToCart: boolean;
		canAddAllToCart: boolean;
		showTaxAndShipping: boolean;
		shipViaDescription: string;
		fulfillmentMethod: string;
		customerVatNumber: string;
		vmiLocationId: string;
		vmiLocationName: string;
	}
	interface OrderLineModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		productId: string;
		productUri: string;
		mediumImagePath: string;
		altText: string;
		productName: string;
		manufacturerItem: string;
		customerName: string;
		shortDescription: string;
		productErpNumber: string;
		customerProductNumber: string;
		requiredDate: Date;
		lastShipDate: Date;
		customerNumber: string;
		customerSequence: string;
		lineType: string;
		status: string;
		lineNumber: number;
		releaseNumber: number;
		linePOReference: string;
		description: string;
		warehouse: string;
		notes: string;
		qtyOrdered: number;
		qtyShipped: number;
		unitOfMeasure: string;
		unitOfMeasureDisplay: string;
		unitOfMeasureDescription: string;
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
		inventoryQtyOrdered: number;
		inventoryQtyShipped: number;
		unitPrice: number;
		unitNetPrice: number;
		extendedUnitNetPrice: number;
		discountPercent: number;
		discountAmount: number;
		unitDiscountAmount: number;
		promotionAmountApplied: number;
		totalDiscountAmount: number;
		lineTotal: number;
		totalRegularPrice: number;
		unitListPrice: number;
		unitRegularPrice: number;
		unitCost: number;
		orderLineOtherCharges: number;
		taxRate: number;
		taxAmount: number;
		returnReason: string;
		rmaQtyRequested: number;
		rmaQtyReceived: number;
		unitPriceDisplay: string;
		unitNetPriceDisplay: string;
		extendedUnitNetPriceDisplay: string;
		discountAmountDisplay: string;
		unitDiscountAmountDisplay: string;
		promotionAmountAppliedDisplay: string;
		totalDiscountAmountDisplay: string;
		lineTotalDisplay: string;
		totalRegularPriceDisplay: string;
		unitListPriceDisplay: string;
		unitRegularPriceDisplay: string;
		unitCostDisplay: string;
		orderLineOtherChargesDisplay: string;
		costCode: string;
		canAddToCart: boolean;
		isActiveProduct: boolean;
		sectionOptions: Insite.Order.Services.Dtos.SectionOptionDto[];
		salePriceLabel: string;
		canAddToWishlist: boolean;
		brand: Insite.Catalog.Services.Dtos.BrandDto;
		netPriceWithVat: number;
		netPriceWithVatDisplay: string;
		unitPriceWithVat: number;
		unitPriceWithVatDisplay: string;
		vmiBinNumber: string;
	}
	interface OrderPromotionModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		amount: number;
		amountDisplay: string;
		name: string;
		orderHistoryLineId: System.Guid;
		promotionResultType: string;
	}
	interface OrderStatusMappingCollectionModel extends Insite.Core.WebApi.BaseModel {
		orderStatusMappings: Insite.Order.WebApi.V1.ApiModels.OrderStatusMappingModel[];
	}
	interface OrderStatusMappingModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		erpOrderStatus: string;
		displayName: string;
		isDefault: boolean;
		allowRma: boolean;
		allowCancellation: boolean;
	}
	interface OrderSettingsModel extends Insite.Core.WebApi.BaseModel {
		allowCancellationRequest: boolean;
		allowQuickOrder: boolean;
		canReorderItems: boolean;
		canOrderUpload: boolean;
		allowRma: boolean;
		showCostCode: boolean;
		showPoNumber: boolean;
		showTermsCode: boolean;
		showErpOrderNumber: boolean;
		showWebOrderNumber: boolean;
		showOrderStatus: boolean;
		showOrders: boolean;
		lookBackDays: number;
		vmiEnabled: boolean;
	}
	interface RmaModel extends Insite.Core.WebApi.BaseModel {
		orderNumber: string;
		notes: string;
		message: string;
		rmaLines: Insite.Order.Services.Dtos.RmaLineDto[];
	}
}
declare module Insite.Order.Services.Dtos {
	interface SectionOptionDto {
		sectionOptionId: System.Guid;
		sectionName: string;
		optionName: string;
	}
	interface ShipmentPackageDto {
		id: System.Guid;
		shipmentDate: Date;
		packageNumber: string;
		carrier: string;
		shipVia: string;
		trackingUrl: string;
		trackingNumber: string;
		packSlip: string;
		shipmentPackageLineDtos: Insite.Order.Services.Dtos.ShipmentPackageLineDto[];
	}
	interface ShipmentPackageLineDto {
		id: System.Guid;
		productName: string;
		productDescription: string;
		productCode: string;
		qtyOrdered: number;
		qtyShipped: number;
		price: number;
		orderLineId: System.Guid;
	}
	interface OrderHistoryTaxDto {
		taxCode: string;
		taxDescription: string;
		taxRate: number;
		taxAmount: number;
		taxAmountDisplay: string;
		sortOrder: number;
	}
	interface RmaLineDto {
		line: number;
		rmaQtyRequested: number;
		rmaReasonCode: string;
	}
}
declare module Insite.Requisition.WebApi.V1.ApiModels {
	interface RequisitionCollectionModel extends Insite.Core.WebApi.BaseModel {
		requisitions: Insite.Requisition.WebApi.V1.ApiModels.RequisitionModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
	interface RequisitionModel extends Insite.Cart.WebApi.V1.ApiModels.CartLineModel {
		requisitionLinesUri: string;
		isApproved: boolean;
		requisitionLineCollection: Insite.Requisition.WebApi.V1.ApiModels.RequisitionLineCollectionModel;
	}
	interface RequisitionLineCollectionModel extends Insite.Core.WebApi.BaseModel {
		requisitionLines: Insite.Requisition.WebApi.V1.ApiModels.RequisitionLineModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
	interface RequisitionLineModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		costCode: string;
		firstName: string;
		lastName: string;
		userName: string;
		orderDate: Date;
		qtyOrdered: number;
		brand: Insite.Catalog.Services.Dtos.BrandDto;
	}
}
declare module Insite.Rfq.WebApi.V1.ApiModels {
	interface QuoteModel extends Insite.Cart.WebApi.V1.ApiModels.CartModel {
		quoteLinesUri: string;
		quoteNumber: string;
		expirationDate: Date;
		customerNumber: string;
		customerName: string;
		shipToFullAddress: string;
		quoteLineCollection: Insite.Rfq.WebApi.V1.ApiModels.QuoteLineModel[];
		userName: string;
		isEditable: boolean;
		messageCollection: Insite.Rfq.WebApi.V1.ApiModels.MessageModel[];
		calculationMethods: Insite.Rfq.WebApi.V1.ApiModels.CalculationMethod[];
		isJobQuote: boolean;
		jobName: string;
	}
	interface QuoteLineModel extends Insite.Cart.WebApi.V1.ApiModels.CartLineModel {
		pricingRfq: Insite.Rfq.WebApi.V1.ApiModels.PricingRfqModel;
		maxQty: number;
	}
	interface PricingRfqModel extends Insite.Core.WebApi.BaseModel {
		unitCost: number;
		unitCostDisplay: string;
		listPrice: number;
		listPriceDisplay: string;
		customerPrice: number;
		customerPriceDisplay: string;
		minimumPriceAllowed: number;
		minimumPriceAllowedDisplay: string;
		maxDiscountPct: number;
		minMarginAllowed: number;
		showListPrice: boolean;
		showCustomerPrice: boolean;
		showUnitCost: boolean;
		priceBreaks: Insite.Rfq.WebApi.V1.ApiModels.BreakPriceRfqModel[];
		calculationMethods: Insite.Rfq.WebApi.V1.ApiModels.CalculationMethod[];
		validationMessages: {[key: string]:  string};
	}
	interface BreakPriceRfqModel {
		startQty: number;
		startQtyDisplay: string;
		endQty: number;
		endQtyDisplay: string;
		price: number;
		priceDispaly: string;
		percent: number;
		calculationMethod: string;
	}
	interface CalculationMethod {
		value: string;
		name: string;
		displayName: string;
		maximumDiscount: string;
		minimumMargin: string;
	}
	interface MessageModel extends Insite.Core.WebApi.BaseModel {
		quoteId: System.Guid;
		message: string;
		displayName: string;
		body: string;
	}
	interface QuoteCollectionModel extends Insite.Core.WebApi.BaseModel {
		quotes: Insite.Rfq.WebApi.V1.ApiModels.QuoteModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
		salespersonList: Insite.Rfq.WebApi.V1.ApiModels.SalespersonModel[];
	}
	interface SalespersonModel extends Insite.Core.WebApi.BaseModel {
		salespersonNumber: string;
		name: string;
	}
	interface QuoteSettingsModel extends Insite.Core.WebApi.BaseModel {
		jobQuoteEnabled: boolean;
		quoteExpireDays: number;
	}
}
declare module Insite.WishLists.WebApi.V1.ApiModels {
	interface WishListCollectionModel extends Insite.Core.WebApi.BaseModel {
		wishListCollection: Insite.WishLists.WebApi.V1.ApiModels.WishListModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
	interface WishListModel extends Insite.Core.WebApi.BaseModel {
		wishListLinesUri: string;
		id: string;
		name: string;
		canAddAllToCart: boolean;
		canAddToCart: boolean;
		hasAnyLines: boolean;
		description: string;
		updatedOn: Date;
		updatedByDisplayName: string;
		wishListLinesCount: number;
		wishListSharesCount: number;
		isSharedList: boolean;
		sharedByDisplayName: string;
		sharedUsers: Insite.WishLists.WebApi.V1.ApiModels.WishListShareModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
		wishListLineCollection: Insite.WishLists.WebApi.V1.ApiModels.WishListLineModel[];
		allowEdit: boolean;
		shareOption: string;
		recipientEmailAddress: string;
		sendEmail: boolean;
		message: string;
		senderName: string;
		schedule: Insite.WishLists.WebApi.V1.ApiModels.WishListEmailScheduleModel;
		sendDayOfWeekPossibleValues: {[key: string]:  string};
		sendDayOfMonthPossibleValues: {[key: number]:  string};
		isGlobal: boolean;
	}
	interface WishListShareModel extends Insite.Core.WebApi.BaseModel {
		id: string;
		displayName: string;
	}
	interface WishListLineModel extends Insite.Core.WebApi.BaseModel {
		id: System.Guid;
		productUri: string;
		productId: System.Guid;
		smallImagePath: string;
		altText: string;
		productName: string;
		manufacturerItem: string;
		customerName: string;
		shortDescription: string;
		qtyOnHand: number;
		qtyOrdered: number;
		erpNumber: string;
		pricing: Insite.Core.Plugins.Pricing.ProductPriceDto;
		quoteRequired: boolean;
		isActive: boolean;
		canEnterQuantity: boolean;
		canShowPrice: boolean;
		canAddToCart: boolean;
		canShowUnitOfMeasure: boolean;
		canBackOrder: boolean;
		trackInventory: boolean;
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
		breakPrices: Insite.Core.Plugins.Pricing.BreakPriceDto[];
		unitOfMeasure: string;
		unitOfMeasureDisplay: string;
		unitOfMeasureDescription: string;
		baseUnitOfMeasure: string;
		baseUnitOfMeasureDisplay: string;
		qtyPerBaseUnitOfMeasure: number;
		selectedUnitOfMeasure: string;
		productUnitOfMeasures: Insite.Catalog.Services.Dtos.ProductUnitOfMeasureDto[];
		packDescription: string;
		createdOn: Date;
		notes: string;
		createdByDisplayName: string;
		isSharedLine: boolean;
		isVisible: boolean;
		isDiscontinued: boolean;
		sortOrder: number;
		brand: Insite.Catalog.Services.Dtos.BrandDto;
		isQtyAdjusted: boolean;
		allowZeroPricing: boolean;
	}
	interface WishListEmailScheduleModel extends Insite.Core.WebApi.BaseModel {
		repeatPeriod: string;
		repeatInterval: number;
		sendDayOfWeek: string;
		sendDayOfMonth: number;
		startDate: Date;
		endDate: Date;
		message: string;
		lastDateSent: Date;
	}
	interface WishListLineCollectionModel extends Insite.Core.WebApi.BaseModel {
		wishListLines: Insite.WishLists.WebApi.V1.ApiModels.WishListLineModel[];
		changedListLineQuantities: {[key: string]:  number};
		pagination: Insite.Core.WebApi.PaginationModel;
	}
	interface WishListSettingsModel extends Insite.Core.WebApi.BaseModel {
		allowMultipleWishLists: boolean;
		allowEditingOfWishLists: boolean;
		allowWishListsByCustomer: boolean;
		allowListSharing: boolean;
		productsPerPage: number;
		enableWishListReminders: boolean;
	}
}
declare module Insite.JobQuote.WebApi.V1.ApiModels {
	interface JobQuoteModel extends Insite.Cart.WebApi.V1.ApiModels.CartModel {
		jobQuoteId: string;
		isEditable: boolean;
		expirationDate: Date;
		jobName: string;
		jobQuoteLineCollection: Insite.JobQuote.WebApi.V1.ApiModels.JobQuoteLineModel[];
		customerName: string;
		shipToFullAddress: string;
		orderTotal: number;
		orderTotalDisplay: string;
	}
	interface JobQuoteLineModel extends Insite.Cart.WebApi.V1.ApiModels.CartLineModel {
		pricingRfq: Insite.Rfq.WebApi.V1.ApiModels.PricingRfqModel;
		maxQty: number;
		qtySold: number;
		qtyRequested: number;
	}
	interface JobQuoteCollectionModel extends Insite.Core.WebApi.BaseModel {
		jobQuotes: Insite.JobQuote.WebApi.V1.ApiModels.JobQuoteModel[];
		pagination: Insite.Core.WebApi.PaginationModel;
	}
}
declare module Insite.RealTimePricing.WebApi.V1.ApiModels {
	interface RealTimePricingModel extends Insite.Core.WebApi.BaseModel {
		realTimePricingResults: Insite.Core.Plugins.Pricing.ProductPriceDto[];
	}
}
declare module Insite.RealTimeInventory.WebApi.V1.ApiModels {
	interface RealTimeInventoryModel extends Insite.Core.WebApi.BaseModel {
		realTimeInventoryResults: Insite.Core.Plugins.Inventory.ProductInventoryDto[];
	}
}
declare module Insite.Core.Plugins.Inventory {
	interface ProductInventoryDto {
		productId: System.Guid;
		qtyOnHand: number;
		inventoryAvailabilityDtos: Insite.Core.Plugins.Inventory.InventoryAvailabilityDto[];
		inventoryWarehousesDtos: Insite.Core.Plugins.Inventory.InventoryWarehousesDto[];
		additionalResults: {[key: string]:  string};
	}
	interface InventoryAvailabilityDto {
		unitOfMeasure: string;
		availability: Insite.Catalog.Services.Dtos.AvailabilityDto;
	}
	interface InventoryWarehousesDto {
		unitOfMeasure: string;
		warehouseDtos: Insite.Catalog.Services.Dtos.WarehouseDto[];
	}
}
declare module Insite.Payments.WebApi.V1.ApiModels {
	interface PaymentAuthenticationParameter extends Insite.Core.WebApi.BaseParameter {
		transactionId: string;
		cardNumber: string;
		expirationMonth: number;
		expirationYear: number;
		orderAmount: string;
		operation: string;
		isPaymentProfile: boolean;
	}
	interface PaymentAuthenticationModel {
		transactionId: string;
		webOrderNumber: string;
		redirectHtml: string;
		threeDs: Insite.Cart.Services.Dtos.ThreeDsDto
		sessionData: string;
		action: string;
	}
}
declare module Insite.Data.Entities {
	enum CmsType {
		Classic = 0,
		Spire = 1
	}
}

