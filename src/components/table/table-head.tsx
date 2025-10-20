import { TableHeadProps } from "@/lib/types/table-head-types";

export default function TableHead<T extends Record<string, unknown>>({
    TheadData
}: TableHeadProps<T>){
    return (
        <thead>
            <tr>
                {TheadData.map((data, i) => (
                    <th key={i} className="border border-gray-300 text-wrap py-5 px-3 text-sm">{String(data)}</th>
                ))}
            </tr>
        </thead>
    );
};