"use client"
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { TableBodyProps } from "@/lib/types/table-body-types";
export default function TableBody<T extends Record<string, string | number>>({
  TheadData,
  TbodyData,
}: TableBodyProps<T>){
  const { setOpenModal, setOrderPurchasedNumber } = useOrderHistoryReceiptModal();

  return (
    <tbody>
      {TbodyData.map((row, i) => (
        <tr key={i}>
          {(TheadData?.length ?? 0) > 0
            ? TheadData?.map((header, j) => (
                <td key={j}
                  className="border border-gray-300 text-wrap py-3 px-5 text-sm h-13">
                  {header === "Actions" ? ( 
                    <button 
                      onClick={() => {
                        setOpenModal();
                        setOrderPurchasedNumber(String(row["ORD-NO"]));
                      }}
                      className="cursor-pointer p-2 bg-card-black-background dark:bg-card-white-background rounded-sm text-white dark:text-black">
                      {row[String(header)]}
                    </button>
                    ) : (
                      <>{row[String(header)] ?? "-"}</>
                   )}
                </td>
              ))
            : (
                <td className="border border-gray-300 text-wrap py-2 px-5 text-sm">
                  {String(row)}
                </td>
              )}
        </tr>
      ))}
    </tbody>
  );  
}