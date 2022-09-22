import { getCookie, removeCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import {
    stopWatchingForOtherTabSessionChange,
    watchForOtherTabSessionChange,
} from "@insite/client-framework/Services/SessionService";
import { SettingsCollectionModel } from "@insite/client-framework/Services/SettingsService";

export interface UpdateContextModel {
    languageId?: string | null;
    currencyId?: string | null;
    fulfillmentMethod?: string | null;
    billToId?: string | null;
    shipToId?: string | null;
    settings?: SettingsCollectionModel;
}

export function updateContext(context: UpdateContextModel) {
    if (IS_SERVER_SIDE) {
        return;
    }

    stopWatchingForOtherTabSessionChange(); // Prevent reload from the changes we're doing here.

    const secure = window.location.protocol === "https";
    const isRememberedUser = !!getCookie("SetRememberedUserId");
    const expires = isRememberedUser ? context.settings?.accountSettings.daysToRetainUser || 30 : undefined;

    if (typeof context.languageId !== "undefined") {
        if (context.languageId === null) {
            removeCookie("CurrentLanguageId");
        } else {
            setCookie("CurrentLanguageId", context.languageId, { path: "/", secure });
        }
    }

    if (typeof context.currencyId !== "undefined") {
        if (context.currencyId === null) {
            removeCookie("CurrentCurrencyId");
        } else {
            setCookie("CurrentCurrencyId", context.currencyId, { path: "/", secure });
        }
    }

    if (typeof context.fulfillmentMethod !== "undefined") {
        if (context.fulfillmentMethod === null) {
            removeCookie("CurrentFulfillmentMethod");
        } else {
            setCookie("CurrentFulfillmentMethod", context.fulfillmentMethod, { path: "/", secure, expires });
        }
    }

    if (typeof context.billToId !== "undefined") {
        if (context.billToId === null) {
            removeCookie("CurrentBillToId");
        } else {
            setCookie("CurrentBillToId", context.billToId.toString(), { path: "/", secure, expires });
        }
    }

    if (typeof context.shipToId !== "undefined") {
        if (context.shipToId === null) {
            removeCookie("CurrentShipToId");
        } else {
            setCookie("CurrentShipToId", context.shipToId.toString(), { path: "/", secure, expires });
        }
    }

    watchForOtherTabSessionChange(); // Restart the watcher with the updated "current" state.
}
