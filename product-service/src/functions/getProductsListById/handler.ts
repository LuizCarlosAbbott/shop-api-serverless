import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';

const getProductsListById: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { productId } = event.pathParameters;

  return formatJSONResponse({
    message: `Hello ${productId}, welcome to the exciting Serverless world! getProductsListById`,
    event,
  });
};

export const main = middyfy(getProductsListById);
