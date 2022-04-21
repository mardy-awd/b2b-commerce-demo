export function convertDateToDateOnlyString(date: Date | undefined) {
    if (!date) {
        return "";
    }

    const month = date.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : month;
    const day = date.getDate();
    const dateString = day < 10 ? `0${day}` : day;

    return `${date.getFullYear()}-${monthString}-${dateString}`;
}

const tzOffset = new Date().getTimezoneOffset() * 60000;

export function convertDateOnlyStringToDate(dateString: string | undefined) {
    return dateString ? new Date(new Date(dateString).getTime() + tzOffset) : undefined;
}
