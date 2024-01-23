import { ApiClient } from "./apiClient";
import { Order } from "./types";

export class OrderQueue {
  
  readonly client: ApiClient

  orders: Order[] = [];

  constructor(apiClient: ApiClient) {
    this.client = apiClient;
  }

  async loadOrders () {
    this.orders = await this.client.getOrders();
  }

  // Returns false if there are no more orders
  // in the queue
  nextOrder (): Order | false {
    const order = this.orders.pop();

    if (typeof order === "undefined") {
      return false;
    }

    return order;
  }
}