import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Product } from 'src/models/Procuts';
import { products as productsMock } from '@mocks/products';

const getProductsList: APIGatewayProxyHandler = async (event) => {
  const products: Product[] = await getProductsListCall();
  return formatJSONResponse({ products });
};

const getProductsListCall = async (): Promise<Product[]> => {
  return Promise.resolve(productsMock);
}

export const main = middyfy(getProductsList);
