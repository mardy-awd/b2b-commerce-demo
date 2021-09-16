import VmiLocationModel = Insite.Catalog.WebApi.V1.ApiModels.VmiLocationModel;

module insite.catalog {
    "use strict";

    export class VmiLocationsController {
        pagination: PaginationModel;
        paginationStorageKey = "DefaultPagination-VmiLocationSearch";
        savedLocations: VmiLocationModel[];
        searchFilter: string;
        defaultPageSize = 20;

        static $inject = ["coreService", "paginationService", "vmiLocationsService"];

        constructor(
            protected coreService: core.ICoreService,
            protected paginationService: core.IPaginationService,
            protected vmiLocationsService: catalog.IVmiLocationsService) {
        }

        $onInit(): void {
            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey, { page: 1, pageSize: this.defaultPageSize } as PaginationModel);
            this.searchFilter = this.getDefaultSearchFilter();
        }

        clear(): void {
            this.pagination.page = 1;
            this.searchFilter = this.getDefaultSearchFilter();
        }

        search(): void {
            if (this.pagination) {
                this.pagination.page = 1;
            }

            this.getLocations();
        }

        getLocations(): void {
            this.updateHistory();
            this.vmiLocationsService.getVmiLocations(this.searchFilter, this.pagination.page, this.pagination.pageSize).then(
                (locationCollection: VmiLocationCollectionModel) => { this.getLocationsCompleted(locationCollection); },
                (error: any) => { this.getLocationsFailed(error); });
        }

        protected getLocationsCompleted(locationCollection: VmiLocationCollectionModel): void {
            this.savedLocations = locationCollection.vmiLocations;
            this.pagination = locationCollection.pagination;
        }

        protected getLocationsFailed(error: any): void {
        }

        protected updateHistory(): void {
            this.coreService.replaceState({ filter: this.searchFilter, pagination: this.pagination });
        }

        protected getDefaultSearchFilter(): string {
            return "";
        }
    }

    angular
        .module("insite")
        .controller("VmiLocationsController", VmiLocationsController);
}