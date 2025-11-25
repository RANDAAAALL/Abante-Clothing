import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { TshirtType } from "../types/t-shirt-types";
import { withRetry } from "../helper/db-pool";

// export const getAllProductsCached = unstable_cache(
//   async () => {
//     try {
//       const temp = await prisma.product_items.findMany({
//         where: { product_item_status: "available" },
//         distinct: ["product_item_name"],
//         select: {
//           product_item_ID: true,
//           product_item_name: true,
//           product_item_color: true,
//           product_item_price: true,
//           product_item_type: true,
//           product_item_fit: true,
//           product_item_discount: true,
//           product_item_image: true,
//           product_item_size: true,
//         },
//       });

//       // Return empty array if no products
//       if (!temp || temp.length === 0) return [];

//       // Map to your type and convert decimals safely
//       const AllRelatedProducts: TshirtType[] = temp.map((p) => ({
//         ...p,
//         product_item_price:
//           typeof p.product_item_price === "number"
//             ? p.product_item_price
//             : p.product_item_price?.toNumber?.() ?? 0,
//         alt: `${p.product_item_ID}-${p.product_item_name} alt`,
//       }));

//       return AllRelatedProducts;
//     } catch (err: unknown) {
//       console.error(
//         "[getAllProductsCached] Failed to fetch products:",
//         err instanceof Error ? err.message : err
//       );
//       return [];
//     }
//   },
//   ["all-products"],
//   { tags: ["all-products"], revalidate: 30 }
// );
export const getAllProductsCached = unstable_cache(
  async () => {
    console.log('🔄 [getAllProductsCached] START - Function executing...');
    console.log('📊 [getAllProductsCached] Environment:', process.env.NODE_ENV);
    console.log('📊 [getAllProductsCached] Prisma instance:', prisma ? 'exists' : 'missing');
    
    if (prisma) {
      console.log('🔍 [getAllProductsCached] Prisma details:', {
        hasProductItems: '$product_items' in prisma,
        isConnected: await prisma.$executeRaw`SELECT 1`.catch(() => false)
      });
    }

    try {
      console.log('🎯 [getAllProductsCached] Attempting database query...');
      const startTime = Date.now();
      
      const temp = await withRetry(async () => {
        console.log('🔄 [getAllProductsCached] withRetry attempt...');
        const result = await prisma.product_items.findMany({
          where: { product_item_status: "available" },
          distinct: ["product_item_name"],
          select: {
            product_item_ID: true,
            product_item_name: true,
            product_item_color: true,
            product_item_price: true,
            product_item_type: true,
            product_item_fit: true,
            product_item_discount: true,
            product_item_image: true,
            product_item_size: true,
          },
        });
        
        console.log(`✅ [getAllProductsCached] Query successful, found ${result?.length || 0} items`);
        return result;
      }, 3, 1000);

      const queryTime = Date.now() - startTime;
      console.log(`⏱️ [getAllProductsCached] Query completed in ${queryTime}ms`);

      if (!temp) {
        console.warn('⚠️ [getAllProductsCached] Query returned null/undefined');
        return [];
      }

      if (temp.length === 0) {
        console.warn('⚠️ [getAllProductsCached] Query returned empty array');
        return [];
      }

      console.log('🔧 [getAllProductsCached] Processing results...');
      console.log('📝 [getAllProductsCached] Sample first item:', temp[0] ? {
        id: temp[0].product_item_ID,
        name: temp[0].product_item_name,
        price: temp[0].product_item_price,
        type: typeof temp[0].product_item_price
      } : 'No items');

      const AllRelatedProducts: TshirtType[] = temp.map((p, index) => {
        const priceValue = typeof p.product_item_price === "number"
          ? p.product_item_price
          : (p.product_item_price?.toNumber?.() ?? 0);
        
        // Debug first few items
        if (index < 3) {
          console.log(`💰 [getAllProductsCached] Item ${index} price conversion:`, {
            original: p.product_item_price,
            converted: priceValue,
            type: typeof p.product_item_price
          });
        }

        return {
          ...p,
          product_item_price: priceValue,
          alt: `${p.product_item_ID}-${p.product_item_name} alt`,
        };
      });

      console.log(`🎉 [getAllProductsCached] SUCCESS - Returning ${AllRelatedProducts.length} products`);
      console.log('📦 [getAllProductsCached] First product sample:', AllRelatedProducts[0] ? {
        id: AllRelatedProducts[0].product_item_ID,
        name: AllRelatedProducts[0].product_item_name,
        price: AllRelatedProducts[0].product_item_price,
        alt: AllRelatedProducts[0].alt
      } : 'No products');

      return AllRelatedProducts;

    } catch (err: unknown) {
      console.error('❌ [getAllProductsCached] CRITICAL ERROR:');
      console.error('❌ [getAllProductsCached] Error type:', typeof err);
      console.error('❌ [getAllProductsCached] Error instance of Error:', err instanceof Error);
      
      if (err instanceof Error) {
        console.error('❌ [getAllProductsCached] Error name:', err.name);
        console.error('❌ [getAllProductsCached] Error message:', err.message);
        console.error('❌ [getAllProductsCached] Error stack:', err.stack);
        
        // Check for specific Prisma error types
        if (err.name.includes('Prisma') || err.message.includes('prisma')) {
          console.error('🔍 [getAllProductsCached] This appears to be a Prisma-specific error');
        }
      } else {
        console.error('❌ [getAllProductsCached] Unknown error object:', err);
      }

      console.error('❌ [getAllProductsCached] Failed to fetch products, returning empty array');
      return [];
    } finally {
      console.log('🏁 [getAllProductsCached] FINISH - Function completed');
    }
  },
  ["all-products"],
  { 
    tags: ["all-products"], 
    revalidate: 30 
  }
);