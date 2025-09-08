import { TshirtType } from "@/lib/types/t-shirt-types";

export default function ProductSpecifications({ props }: { props: Partial<TshirtType> }) {
  return (
    <div className="w-full md:max-w-none mx-auto px-5">
      {/* Title */}
      <span className="font-bold text-lg">Product Specifications</span>

      {/* Grid layout for specifications */}
      <div className="mt-3 grid grid-cols-[140px_1fr] gap-y-5 md:gap-7 gap-x-3 text-sm md:text-base">
        {/* Product Type */}
        <span className="font-medium">Product Type:</span>
        <span className="capitalize">{props.product_item_size?.split(/\s+/)[0]} T-Shirt</span>

        {/* Fit */}
        <span className="font-medium">Fit:</span>
        <span>{props.product_item_size}</span>

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
