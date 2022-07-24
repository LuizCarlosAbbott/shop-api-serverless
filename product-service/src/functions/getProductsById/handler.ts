import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { AppDataSource } from '../../data-source';
import { ProductEntity } from '../../entity/Product';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { convertToProductModel } from '../../utils';

export const getProductsById: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  try {
    AppDataSource.initialize().then(async () => {
      const { productId } = event.pathParameters;
      const ProductEntity = await getProductCall(productId);
      const product = convertToProductModel(ProductEntity);
      
      return formatJSONResponse({ product });
    }).catch(error => console.log(error))
  } catch (error) {
    if (error === "Product not found") {
      return {
        statusCode: 404,
        body: JSON.stringify("Product not found")
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify("Something bad happened during your request")
      }
    }
  }
};

export const getProductCall = async (productId: string): Promise<ProductEntity> => {
  const product = AppDataSource.manager.findOne(ProductEntity, {
    relations: { stock: true },
    where: { id: productId }
  });
  if (!product) {
    return Promise.reject("Product not found");
  }
  return product;
}

export const main = middyfy(getProductsById);
