

export default function AddToCartAndBuyNowButtons(){
    
    return (
        <>
        {
         ["Add to Card", "Buy now"].map((button, i) => (
            <button className="font-regular py-2 w-full rounded-sm text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black" key={i}>{button}</button>))
        }
        </>
    );
}