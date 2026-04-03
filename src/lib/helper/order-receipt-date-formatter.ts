export const OrderReceiptDateFormatter = (utcString: string) => {
    const date = new Date(utcString);
  
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  
    const parts = formatter.formatToParts(date);
  
    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value || "";
  
    const month = get("month").toUpperCase();
    const day = get("day");
    const year = get("year");
    const hour = get("hour");
    const minute = get("minute");
    const dayPeriod = get("dayPeriod");
  
    const result = `${month}-${day}-${year}-${hour}:${minute}${dayPeriod}`;
  
    return result;
  };