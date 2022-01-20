/**
 * Contains the pre-defined widget groups in the order they're displayed in the Shell UI.
 */
const WidgetGroups = [
    "Testing",
    "Basic",
    "Common",
    "Contact Us",
    "Categories",
    "Header",
    "Catalog",
    "Products",
    "Product Details",
    "Order Approval List",
    "Order Approval Details",
    "Order History",
    "Order Details",
    "Order Status",
    "Return Request (RMA)",
    "My Account",
    "Wish Lists",
    "RFQ Job Quotes",
    "RFQ Job Quote Details",
    "RFQ My Quotes",
    "RFQ Request Quote",
    "RFQ Quote Confirmation",
    "RFQ Quote Details",
    "Addresses",
    "My Lists",
    "Cart",
    "Cart Reminder Unsubscribe",
    "My Lists Details",
    "Account Settings",
    "Checkout - Shipping",
    "Invoice History",
    "BudgetManagement",
    "Checkout - Review & Submit",
    "Sign In",
    "Product List",
    "Product Compare",
    "Order Confirmation",
    "Invoice Details",
    "Change Password",
    "Brands",
    "Brand Details",
    "Saved Payments",
    "Create Account",
    "Order Upload",
    "Quick Order",
    "Footer",
    "Reset Password",
    "Robots Txt",
    "Change Customer",
    "Location Finder",
    "Saved Order Details",
    "Saved Order List",
    "Mobile",
    "User List",
    "User Setup",
    "Static List",
    "Requisition Confirmation",
    "Requisitions",
    "Dealer Details",
    "News List",
    "News Page",
    "VMI Locations",
    "VMI Location Details",
    "VMI Reporting",
    "VMI Users",
] as const;

export default WidgetGroups;

/** Pre-defined widget groups for display in the Shell UI. */
export type WidgetGroup = typeof WidgetGroups[number];
