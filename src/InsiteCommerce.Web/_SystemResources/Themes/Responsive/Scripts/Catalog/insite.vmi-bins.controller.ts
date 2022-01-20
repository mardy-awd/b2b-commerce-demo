module insite.catalog {
    "use strict";

    export class VmiBinsController extends BaseVmiBinsController{

        paginationStorageKey = "DefaultPaginationVmiBinList";

        static $inject = ["$scope", "vmiBinService", "coreService", "paginationService", "queryString", "deleteVmiBinsModalService", "vmiBinModalService", "spinnerService"];

        constructor(
            protected $scope: ng.IScope,
            protected vmiBinService: vmiBin.IVmiBinService,
            protected coreService: core.ICoreService,
            protected paginationService: core.IPaginationService,
            protected queryString: common.IQueryStringService,
            protected deleteVmiBinsModalService: vmiBin.IDeleteVmiBinsModalService,
            protected vmiBinModalService: vmiBin.IVmiBinModalService,
            protected spinnerService: core.ISpinnerService) {
            super(vmiBinService, coreService, paginationService, queryString, spinnerService);
        }

        $onInit(): void {
            super.$onInit();

            this.$scope.$on("vmi-bins-were-deleted", () => {
                if (this.pagination) {
                    this.pagination.page = 1;
                }

                this.getVmiBins();
            });

            this.$scope.$on("vmi-bin-was-created", () => {
                this.getVmiBins();
            });

            this.$scope.$on("vmi-bins-were-imported", () => {
                this.getVmiBins();
            });
        }

        openAddProductModal(): void {
            this.vmiBinModalService.display({
                vmiBin: { vmiLocationId: this.locationId },
                broadcastCreateStr: "vmi-bin-was-created",
                showImport: true
            });
        }

        deleteVmiBins(): void {
            this.deleteVmiBinsModalService.display({
                vmiBins: this.vmiBins.filter(o => this.isSelected[o.id.toString()]),
                broadcastStr: "vmi-bins-were-deleted"
            });
        }
    }

    angular
        .module("insite")
        .controller("VmiBinsController", VmiBinsController);
}