module insite.payment {
    "use strict";

    import PaymentAuthenticationParameter = Insite.Payments.WebApi.V1.ApiModels.PaymentAuthenticationParameter;
    import PaymentAuthenticationModel = Insite.Payments.WebApi.V1.ApiModels.PaymentAuthenticationModel;

    export interface IPaymentService {
        authenticate(parameter: PaymentAuthenticationParameter): ng.IPromise<PaymentAuthenticationModel>;
        getAuthenticationStatus(transactionId: string): ng.IPromise<PaymentAuthenticationModel>;
    }

    export class PaymentService implements IPaymentService {
        serviceUri = "/api/v1/paymentauthentication";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: core.HttpWrapperService) {
        }

        authenticate(parameter: PaymentAuthenticationParameter): ng.IPromise<PaymentAuthenticationModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "POST", url: this.serviceUri, data: parameter }),
                this.authenticationSucceeded,
                this.authenticationFailed
            );
        }

        protected authenticationSucceeded(response: ng.IHttpPromiseCallbackArg<PaymentAuthenticationModel>): void {
        }

        protected authenticationFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }
        
         getAuthenticationStatus(transactionId: string): ng.IPromise<PaymentAuthenticationModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "GET", url: `${this.serviceUri}/${transactionId}` }),
                this.getAuthenticationStatusSucceeded,
                this.getAuthenticationStatusFailed
            );
        }
        
        protected getAuthenticationStatusSucceeded(response: ng.IHttpPromiseCallbackArg<PaymentAuthenticationModel>): void {
        }

        protected getAuthenticationStatusFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }
    }

    angular
        .module("insite")
        .service("paymentService", PaymentService);
}