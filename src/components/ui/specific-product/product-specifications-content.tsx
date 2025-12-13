import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";

export default function ProductSpecificationsContent({ props }: { props: ProductProps<Partial<TshirtType>> }) {
  return (
    <div className="w-full md:max-w-none mx-auto">
      <h2 className="font-bold text-xl">Product Specifications</h2>
      {/* Grid layout for specifications */}
      <div className="mt-4 grid grid-cols-[140px_1fr] gap-y-5 md:gap-7 gap-x-3 text-sm md:text-base">
        {/* Product Type */}
        <span className="font-medium">Product Type:</span>
        <span className="capitalize">{props.product_item_type} T-Shirt</span>

        {/* Fit */}
        <span className="font-medium">Fit:</span>
        <span>{props.product_item_fit}</span>

        {/* Material */}
        <span className="font-medium">Material:</span>
        <span>{props.product_item_material}</span>

        {/* Construction */}
        <span className="font-medium">Construction:</span>
        <span>{props.product_item_construction}</span>

        {/* Design Features */}
        <span className="font-medium">Design Features:</span>
        <span>{props.product_item_design_features}</span>

      </div>
    </div>
  );
}
