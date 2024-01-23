export enum OrderCurrency {
  EUR = "EUR",
  GBP = "GBP"
}

export type OrderId = string;

export type ProductId = string;

export type ProductCode = string;
export type ProductType = "heatPump" | "tool" | "installationMaterial";

export type PackageId = string;

export type InvoiceId = string;

export type ISO8601Date = string;

export type Product = {
  id: ProductId,
  productCode: ProductCode,
  name: string,
  description: string,
  stock: number,
  productType: ProductType
  unitPrice?: number,
}

export type Order = {
  id: OrderId,
  articles: ProductId[],
  installationDate: ISO8601Date
}

export enum OrderStatus {
  FULLFILLED,
  NOT_FULLFILLED
}

export type ProcessedOrder = {
  status: OrderStatus,
  statusInfo: string,
  packages?: OrderPackages,
  invoice?: Invoice,
  installationDate?: ISO8601Date
}

export type OrderPackages = {
  [productId: ProductId]: {
    productCode: ProductCode,
    amount: number,
    description: string,
    totalPrice: number
  } 
}

export type Invoice = {
  id: InvoiceId,
  totalPrice: string,
  currency: OrderCurrency
}