module insite.account {
    "use strict";

    import VmiBinCountModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinCountModel;

    export class VmiSlowMovingController {
        count: number;

        static $inject = ["$scope", "vmiBinService"];

        constructor(
            protected $scope: ng.IScope,
            protected vmiBinService: vmiBin.IVmiBinService) {
        }

        $onInit(): void {
            this.vmiBinService.getVmiBinCount({ numberOfPreviousOrders: 0, numberOfVisits: 2 }).then(
                (vmiBinCountModel: VmiBinCountModel) => { this.getVmiBinCountCompleted(vmiBinCountModel); },
                (error: any) => { this.getVmiBinCountFailed(error); });
        }

        protected getVmiBinCountCompleted(vmiBinCountModel: VmiBinCountModel): void {
            this.count = vmiBinCountModel.count;
        }

        protected getVmiBinCountFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("VmiSlowMovingController", VmiSlowMovingController);
}