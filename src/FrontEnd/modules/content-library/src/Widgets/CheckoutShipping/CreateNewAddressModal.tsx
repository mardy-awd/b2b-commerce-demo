import React, { useState } from "react";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import CustomerAddressForm, { CustomerAddressFormStyles } from "@insite/content-library/Components/CustomerAddressForm";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";

interface OwnProps {
    newAddress: ShipToModel;
    isModalOpen: boolean;
    onModalClose: () => void;
    onFormSubmit: (event: React.FormEvent<HTMLFormElement>, newAddress: ShipToModel) => void;
    extendedStyles?: CreateNewAddressModalStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    shipToAddressFields: getAddressFieldsDataView(state).value?.shipToAddressFields,
    countries: getCurrentCountries(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface CreateNewAddressModalStyles {
    modal?: ModalPresentationProps;
    addressForm?: CustomerAddressFormStyles;
}

const baseStyles: CreateNewAddressModalStyles = {};

export const createNewAddressModalStyles = baseStyles;

const CreateNewAddressModal = ({
                                   newAddress,
                                   isModalOpen,
                                   onModalClose,
                                   onFormSubmit,
                                   extendedStyles,
                                   countries,
                                   shipToAddressFields,
                               }: Props) => {
    if (!countries || !shipToAddressFields) {
        return null;
    }

    const [styles] = useState(() => mergeToNew(baseStyles, extendedStyles));

    return (
        <Modal
            {...styles.modal}
            headline={translate("Create New Address")}
            isOpen={isModalOpen}
            handleClose={onModalClose}
            data-test-selector="checkoutShipping_createAddressModal"
        >
            <CustomerAddressForm
                address={newAddress}
                countries={countries}
                addressFieldDisplayCollection={shipToAddressFields}
                onSubmit={onFormSubmit}
                onCancel={onModalClose}
                extendedStyles={styles.addressForm}
            />
        </Modal>
    );
};

export default connect(mapStateToProps)(CreateNewAddressModal);