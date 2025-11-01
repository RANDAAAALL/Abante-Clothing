
export const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday = 0
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // monday start
  return new Date(d.setDate(diff));
}
