import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { AppDataSource } from '../../data-source';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { getProductCall } from '../../services/product.service';

export const getProductsById: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { productId } = event.pathParameters;
  console.log(`PATH PARAMETERS -> productId:${productId}`);
  
  return await AppDataSource.initialize().then(async () => {
      const product = await getProductCall(productId);
      return formatJSONResponse({ product });
    }).catch(error => {
      console.log(error);
      AppDataSource.destroy();
      if (error === "Product not found") {
        return {
          statusCode: 404,
          body: JSON.stringify("Product not found")
        }
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify("Internal Server Error")
        }
      }
    }).finally(() => AppDataSource.destroy());;
};



export const main = middyfy(getProductsById);
