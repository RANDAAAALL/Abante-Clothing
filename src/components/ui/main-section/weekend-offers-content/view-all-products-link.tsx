import Link from "next/link";

export default function ViewAllProductsLink(){
    return (
        <Link href="/all-products" className="font-medium text-md py-3">View All Products</Link>
    );
}