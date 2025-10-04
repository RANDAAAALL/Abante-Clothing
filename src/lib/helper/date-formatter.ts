
export const DateFormatter = (feedback_date: string) => {
    if (!feedback_date) return "N/A";
    const formattedDate = new Date(feedback_date);

    return [
        String(formattedDate.getDate()).padStart(2, "0"),
        String(formattedDate.getMonth() + 1).padStart(2, "0"),
        formattedDate.getFullYear(),
    ].join("-");
}