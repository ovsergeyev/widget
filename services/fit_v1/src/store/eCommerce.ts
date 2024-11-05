import { defineStore } from 'pinia';
import { IECommercePurchase, IECommerceProduct } from '../types/IECommerce';

export const useECommerceStore = defineStore('eCommerce', () => {
  // const offers = ref<IOffer[]>([]);

  const addPurchase = (purchase: IECommercePurchase) => {
    if(typeof window !== 'undefined' && (window as any).dataLayer){
      (window as any).dataLayer.push({
        "ecommerce": {
          "purchase": purchase
        }
      });
    };
  };

  const addImpressions = (products: IECommerceProduct[]) => {
    if(typeof window !== 'undefined' && (window as any).dataLayer){
      (window as any).dataLayer.push({
        "ecommerce": {
          "currencyCode": "RUB",
          "impressions": products
        }
      });
    };
  }

  const addProducts = (products: IECommerceProduct[]) => {
    if(typeof window !== 'undefined' && (window as any).dataLayer){
      (window as any).dataLayer.push({
        "ecommerce": {
          "currencyCode": "RUB",
          "add": {
            "products": products
          }
        }
      });
    };
  }

  const delProducts = (products: IECommerceProduct[]) => {
    if(typeof window !== 'undefined' && (window as any).dataLayer){
      (window as any).dataLayer.push({
        "ecommerce": {
          "currencyCode": "RUB",
          "remove": {
            "products": products
          }
        }
      });
    };
  }

  return {
    addImpressions,
    addProducts,
    addPurchase,
    delProducts
  };
});