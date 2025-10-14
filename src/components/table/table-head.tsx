import { TableHeadProps } from "@/lib/types/table-head-types";

export default function TableHead({
    TheadData
}: TableHeadProps){
    return (
        <thead>
            <tr>
                {TheadData.map((data, i) => (
                    <th key={i} className="border border-gray-300 text-wrap py-2 px-3 text-sm">{data}</th>
                ))}
            </tr>
        </thead>
    );
};