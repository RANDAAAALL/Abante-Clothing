"use client";
import usePaginationAndFiltered from "@/hooks/usePaginatedAndFiltered";
import { AddressProps } from "@/lib/types/address-types";
import { BillingProps } from "@/lib/types/billing-types";
import { Card } from "../../carousel/card";
import PaginationSelection from "../../pagination/paginated-selection";
import { AddressAndBillingClientDataProps } from "@/lib/types/address-and-billing-types";
import { useAddressAndBillingModal } from "@/lib/store/address-and-billing";
import AddressAndBillingContentModal from "../../modal/address-and-billing/address-and-billing-content";
import { Trash, UserPen } from "lucide-react";
import { mapBillingAndAddressToFormSchema } from "@/lib/helper/map-billing-and-address-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { DeleteAddressOrBillingURL } from "@/lib/config";
import { useState } from "react";

export default function AddressAndBillingClientData<T extends BillingProps | AddressProps>({
  title,
  clientData,
}: AddressAndBillingClientDataProps<T>) {
  const { itemsPerPage, currentPage, setCurrentPage, currentData } = usePaginationAndFiltered({ props: clientData }, 3);
  const { isOpen,
          setOpen,
          setTitle,
          setClose,
          setAction,
          setAddressID,
          setResetTitle,
          setResetAction,
          setSelectFormData,
          setClearAddressID,
          setClearSelectedFormData,
        } = useAddressAndBillingModal();
  const router = useRouter();
  const [ isDeleteLoading, setDeleteLoading ] = useState<boolean>(false);
  // console.log("Billing Datas: ", clientData)

  const handleAddData = (actionTitle: string, action: string) => {
    setTitle(`Add new ${actionTitle}`);
    setAction(action)
    setOpen(); 
  }

  const handleEditData = (actionTitle: string, action: string, address_ID: number, clientData: (AddressProps | BillingProps)[]) => {
    const selected = clientData.find(data => data.address_ID === address_ID);
    if(!selected) return;

    const { address_ID: id } = selected;
    const formData = mapBillingAndAddressToFormSchema(selected);
    
    setAddressID(id);
    setSelectFormData({
      ...formData,
      address_ID: id,
    });
    setOpen();
    setTitle(`Edit ${actionTitle}`);
    setAction(action)
  }

  const handleDeleteData = async (actionTitle: string, address_ID: number) => {
     return toast.promise(
          (async () => {
            setDeleteLoading(true);
            const res = await fetchWithCsrf(`${DeleteAddressOrBillingURL}/${address_ID}`, {
              method: "DELETE",
              body: JSON.stringify({ title: actionTitle }),
            });

            const data = await res.json();
            if(!res.ok) throw new Error(`${data?.errorMessage}`);

            return data;
          })(), {
              loading: "Deleting...",
              success: (success) => {
                  setClose();
                  setResetTitle();
                  setResetAction();
                  setClearSelectedFormData(); 
                  setClearAddressID();
                  router.refresh();
                  return success?.successMessage;
              },
              error: (e) => e?.message || "Failed to add."
          },{ duration: 5000 }
          ).finally(() => {
            setDeleteLoading(false);
          }
      );
    };
    return (
        <div className="space-y-2">
              <div className="flex flex-col md:flex-row text-center justify-between">
          <p className="p-0 font-regular">
            Select or manage your {title}
          </p>
          <button 
          disabled={isDeleteLoading}
          onClick={() => handleAddData(title, "Add")}
          className={`${isDeleteLoading ? "cursor-not-allowed" : "cursor-pointer"} text-sm py-3 md:-mt-4 px-3 font-medium bg-slight-gray-background dark:bg-[#3B3B3B] rounded-md`}>
            + Add new {title}
          </button>
        </div>

        {clientData.length <= 0 ? (
          <div className="flex items-center justify-center h-50 md:h-120">
            <p>Your {title} is currently empty.</p>
          </div>
        ) : (
          <>
          {currentData.map((data, index) => {
            const address_ID = data.address_ID;        

            const firstName =
              "billingFirstName" in data
                ? data.billingFirstName
                : (data as AddressProps).recipientFirstName;

            const lastName =
              "billingLastName" in data
                ? data.billingLastName
                : (data as AddressProps).recipientLastName;

            const companyName =
              "billingCompanyName" in data
                ? data.billingCompanyName
                : (data as AddressProps).companyName;

            const apartmentName =
              "billingApartmentName" in data
                ? data.billingApartmentName
                : (data as AddressProps).apartmentName;

            const addressName =
              "billingAddressName" in data
                ? data.billingAddressName
                : (data as AddressProps).addressName;

            const cityName =
              "billingCityName" in data
                ? data.billingCityName
                : (data as AddressProps).cityName;

            const regionName =
              "billingRegionName" in data
                ? data.billingRegionName
                : (data as AddressProps).regionName;

            const postalCode =
              "billingPostalCode" in data
                ? data.billingPostalCode
                : (data as AddressProps).postalCode;

            const phoneNumber =
              "billingPhoneNumber" in data
                ? data.billingPhoneNumber
                : (data as AddressProps).phoneNumber;

            const country = data.country ?? "Philippines";

            return (
              <Card
                key={index}
                className="py-3 gap-0 px-5 cursor-pointer dark:bg-card-black-background rounded-sm hover:bg-slight-gray-background dark:hover:bg-[#3B3B3B]">
                <div className="flex items-center space-x-2 font-medium">
                  <div className="h-5 w-5 rounded-full bg-gray-300"></div>
                  <div>
                    <span>{firstName}</span> <span>{lastName}</span>
                  </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col mt-1 text-sm">
                      {companyName && <span>{companyName}</span>}

                      <span>
                        {apartmentName && `${apartmentName}, `}
                        {addressName}, {cityName}
                      </span>

                      <span>
                        {regionName}, {country}, {postalCode}
                      </span>

                      <span>{phoneNumber}</span>
                    </div>

                    <div className="flex flex-col text-sm">
                      <button 
                        disabled={isDeleteLoading}
                        onClick={() => handleEditData(title, "Edit", address_ID, clientData)}
                        className={`${isDeleteLoading ? "cursor-not-allowed" : ""} flex space-x-1 hover:bg-gray-300 hover:rounded-md p-1`}>
                        <span><UserPen width={17} height={17}/></span>
                        <span>Edit</span>
                      </button>
  
                      <button 
                        disabled={isDeleteLoading}
                        onClick={() => handleDeleteData(title, address_ID)}
                        className={`${isDeleteLoading ? "cursor-not-allowed" : ""} flex space-x-1 hover:bg-gray-300 hover:rounded-md p-1`}>
                        <span><Trash width={17} height={17}/></span>
                        <span>Delete</span>
                      </button>
                    </div>
                </div>
              </Card>
            );
          })}

          <PaginationSelection
            style="mt-4"
            totalItems={clientData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
      {isOpen && <AddressAndBillingContentModal />}
    </div>

  );
}
