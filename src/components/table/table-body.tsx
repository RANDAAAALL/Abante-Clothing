import { TableBodyProps } from "@/lib/types/table-body-types";

export default function TableBody<T extends Record<string,string | number>>({
    TheadData,
    TbodyData,
}: TableBodyProps<T>){
    return (
            <>
                <tbody>
                    {TbodyData.map((row, i) => (
                        <tr key={i}>
                            {TheadData && TheadData?.length > 0 ? ( 
                                <>
                                    {TheadData?.map((header, j) => (
                                        <td key={j} className="border border-gray-300 text-wrap py-2 px-5 text-sm">{row[String(header)] ?? "-"}</td>))}
                                </>
                            ) : (
                                <>
                                    <td key={i} className="border border-gray-300 text-wrap py-2 px-5 text-sm">{String(row)}</td>
                                </>
                        )}    

                    </tr>
                ))}
            </tbody>
        </>
    );
}