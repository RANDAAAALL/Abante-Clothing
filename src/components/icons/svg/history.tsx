

export default function HistorySVG(props?: React.SVGProps<SVGSVGElement>){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="lucide lucide-history-icon lucide-history stroke-2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
        <path d="M12 7v5l4 2"/>
        </svg>
    );
}


