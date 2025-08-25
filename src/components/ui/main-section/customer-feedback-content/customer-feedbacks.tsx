import CustomerImageDescContent from "./customer-image-desc";

export default function CustomerFeedbacks(){
    return (
        <>
        {/* title */}
        <p className="font-black text-4xl sm:text-5xl py-10 mt-10">What Our Customers Are Saying</p>

        {/* customers feedback image, description and rating */}
        <CustomerImageDescContent />
        </>
    );
}