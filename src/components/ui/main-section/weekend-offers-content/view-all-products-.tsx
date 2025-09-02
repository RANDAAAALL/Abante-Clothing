import Link from "next/link";

export default function ViewAllProducts(){
    return (
        <Link href="/products" className="font-medium mt-15 text-md">View All Products</Link>
    );
}