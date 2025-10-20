import { isProductValue } from "@/lib/helper/isProductValue";
import { TableBodyProps } from "@/lib/types/table-body-types";
import Image from "next/image";

export default function TableBody<T extends Record<string, unknown>>({
  TheadData,
  TbodyData,
}: TableBodyProps<T>) {
  return (
    <tbody>
      {TbodyData.map((row, i) => (
        <tr key={i}>
          {TheadData?.map((header, j) => {
            const value = row[String(header)];
            return (
              <td key={j} className="border border-gray-300 text-wrap py-2 px-5 text-sm">
                {isProductValue(value) ? (
                   <div className="flex flex-col items-center justify-center gap-1">
                   {value.image && (
                     <div className="relative w-16 h-16">
                       <Image
                         src={value.image}
                         alt={value.name}
                         width={64}
                         height={64}
                         className="object-contain rounded-md"
                       />
                     </div>
                   )}
                   <span className="text-center text-sm font-medium">{value.name}</span>
                 </div>
                ) : (
                  String(value ?? "-")
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
