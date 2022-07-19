import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { products as productsMock } from '../../mocks/products';
import { Product } from '../../models/Product';

export const getProductsById: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  try {
    const { productId } = event.pathParameters;
    const product = await getProductCall(productId);
    
    return formatJSONResponse({ product });
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

export const getProductCall = async (productId: string): Promise<Product> => {
  const product = productsMock.find(({ id }) => id === productId);
  if (!product) {
    return Promise.reject("Product not found");
  }
  return Promise.resolve(product);
}

export const main = middyfy(getProductsById);
