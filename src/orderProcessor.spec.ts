import { ApiClient } from "./apiClient";
import { OrderProcessor } from "./orderProcessor";
import { OrderQueue } from "./orderQueue";
import { StockManager } from "./stockManager";
import { OrderStatus } from "./types";

let apiClient: ApiClient;
let queue: OrderQueue;
let orderProcessor: OrderProcessor;
let stockManager: StockManager;

beforeAll(async () => {
  apiClient = new ApiClient();
  queue = new OrderQueue(apiClient);
  stockManager = new StockManager(apiClient);
  orderProcessor = new OrderProcessor(stockManager);

  await queue.loadOrders();
  await stockManager.loadProducts();
});

describe("OrderProcessor.process()", () => {

  it('returns a fulfilled order if all products available', async () => {
    const orderId = "rt30wi-12nf-25u-dm3r032ko4";
    const order = await apiClient.getOrderById(orderId);

    const processed = orderProcessor.process(order);

    expect(processed.status).toBe(OrderStatus.FULLFILLED);
  });

  it('returns an unfulfilled order if product is out of stock', async () => {
    const orderIdWithArticleOutOfStock = "fne2irj3-fvni34-532ncvi3-432";
    const articleIdOutOfStock = "gn0234i-fvb32559y78tr83h-cnb5y498eff-nf230";
    const order = await apiClient.getOrderById(orderIdWithArticleOutOfStock);

    const processed = orderProcessor.process(order);

    expect(processed.status).toBe(OrderStatus.NOT_FULLFILLED)
    expect(processed.statusInfo).toBe(`${articleIdOutOfStock} out of stock`)
  });

  it('Total price is calculated correctly after the order is processed', async () => {
    const orderId = "rt30wi-12nf-25u-dm3r032ko4";
    const order = await apiClient.getOrderById(orderId);
    const priceExpected = "€ 6.789,76";

    expect(orderProcessor.process(order).invoice?.totalPrice).toBe(priceExpected);
  });

  it('returns packages and invoice', async () => {
    const orderId = "fne92i-vn345jec0-324ec0weji";
    const order = await apiClient.getOrderById(orderId);

    const processed = orderProcessor.process(order);

    expect(Object.keys(processed.packages || {}).length).toBe(6);
  });
});
