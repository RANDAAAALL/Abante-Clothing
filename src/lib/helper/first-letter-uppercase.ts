
export const firstLetterUpcase = (str: string) => {
    const upperCaseList = ["paymaya", "gcash", "pending"];
    return upperCaseList.some(list => str === list) ? str[0].toUpperCase() + str.slice(1) : str;
};
