import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { products as productsMock } from '@mocks/products';
import { Product } from '@models/Procuts';

const getProductsListById: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { productId } = event.pathParameters;
  const product = await getProductCall(productId);

  return formatJSONResponse({ data: { product }});
};

const getProductCall = async (productId: string): Promise<Product> => {
  const product = productsMock.find(({ id }) => id === productId);
  return Promise.resolve(product);
}

export const main = middyfy(getProductsListById);
