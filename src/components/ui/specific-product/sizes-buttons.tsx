import { useCartItems } from "@/lib/store/cart-items";


export default function TshirtSizesButtons(){
    const { selectedSize, setSelectedSize } = useCartItems();
    return (
        <>
        <div>
            <span className="font-bold text-md">Size</span>
        </div>
        
        <div className="flex gap-2">      
        {["XS", "S", "M", "L", "XL", "OS"].map((size, i) => (
            <button onClick={() => setSelectedSize(size)}
            key={i}
            className={`font-regular text-xs mt-1 cursor-pointer rounded-sm w-10 py-2
            ${selectedSize === size
            ? "bg-gray-400 text-white"
            : "bg-card-black-background text-white dark:bg-card-white-background dark:text-black"}`}>
            {size}
            </button>
        ))}
        </div>
        </>
    );
}