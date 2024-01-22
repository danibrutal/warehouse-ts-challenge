export type Currency = "EUR" | "LBS"

export type OrderId = string;

export type ProductId = string;

export type ProductCode = string;
export type ProductCode = string;
export type ProductType = "heatPump" | "tool" | "installationMaterial";

export type PackageId = string;

export type InvoiceId = string;

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
  installationDate: Date
}

export type Package = {
  id: PackageId,
  orderId: OrderId,
  invoiceId: InvoiceId,
  installationDate: Date
}

export type Invoice = {
  id: InvoiceId,
  totalPrice: number,
  currency: Currency
}