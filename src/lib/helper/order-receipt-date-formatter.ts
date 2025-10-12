export const OrderReceiptDateFormatter = (utcString: string) => {
    const date = new Date(utcString);
  
    const phOptions = { timeZone: "Asia/Manila" };
    const phDate = new Date(date.toLocaleString("en-US", phOptions));
  
    const month = phDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = String(phDate.getDate()).padStart(2, "0");
    const year = phDate.getFullYear(); 
  
    let hours = phDate.getHours();
    const minutes = String(phDate.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; 
  
    return `${month}-${day}-${year}-${hours}:${minutes}${ampm}`;
}
  