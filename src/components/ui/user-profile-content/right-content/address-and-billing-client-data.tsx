"use client";
import usePaginationAndFiltered from "@/hooks/usePaginatedAndFiltered";
import { AddressProps } from "@/lib/types/address-types";
import { BillingProps } from "@/lib/types/billing-types";
import { Card } from "../../carousel/card";
import PaginationSelection from "../../pagination/paginated-selection";
import { AddressAndBillingClientDataProps } from "@/lib/types/address-and-billing-client-types";
import { useAddressAndBillingModal } from "@/lib/store/address-and-billing";
import AddressAndBillingContentModal from "../../modal/address-and-billing/address-and-billing-content";
import { Check, Trash, UserPen } from "lucide-react";
import { mapBillingAndAddressToFormSchema } from "@/lib/helper/map-billing-and-address-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { AddSelectedAddressOrBillingURL, DeleteAddressOrBillingURL, RemoveSelectedAddressOrBillingURL } from "@/lib/config";
import { useState } from "react";

export default function AddressAndBillingClientData<T extends BillingProps | AddressProps>({
  title,
  clientData,
}: AddressAndBillingClientDataProps<T>) {
  const { itemsPerPage, currentPage, setCurrentPage, currentData } = usePaginationAndFiltered({ props: clientData }, 3);
  const { isOpen,
          setOpen,
          setTitle,
          setAction,
          setAddressID,
          setResetTitle,
          setResetAction,
          setSelectFormData,
          setClearAddressID,
          setClearSelectedFormData,
        } = useAddressAndBillingModal();
  const router = useRouter();
  const [ isLoading, setLoading ] = useState<boolean>(false);
  const selectedAddress = clientData.find(id => id.is_selected);

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
            setLoading(true);
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
                setResetTitle();
                setResetAction();
                setClearSelectedFormData(); 
                setClearAddressID();
                router.refresh();
                return success?.successMessage;
              },
              error: (e) => e?.message || "Failed to delete."
          },{ duration: 5000 }
          ).finally(() => {
            setLoading(false);
          }
      );
  };

  const handleSelectAddress = async (actionTitle: string, address_ID: number) => {
      return toast.promise(
        (async () => {
          setLoading(true);
          const res = await fetchWithCsrf(`${AddSelectedAddressOrBillingURL}/${address_ID}`, {
            method: "PUT",
            body: JSON.stringify({ title: actionTitle }),
          });
          
          const data = await res.json();
          if(!res.ok) throw new Error(`${data?.errorMessage}`);
          
          return data;
        })(), {
          loading: `Selecting as default ${actionTitle}...`,
          success: (success) => {
              setResetTitle();
              setResetAction();
              setClearSelectedFormData(); 
              setClearAddressID();
              router.refresh();
              return success?.successMessage;
            },
            error: (e) => e?.message || `Failed to select ${actionTitle}.`
        },{ duration: 5000 }
        ).finally(() => {
          setLoading(false);
        }
    );
  };

  const handleRemoveSelectedAddressOrBilling = async (actionTitle: string, address_ID: number) => {
    return toast.promise(
      (async () => {
        setLoading(true);
        const res = await fetchWithCsrf(`${RemoveSelectedAddressOrBillingURL}/${address_ID}`, {
          method: "PUT",
          body: JSON.stringify({ title: actionTitle }),
        });
        
        const data = await res.json();
        if(!res.ok) throw new Error(`${data?.errorMessage}`);
        
        return data;
      })(), {
        loading: `Removing default ${actionTitle}...`,
        success: (success) => {
            setResetTitle();
            setResetAction();
            setClearSelectedFormData(); 
            setClearAddressID();
            router.refresh();
            return success?.successMessage;
          },
          error: (e) => e?.message || `Failed to remove.`
      },{ duration: 5000 }
      ).finally(() => {
        setLoading(false);
      }
  );
  }
    return (
        <div className="space-y-2">
          <div className="flex flex-col text-center md:flex-row md:text-left justify-between">
            <p className="p-0 font-regular">Select or manage your {title}</p>
            <button 
            disabled={isLoading}
            onClick={() => handleAddData(title, "Add")}
            className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"} hyphens-auto text-sm py-3 md:-mt-4 px-3 font-medium bg-slight-gray-background dark:bg-[#3B3B3B] rounded-md`}>
              + Add new {title}
            </button>
          </div>

         {selectedAddress?.is_selected &&  ( 
          <Card className="py-3 gap-0 px-5  dark:bg-card-black-background rounded-sm">
            <div className="flex flex-col space-y-0 gap-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                {/* Left side: check and title */}
                <div className="flex gap-1 font-medium text-center sm:text-left">
                  <Check width={24} height={24} className="shrink-0" />
                  <span className="text-lg sm:text-xl leading-tight">
                    Selected default {title}
                  </span>
                </div>
                <button
                  disabled={isLoading}
                  onClick={() => handleRemoveSelectedAddressOrBilling(title, selectedAddress?.address_ID)}
                  className={`${
                    isLoading ? "cursor-not-allowed opacity-60" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  } flex justify-center gap-1 px-2 py-1 rounded-md text-sm w-fit self-center sm:self-auto`}>
                  <Trash width={16} height={16} />
                  <span>Remove</span>
                </button>
              </div>

              <div className="flex space-x-1.5 mt-1">
                <span>{mapBillingAndAddressToFormSchema(selectedAddress).recipientFirstName}</span> 
                <span>{mapBillingAndAddressToFormSchema(selectedAddress).recipientLastName}</span> 
              </div>
              <div className="flex space-x-1.5">
                {mapBillingAndAddressToFormSchema(selectedAddress).companyName && <span>{mapBillingAndAddressToFormSchema(selectedAddress).companyName}</span>}
              </div>

              <span>
                {mapBillingAndAddressToFormSchema(selectedAddress).apartmentName && `${mapBillingAndAddressToFormSchema(selectedAddress).apartmentName}, `}
                {mapBillingAndAddressToFormSchema(selectedAddress).addressName}, {mapBillingAndAddressToFormSchema(selectedAddress).cityName}
              </span>

              <span>
                {mapBillingAndAddressToFormSchema(selectedAddress).regionName}, {mapBillingAndAddressToFormSchema(selectedAddress).country}, {mapBillingAndAddressToFormSchema(selectedAddress).postalCode}
              </span>

              <span>{mapBillingAndAddressToFormSchema(selectedAddress).phoneNumber}</span>
            </div>
          </Card>
        )}

        {clientData.length <= 0 ? (
          <div className="flex items-center justify-center h-50 md:h-120">
            <p>Your {title} is currently empty.</p>
          </div>
        ) : (
          <>
          {currentData.map((data, index) => {
            const address_ID = data.address_ID;        
            const firstName = "billingFirstName" in data ? data.billingFirstName : (data as AddressProps).recipientFirstName;
            const lastName = "billingLastName" in data ? data.billingLastName : (data as AddressProps).recipientLastName;
            const companyName = "billingCompanyName" in data ? data.billingCompanyName : (data as AddressProps).companyName;
            const apartmentName = "billingApartmentName" in data ? data.billingApartmentName : (data as AddressProps).apartmentName;
            const addressName = "billingAddressName" in data ? data.billingAddressName : (data as AddressProps).addressName;
            const cityName = "billingCityName" in data ? data.billingCityName : (data as AddressProps).cityName;
            const regionName = "billingRegionName" in data ? data.billingRegionName : (data as AddressProps).regionName;
            const postalCode = "billingPostalCode" in data ? data.billingPostalCode : (data as AddressProps).postalCode;
            const phoneNumber = "billingPhoneNumber" in data ? data.billingPhoneNumber : (data as AddressProps).phoneNumber;
            const country = data.country ?? "Philippines";

            return (
              <Card
                key={index}
                className={`py-3 gap-0 px-5 dark:bg-card-black-background rounded-sm ${ selectedAddress?.address_ID === data?.address_ID ? "border-2 border-black dark:border-white" : ""}`}>
                <div className="flex items-center space-x-2 font-medium">
                  <button 
                  disabled={isLoading}
                  onClick={() => handleSelectAddress(title, address_ID)}
                  className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"} h-5 w-5 rounded-full bg-gray-300 ${ selectedAddress?.address_ID === data?.address_ID ? "bg-gray-950 dark:bg-gray-500" : "hover:bg-gray-950 dark:hover:bg-gray-500"}`}>
                  </button>
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
                        disabled={isLoading}
                        onClick={() => handleEditData(title, "Edit", address_ID, clientData)}
                        className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"} flex space-x-1 hover:bg-gray-300 dark:hover:bg-gray-500 hover:rounded-md p-1`}>
                        <span><UserPen width={17} height={17}/></span>
                        <span>Edit</span>
                      </button>
  
                      <button 
                        disabled={isLoading}
                        onClick={() => handleDeleteData(title, address_ID)}
                        className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"} flex space-x-1 hover:bg-gray-300 dark:hover:bg-gray-500 hover:rounded-md p-1`}>
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
