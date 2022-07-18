import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Product } from '@models/Product';
import { products as productsMock } from '@mocks/products';

const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products: Product[] = await getProductsListCall();
    return formatJSONResponse({ products });
  } catch (error) {
    return {
      statusCode: 500,
      body: "Something bad happened during your request"
    }
  }
};

const getProductsListCall = async (): Promise<Product[]> => {
  return Promise.resolve(productsMock);
}

export const main = middyfy(getProductsList);
