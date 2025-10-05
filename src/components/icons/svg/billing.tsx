
export default function BillingSVG(props?: React.SVGProps<SVGSVGElement>){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 20"
        fill="none" stroke="currentColor"
        className="stroke-2 lucide lucide-receipt-text-icon lucide-receipt-text">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
        <path d="M14 8H8"/>
        <path d="M16 12H8"/>
        <path d="M13 16H8"/>
        </svg>
    );
}