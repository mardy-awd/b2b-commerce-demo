module insite.account {
    "use strict";

    export class MySavedPaymentsController {
        savedPayments: AccountPaymentProfileModel[];
        savedPaymentForDelete: AccountPaymentProfileModel;

        static $inject = [
            "coreService",
            "spinnerService",
            "accountService",
            "editSavedPaymentPopupService",
            "addSavedPaymentPopupService",
            "$scope",
            "settingsService",
            "tokenExIFrameService"];

        constructor(
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected accountService: IAccountService,
            protected editSavedPaymentPopupService: IEditSavedPaymentPopupService,
            protected addSavedPaymentPopupService: IAddSavedPaymentPopupService,
            protected $scope: ng.IScope,
            protected settingsService: core.ISettingsService,
            protected tokenExIFrameService: insite.common.ITokenExIFrameService) {
        }

        $onInit(): void {
            this.getPaymentProfiles();

            this.settingsService.getSettings().then(
                (settings: core.SettingsCollection) => {
                    this.getSettingsCompleted(settings);
                },
                (error: any) => {
                    this.getSettingsFailed(error);
                });

            this.$scope.$on("$locationChangeStart", () => {
                this.tokenExIFrameService.removeScript();
            });
        }

        protected getPaymentProfiles(): void {
            this.spinnerService.show();
            this.accountService.getPaymentProfiles(null, { pageSize: 999 } as PaginationModel).then(
                (accountPaymentProfileCollection: AccountPaymentProfileCollectionModel) => { this.getPaymentProfilesCompleted(accountPaymentProfileCollection); },
                (error: any) => { this.getPaymentProfilesFailed(error); });
        }

        protected getPaymentProfilesCompleted(accountPaymentProfileCollection: AccountPaymentProfileCollectionModel): void {
            this.savedPayments = accountPaymentProfileCollection.accountPaymentProfiles;
        }

        protected getPaymentProfilesFailed(error: any): void {
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.tokenExIFrameService.addScript(settingsCollection.websiteSettings);
        }

        protected getSettingsFailed(error: any): void {
        }

        makeDefault(savedPayment: AccountPaymentProfileModel): void {
            savedPayment.isDefault = true;
            this.accountService.updatePaymentProfile(savedPayment.id, savedPayment).then(
                (accountPaymentProfile: AccountPaymentProfileModel) => { this.makeDefaultCompleted(accountPaymentProfile); },
                (error: any) => { this.makeDefaultFailed(error); });
        }

        protected makeDefaultCompleted(accountPaymentProfile: AccountPaymentProfileModel): void {
            this.getPaymentProfiles();
        }

        protected makeDefaultFailed(error: any): void {
        }

        setSavedPaymentForDelete(savedPayment: AccountPaymentProfileModel): void {
            this.savedPaymentForDelete = savedPayment;
        }

        closeModal(selector: string): void {
            this.coreService.closeModal(selector);
        }

        deleteSavedPayment(): void {
            if (!this.savedPaymentForDelete) {
                return;
            }

            this.closeModal("#popup-delete-card");
            this.spinnerService.show();
            this.accountService.deletePaymentProfiles(this.savedPaymentForDelete.id).then(
                () => { this.deletePaymentProfilesCompleted(); },
                (error: any) => { this.deletePaymentProfilesFailed(error); });
        }

        protected deletePaymentProfilesCompleted(): void {
            this.getPaymentProfiles();
        }

        protected deletePaymentProfilesFailed(error: any): void {
        }

        openEditPopup(savedPayment: AccountPaymentProfileModel): void {
            this.editSavedPaymentPopupService.display({ savedPayment, savedPayments: this.savedPayments, afterSaveFn: () => { this.getPaymentProfiles(); } });
        }

        openAddPopup(): void {
            this.addSavedPaymentPopupService.display({ savedPayments: this.savedPayments, afterSaveFn: () => { this.getPaymentProfiles(); } });
        }
    }

    angular
        .module("insite")
        .controller("MySavedPaymentsController", MySavedPaymentsController);
}