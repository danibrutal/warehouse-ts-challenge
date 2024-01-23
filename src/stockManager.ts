import { ApiClient } from "./apiClient";
import { ProductNotInCatalogException } from "./exceptions/product-not-in-catalog.exception";
import { ProductOutOfStockException } from "./exceptions/product-out-of-stock.exception";
import { Product, ProductId } from "./types";

export class StockManager {
  
  readonly client: ApiClient

  products: {[productId: ProductId]: Product} = {};

  constructor(apiClient: ApiClient) {
    this.client = apiClient;
  }

  async loadProducts () {
    await this.loadHeatPumps();
    await this.loadTools();
    await this.loadInstallationMaterials();
  }

  getProduct (productId: ProductId) {
    if (typeof this.products[productId] === "undefined") {
      throw new ProductNotInCatalogException(`${productId} not in catalog`);
    }

    return this.products[productId]; 
  }

  updateStockLevels(productId: ProductId, amountRequired: number) {
    const product = this.getProduct(productId);

    if (product.stock < amountRequired) {
      throw new ProductOutOfStockException(
        `${productId} out of stock`
      );
    }

    product.stock -= amountRequired;
  }

  getRestockingList(threshold = 5): Product[] {
    const productIds = Object.keys(this.products);
    if (productIds.length === 0) {
      return [];
    }

    const products: Product[] = [];

    productIds.reduce((products, productId: ProductId) => {
      if (this.products[productId].stock <= threshold) {
        products.push(this.products[productId]);
      }
      
      return products;

    }, products);

    // sort by order with less stock first
    products.sort((a: Product, b: Product) => a.stock - b.stock);

    return products;
  }

  private async loadHeatPumps() {
    const heatPumps = await this.client.getHeatPumps();

    heatPumps.map((product: Product)=> {
      this.products[product.id] = product;
      this.products[product.id].productType = "heatPump";
    })
  }

  private async loadTools() {
    const tools = await this.client.getTools();

    tools.map((product: Product)=> {
      this.products[product.id] = product;
      this.products[product.id].productType = "tool";
    })
  }

  private async loadInstallationMaterials() {
    const installationMaterials = await this.client.getInstallationMaterials();

    installationMaterials.map((product: Product)=> {
      this.products[product.id] = product;
      this.products[product.id].productType = "installationMaterial";
    })
  }
  
}