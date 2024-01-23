import { Order, OrderId, Product } from "./types";

export class ApiClient {

  readonly url: string;

  constructor(url: string = "http://localhost:3000") {
    this.url = url;
  }

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${this.url}/orders`);
    
    return await response.json();
  }

  async getOrderById(id: OrderId): Promise<Order> {
    const response = await fetch(`${this.url}/orders/${id}`);
    
    return await response.json();
  }

  async getHeatPumps(): Promise<Product[]> {
    const response = await fetch(`${this.url}/heatPumps`);
    
    return await response.json();
  }

  async getTools(): Promise<Product[]> {
    const response = await fetch(`${this.url}/tools`);
    
    return await response.json();
  }

  async getInstallationMaterials(): Promise<Product[]> {
    const response = await fetch(`${this.url}/installationMaterials`);
    
    return await response.json();
  }
}