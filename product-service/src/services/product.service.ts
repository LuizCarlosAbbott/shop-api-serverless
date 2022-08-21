import { Product } from "@models/Product";
import { randomUUID } from "crypto";
import validator from 'validator';
import { AppDataSource } from "../data-source";
import { ProductEntity } from "../entity/Product";
import { StockEntity } from "../entity/Stock";
import { convertToProductModel } from "../utils/utils";

export const getProductCall = async (productId: string): Promise<Product> => {
  return await AppDataSource.initialize()
  .then(async () => {
    const product = await AppDataSource.manager.findOne(ProductEntity, {
      relations: { stock: true },
      where: { id: productId }
    });
    if (!product) {
      return Promise.reject("Product not found");
    }
    return convertToProductModel(product);
  })
  .catch(error => error)
  .finally(() => AppDataSource.destroy());
}

export const getProductsListCall = async (): Promise<Product[]> => {
  return await AppDataSource.initialize()
  .then(async () => {
    const products = await AppDataSource.manager.find(ProductEntity, {
      relations: { stock: true },
    });
  
    return products.map(product => convertToProductModel(product));   
  })
  .catch(error => error)
  .finally(() => AppDataSource.destroy());
}

export const createProductCall = async (product: Product): Promise<void> => {
  return await AppDataSource.initialize()
  .then(async () => {
    const { id = randomUUID(), title, description, count, price } = product;
  
    if (isNotValidProductBody({ id, title, description, count, price })) {
      return Promise.reject("Product data is invalid");
    }
    
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(ProductEntity, { id, title, description, price });
      await transactionalEntityManager.save(StockEntity, { product_id: id, count });
    }).catch(error => Promise.reject(error));
  })
  .catch(error => error)
  .finally(() => {
    console.log(`Product creation was successful: ${JSON.stringify(product)}`);
    AppDataSource.destroy();
  });
}

export const createBatchProductCall = async (product: Product): Promise<void> => {
  const { id = randomUUID(), title, description, count, price } = product;

  console.log({ id, title, description, count, price });

  if (isNotValidProductBody({ id, title, description, count, price })) {
    return Promise.reject("Product data is invalid");
  }
  
  return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.save(ProductEntity, { id, title, description, price });
    await transactionalEntityManager.save(StockEntity, { product_id: id, count });
  }).catch(error => Promise.reject(error));
}

const isNotValidProductBody = (product: Product): boolean => {
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