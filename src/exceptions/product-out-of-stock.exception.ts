export class ProductOutOfStockException extends Error {
  constructor(message: string) {
    super(message);

    // Set the name of the exception
    this.name = 'ProductOutOfStockException';
  }
}