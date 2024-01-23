import { ApiClient } from "./apiClient";
import { ProductNotInCatalogException } from "./exceptions/product-not-in-catalog.exception";
import { ProductOutOfStockException } from "./exceptions/product-out-of-stock.exception";
import { StockManager } from "./stockManager";

let stockManager: StockManager;

beforeAll(async () => {
  stockManager = new StockManager(new ApiClient());

  await stockManager.loadProducts();
});

describe("StockManager.getProduct()", () => {
  it('It can deliver a product based on ID and stock needed', () => {
    const installationMaterialId = "rj30rfi-c230cu-fh3039iv-12c";
    const product = stockManager.getProduct(installationMaterialId);

    expect(typeof product).toBe("object");
    expect(product.stock).toBe(1455);
    expect(product.unitPrice).toBe(1.99);
  });

  it('It loads product with the right product type', () => {
    const installationMaterialId = "rj30rfi-c230cu-fh3039iv-12c";
    const product = stockManager.getProduct(installationMaterialId);

    expect(product.productType).toBe("installationMaterial");
  });

  it('It can retrieve a restocking list of products close to running out', () => {
    const productsToRestock = stockManager.getRestockingList(1);
    expect(productsToRestock.length).toBe(2);
  });

  test('Throws an exception if the product is not in catalog', () => {
    const nonExistingProductId = "foo";

    expect(()=> {
      stockManager.getProduct(nonExistingProductId);
    }).toThrow(ProductNotInCatalogException);
  });
  
  test('Throws an exception if the product is out of stock', () => {
    //Nefit-Bosch 8kW Monobloc
    const productOutOfStockId = "gn0234i-fvb32559y78tr83h-cnb5y498eff-nf230";

    expect(()=>{
      stockManager.updateStockLevels(productOutOfStockId, 3);
    }).toThrow(ProductOutOfStockException);
  });

});
