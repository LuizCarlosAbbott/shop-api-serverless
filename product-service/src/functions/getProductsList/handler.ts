import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { products as productsMock } from '../../mocks/products';
import { Product } from '../../models/Product';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products: Product[] = await getProductsListCall();
    return formatJSONResponse({ products });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Something bad happened during your request")
    }
  }
};

export const getProductsListCall = async (): Promise<Product[]> => {
  return Promise.resolve(productsMock);
}

export const main = middyfy(getProductsList);