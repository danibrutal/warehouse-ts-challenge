# Warehouse Typescript Challenge

Hi!

For the challenge, I assumed the following:
- Orders are pushed to a queue
- A worker processes orders from the queue
- After an order has been processed, stock levels are updated in a stock/product db

Based on this, I created the following objects:
- *OrderQueue*, to simulate the queue
- *StockManager*, for both accessing product information and stock levels. This object
is also responsible for updating stock levels (in a prod environment, probably we would
split this differently)
- *OrderProcessor*, which represents the worker that will process all orders from the queue

Some leftovers and caveats:
- Invoice management. In a production environment, I would probably handle it differently
- Updating stock levels are not done in a transactional way
- I tested mostly happy flows and obvious issues, but for a production code, I would
test throughly other edge cases

Thank you!