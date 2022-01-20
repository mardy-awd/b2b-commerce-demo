module insite.catalog {
    "use strict";

    export class VmiReportingController extends BaseVmiBinsController {
        paginationStorageKey = "DefaultPaginationVmiBinList";
        metric = "All Products";
        time = new Date().getTime();
        numberOfPreviousOrders: number;
        numberOfTimesMinQtyReached: number;
        numberOfVisits: number;

        changeMetric(): void {
            this.searchFilter.isBelowMinimum = this.metric === "Below Minimum";
            this.resetFilter();
        }

        resetFilter(): void {
            this.numberOfPreviousOrders = 0;
            this.numberOfTimesMinQtyReached = 2;
            this.numberOfVisits = this.metric === "Slow Moving" ? 2 : 4;
            this.reloadVmiBins();
        }

        reloadVmiBins(): void {
            this.searchFilter.numberOfPreviousOrders = this.metric === "Slow Moving" ? this.numberOfPreviousOrders : undefined;
            this.searchFilter.numberOfTimesMinQtyReached = this.metric === "Fast Moving" ? this.numberOfTimesMinQtyReached : undefined;
            this.searchFilter.numberOfVisits = this.numberOfVisits;
            this.getVmiBins();
        }
    }

    angular
        .module("insite")
        .controller("VmiReportingController", VmiReportingController);
}