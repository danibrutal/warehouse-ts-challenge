import { ApiClient } from "./apiClient";
import { OrderQueue } from "./orderQueue";

import { Order } from "./types";

let queue: OrderQueue;

beforeAll(async () => {
  queue = new OrderQueue(new ApiClient());

  await queue.loadOrders();
});

describe("OrderQueue.nextOrder()", () => {

  it('It can retrieve next order in the queue', () => {
    const order = queue.nextOrder() as Order;
    expect(typeof order).toBe("object");

    expect(order.id).toBe("fne2irj3-fvni34-532ncvi3-432");
  });

});
