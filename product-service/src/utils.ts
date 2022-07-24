import { Product } from "@models/Product"
import { ProductEntity } from "./entity/Product"

export const convertToProductModel = (product: ProductEntity): Product => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    count: product.stock.count
  }
}