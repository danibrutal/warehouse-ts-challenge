import { ApiClient } from "./apiClient";
import { OrderProcessor } from "./orderProcessor";
import { OrderQueue } from "./orderQueue";
import { StockManager } from "./stockManager";
import { Order } from "./types";

const RESTOCKING_THRESHOLD = 5;

const apiClient = new ApiClient();

const stockManager = new StockManager(
  apiClient
);
const orderQueue = new OrderQueue(apiClient);
const orderProcessor = new OrderProcessor(stockManager);

// 1. Loads products and orders, and processes all orders.
// 2. Displays a list of restocking products based on threshold above
Promise.all([stockManager.loadProducts(), orderQueue.loadOrders()]).then(()=>{
  let order: Order | false;

  while((order = orderQueue.nextOrder()) !== false) {
    const processed = orderProcessor.process(order);
    console.log(processed);
  }

  const restockingList = stockManager.getRestockingList(RESTOCKING_THRESHOLD);

  console.log("restockingList", restockingList);
});
