import CustomerImageDescContent from "./customer-image-desc";

export default function CustomerFeedbacks(){
    return (
        <>
        {/* title */}
        <p className="font-black text-4xl text-center sm:text-5xl py-10 mt-10">What Our Customers <br className="md:hidden"/> Are Saying</p>

        {/* customers feedback image, description and rating */}
        <CustomerImageDescContent />
        </>
    );
}