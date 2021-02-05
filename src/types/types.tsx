export interface DataSizes {
  available: boolean;
  size: string;
  sku: string;
}

export interface Data {
  actual_price: string;
  code_color: string;
  color: string;
  color_slug: string;
  discount_percentage: string;
  image: string;
  installments: string;
  name: string;
  on_sale: boolean;
  regular_price: string;
  sizes: DataSizes[];
  style: string;
  id: number;
  sizeChozen: string;
}
