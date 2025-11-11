   
// determine button style based on the action type
export const getButtonStyle = (actionText: string | number) => {
const text = String(actionText);

// for completed states with specific colors
if (text === "✓ Order Completed") {
    return "w-full py-2 text-xs font-semibold rounded-md transition bg-green-600 text-white hover:bg-green-700";
} else if (text === "✓ No Returns Left") {
    return "w-full py-2 text-xs font-semibold rounded-md transition bg-red-600 text-white hover:bg-red-700";
} 
// for other completed states (fallback)
else if (text.includes("✓")) {
    return "w-full py-2 text-xs font-semibold rounded-md transition bg-gray-400 text-white hover:bg-gray-500";
} 
// default active buttons
else {
    return "w-full py-2 text-xs font-semibold rounded-md transition bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200";
}
};