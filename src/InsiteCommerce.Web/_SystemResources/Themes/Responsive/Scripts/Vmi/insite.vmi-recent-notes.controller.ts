module insite.account {
    "use strict";

    import ISearchFilter = insite.order.ISearchFilter;

    export class VmiRecentNotesController {
        orders: OrderModel[];

        static $inject = ["$scope", "coreService", "orderService"];

        constructor(
            protected $scope: ng.IScope,
            protected coreService: core.ICoreService,
            protected orderService: order.IOrderService) {
        }

        $onInit(): void {
            this.getOrders();
        }

        getOrders(): void {
            const searchFilter: ISearchFilter = {
                customerSequence: "-1",
                sort: "OrderDate DESC",
                toDate: "",
                fromDate: "",
                vmiOrdersOnly: true,
                expand: "vmidetails"
            };

            const pagination = {
                page: 1,
                pageSize: 5
            } as PaginationModel;
            
            this.orderService.getOrders(searchFilter, pagination).then(
                (orderCollection: OrderCollectionModel) => { this.getOrdersCompleted(orderCollection); },
                (error: any) => { this.getOrdersFailed(error); });
        }

        protected getOrdersCompleted(orderCollection: OrderCollectionModel): void {
            this.orders = orderCollection.orders;
        }

        protected getOrdersFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("VmiRecentNotesController", VmiRecentNotesController);
}