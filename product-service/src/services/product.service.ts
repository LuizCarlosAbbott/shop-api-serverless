import { Product } from "@models/Product";
import { AppDataSource } from "src/data-source";
import { ProductEntity } from "src/entity/Product";
import { StockEntity } from "src/entity/Stock";
import { convertToProductModel } from "src/utils/utils";

export const getProductCall = async (productId: string): Promise<Product> => {
  const product = await AppDataSource.manager.findOne(ProductEntity, {
    relations: { stock: true },
    where: { id: productId }
  });
  if (!product) {
    return Promise.reject("Product not found");
  }
  return convertToProductModel(product);
}

export const getProductsListCall = async (): Promise<Product[]> => {
  const products = await AppDataSource.manager.find(ProductEntity, {
    relations: { stock: true },
  });

  return products.map(product => convertToProductModel(product));   
}

export const createProductCall = async (product: Product): Promise<void> => {
  const { count, ...productCreation } = product;
  return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.save(ProductEntity, productCreation);
    await transactionalEntityManager.save(StockEntity, { product_id: product.id, count });
  }).catch(error => Promise.reject(error));
}