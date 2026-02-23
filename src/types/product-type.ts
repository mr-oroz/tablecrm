export interface ProductType {
  name: string;
  type: "product" | "service";
  description_short?: string;
  description_long?: string;
  code: string;
  unit: number;
  category: number;
  cashback_type: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords: string[];
  global_category_id: number;
  marketplace_price: number;
  chatting_percent: number;
  address?: string;
  latitude: number;
  longitude: number;
}