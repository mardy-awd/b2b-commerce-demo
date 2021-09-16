import VmiLocationCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiLocationCollectionModel;

module insite.catalog {
    "use strict";

    export interface IVmiLocationsService {
        getVmiLocations(filter?: string, page?: number, pageSize?: number): any;
    }

    export class VmiLocationsService implements IVmiLocationsService {
        serviceUri = "api/v1/vmilocations";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: core.HttpWrapperService) {
        }

        getVmiLocations(filter?: string, page?: number, pageSize?: number) {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "GET", url: this.serviceUri, params: this.getVmiLocationsParams(filter, page, pageSize) }),
                this.getLocationsCompleted,
                this.getLocationsFailed
            );
        }

        protected getVmiLocationsParams(filter?: string, page?: number, pageSize?: number): any {
            const params: any = { filter };

            if (page) {
                params.page = page;
            }

            if (pageSize) {
                params.pageSize = pageSize;
            }

            return params;
        }

        protected getLocationsCompleted(response: ng.IHttpPromiseCallbackArg<VmiLocationModel>): void {
        }

        protected getLocationsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }
    }

    angular
        .module("insite")
        .service("vmiLocationsService", VmiLocationsService);
}