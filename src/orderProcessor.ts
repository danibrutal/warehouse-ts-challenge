import { StockManager } from "./stockManager";
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderCurrency, OrderPackages, OrderStatus, ProcessedOrder, ProductId } from "./types";
import { ProductOutOfStockException } from "./exceptions/product-out-of-stock.exception";

export class OrderProcessor {
  readonly stockManager;

  constructor(stockManager: StockManager) {
    this.stockManager = stockManager;
  }

  process(order: Order): ProcessedOrder {
    const packages: OrderPackages = this.getOrderPackages(order);

    // if products are out of stock, return early
    try {
      this.updateStockLevels(packages);
    } catch (e) {
      if (e instanceof ProductOutOfStockException) {
        return {
          status: OrderStatus.NOT_FULLFILLED,
          statusInfo: e.message
        }
      }
    }

    const totalOrderPrice = this.calculateTotalPrice(packages);

    const processedOrder: ProcessedOrder = {
      status: OrderStatus.FULLFILLED,
      statusInfo: "ok",
      packages,
      invoice: {
        id: uuidv4(),
        currency: OrderCurrency.EUR,
        totalPrice: this.formatPrice(totalOrderPrice)
      },
      installationDate: order.installationDate
    };

    return processedOrder;
  }

  private formatPrice (rawPrice: number) {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(
      rawPrice,
    )
  }

  private calculateTotalPrice (packages: OrderPackages) {
    const totalPrice = Object.keys(packages).reduce((totalPrice, productId: ProductId) => {
      const packagePrice = packages[productId].totalPrice;

      return totalPrice + packagePrice;
    }, 0);

    console.log(totalPrice, packages);

    return totalPrice;
  }

  /**
   * in a production context, we would want to update 
   * stock levels from all products at once, with a lock,
   * or similar strategies
   */
  private updateStockLevels(packages: OrderPackages) {
    Object.keys(packages).forEach((productId: ProductId)=> {
      this.stockManager.updateStockLevels(productId, packages[productId].amount);
    })
  }

  private getOrderPackages(order: Order) {
    const packages: OrderPackages = {};
    const productsIndexedById: {[productId: ProductId]: number} = {}; 

    order.articles.reduce((products, productId: ProductId)=> {
      products[productId] = products[productId] || 0;
      products[productId]++;

      return products;
    }, productsIndexedById);

    const productIds = Object.keys(productsIndexedById);

    productIds.reduce((packages, productId: ProductId) => {
      const product = this.stockManager.getProduct(productId);
      
      packages[productId] = {
        productCode: product.productCode,
        amount: productsIndexedById[productId],
        description: product.description,
        totalPrice: typeof product.unitPrice !== "undefined" 
          ? (product.unitPrice * productsIndexedById[productId]) 
          : 0
      }

      return packages;
    }, packages);

    return packages;
  }
}