import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { products as productsMock } from '@mocks/products';
import { Product } from '@models/Product';

const getProductsListById: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  try {
    const { productId } = event.pathParameters;
    const product = await getProductCall(productId);
    
    return formatJSONResponse({ product });
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify("Product not found")
    }
  }
};

const getProductCall = async (productId: string): Promise<Product> => {
  const product = productsMock.find(({ id }) => id === productId);
  if (!product) {
    return Promise.reject();
  }
  return Promise.resolve(product);
}

export const main = middyfy(getProductsListById);
