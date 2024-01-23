export class ProductNotInCatalogException extends Error {
  constructor(message: string) {
    super(message);

    // Set the name of the exception
    this.name = 'ProductNotInCatalogException';
  }
}