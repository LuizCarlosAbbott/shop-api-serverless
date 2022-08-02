import { Product } from "@models/Product";
import { ProductEntity } from "src/entity/Product";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import * as ProductService from '../../services/product.service';
import * as Utils from "../../utils/utils";

describe('ProductService', () => {
  const productEntityMock: ProductEntity = {
    "description": "Short Product Description1",
    "price": 2.4,
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "title": "ProductOne",
    "stock": { product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa", "count": 4, product: null}
  };
  const productMock: Product = {
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "description": "Short Product Description1",
    "price": 2.4,
    "title": "ProductOne",
    "count": 4
  };
  
  beforeEach(() => {
    jest.spyOn(AppDataSource, 'initialize').mockResolvedValue('' as unknown as DataSource);
    jest.spyOn(AppDataSource, 'destroy').mockResolvedValue();
  })

  it('getProductCall() - should return a Product"', async () => {
    const findOneSpy = jest.spyOn(AppDataSource.manager, 'findOne').mockResolvedValue(productEntityMock);
    const convertToProductModelSpy = jest.spyOn(Utils, 'convertToProductModel').mockReturnValue(productMock);
    const result = await ProductService.getProductCall(productMock.id);

    expect(convertToProductModelSpy).toHaveBeenCalled();
    expect(findOneSpy).toHaveBeenCalled();
    expect(result).toEqual(productMock);
  });

  it('getProductCall() - should return a error: "Product not found"', async () => {
    const findOneSpy = jest.spyOn(AppDataSource.manager, 'findOne').mockResolvedValue(null);
    
    await ProductService.getProductCall("nonexistentid").catch(error => {
      expect(error).toEqual("Product not found");
    });
    
    expect(findOneSpy).toHaveBeenCalled();
  });

  it('getProductsListCall() - should return a Product array', async () => {
    const findOneSpy = jest.spyOn(AppDataSource.manager, 'find').mockResolvedValue([productEntityMock]);
    const convertToProductModelSpy = jest.spyOn(Utils, 'convertToProductModel').mockReturnValue(productMock);
    const result = await ProductService.getProductsListCall();

    expect(convertToProductModelSpy).toHaveBeenCalled();
    expect(findOneSpy).toHaveBeenCalled();
    expect(result).toEqual([productMock]);
  });
});

