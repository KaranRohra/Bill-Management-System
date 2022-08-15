export const formatDateTime = (dateTime) => {
    dateTime = new Date(dateTime).toString();
    dateTime = dateTime.split(" ");
    let newDateTime = "";
    for (let i = 0; i < dateTime.length; i++) {
        if (dateTime[i].startsWith("GMT")) break;

        newDateTime += " " + dateTime[i];
    }
    return newDateTime;
};
