import { Product } from "@models/Product";
import { randomUUID } from "crypto";
import { AppDataSource } from "src/data-source";
import { ProductEntity } from "src/entity/Product";
import { StockEntity } from "src/entity/Stock";
import { convertToProductModel } from "src/utils/utils";
import validator from 'validator';

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
  const { id = randomUUID(), title, description, count, price } = product;
  
  if (isNotValidProductBody({ id, title, description, count, price })) {
    return Promise.reject("Product data is invalid");
  }
  
  return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.save(ProductEntity, { id, title, description, price });
    await transactionalEntityManager.save(StockEntity, { product_id: id, count });
  }).catch(error => Promise.reject(error));
}

export const isNotValidProductBody = (product: Product): boolean => {
  const { id, title, description, count, price } = product;

  if (!validator.isUUID(id)) {
    return true;
  }

  if (
    typeof title !== "string" || 
    typeof description !== "string" || 
    typeof count !== "number" || 
    typeof price !== "number"
  ) {
    return true;
  }

  return false;
}